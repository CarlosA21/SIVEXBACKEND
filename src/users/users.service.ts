// src/user/user.service.ts
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../role/entities/role.entity';
import { projectService } from 'src/projects/project.service';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly projectService: projectService,
    private jwtService: JwtService,
  ) { }

  // === LIFECYCLE METHODS ===
  async onModuleInit(): Promise<void> {
    try {
      await this.createDefaultAdmin();
    } catch (error) {
      this.logger.error('Error during module initialization:', error);
    }
  }

  // === USER CREATION METHODS ===
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.validateEmailUniqueness(createUserDto.email);

      const role = await this.resolveUserRole(createUserDto.roleId);
      const hashedPassword = await this.hashPassword(createUserDto.password);

      const userData = this.buildUserData(createUserDto, role, hashedPassword);
      return await this.saveUser(userData);
    } catch (error) {
      this.logger.error(`Error creating user: ${createUserDto.email}`, error);

      if (error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating user');
    }
  }

  async AdminUsercreate(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.validateEmailUniqueness(createUserDto.email);

      const role = await this.findRoleById(createUserDto.roleId);
      const hashedPassword = await this.hashPassword(createUserDto.password);

      const userData = this.buildUserData(createUserDto, role, hashedPassword);
      return await this.saveUser(userData);
    } catch (error) {
      this.logger.error(`Error creating admin user: ${createUserDto.email}`, error);

      if (error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating admin user');
    }
  }

  // === FIND METHODS ===
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({ relations: ['role'] });
    } catch (error) {
      this.logger.error('Error finding all users', error);
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async findAllPaginated(page: number = 1, limit: number = 10) {
    try {
      const qb = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.registrationNumber',
          'user.status',
          'role.id',
          'role.name',
        ])
        .orderBy('user.id', 'ASC')
        .skip((page - 1) * limit)
        .take(limit);

      const [users, total] = await qb.getManyAndCount();

      return {
        data: users,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error finding paginated users - page: ${page}, limit: ${limit}`, error);
      throw new InternalServerErrorException('Error retrieving paginated users');
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${id}`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error retrieving user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error retrieving user by email');
    }
  }

  async findByName(name: string): Promise<User> {
    try {
      const user = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.registrationNumber',
          'user.status',
          'role.id',
          'role.name',
        ])
        .where('user.firstName = :name', { name })
        .getOne();

      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by name: ${name}`, error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error retrieving user by name');
    }
  }

  // === UPDATE METHODS ===
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findById(id);

      await this.updateUserPassword(user, updateUserDto);
      await this.updateUserRole(user, updateUserDto);

      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error updating user ID: ${id}`, error);

      if (error instanceof NotFoundException ||
        error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating user');
    }
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    try {
      this.validatePasswordUpdateData(id, hashedPassword);

      const result = await this.userRepository.update(
        { id },
        { password: hashedPassword }
      );

      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      this.logger.error(`Error updating password for user ID: ${id}`, error);

      if (error instanceof NotFoundException ||
        error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating password');
    }
  }

  async updateUserStatus(id: number, status: string): Promise<User> {
    try {
      const user = await this.findById(id);

      // Validar que el status sea uno de los valores permitidos
      const validStatuses = ['active', 'inactive', 'blocked'] as const;
      if (!validStatuses.includes(status as any)) {
        throw new BadRequestException(`Invalid status. Allowed values: ${validStatuses.join(', ')}`);
      }

      user.status = status as 'active' | 'inactive' | 'blocked';
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error updating status for user ID: ${id}`, error);

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating user status');
    }
  }

  // === DELETE METHOD ===
  async delete(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      this.logger.error(`Error deleting user ID: ${id}`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error deleting user');
    }
  }

  // === PROJECT MANAGEMENT ===
  async assignProjectToUser(userId: number, projectId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['projects'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const project = await this.projectService.findOne(projectId);
      user.projects.push(project);

      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error assigning project ${projectId} to user ${userId}`, error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error assigning project to user');
    }
  }

  // === PRIVATE HELPER METHODS ===
  private async createDefaultAdmin(): Promise<void> {
    try {
      const adminRole = await this.roleRepository.findOne({
        where: { name: 'administrator' }
      });

      if (!adminRole) {
        this.logger.warn('Administrator role not found. Skipping default admin creation.');
        return;
      }

      const existingAdmin = await this.userRepository.findOne({
        where: { email: 'admin@example.com' },
      });

      if (!existingAdmin) {
        const hashedPassword = await this.hashPassword('Admin1234');
        const defaultAdmin = this.userRepository.create({
          firstName: 'Default',
          lastName: 'Admin',
          registrationNumber: 'ADMIN-001',
          email: 'admin@example.com',
          password: hashedPassword,
          status: 'active',
          role: adminRole,
        });

        await this.userRepository.save(defaultAdmin);
        this.logger.log('Default administrator user created successfully.');
      } else {
        this.logger.log('Default administrator user already exists.');
      }
    } catch (error) {
      this.logger.error('Error creating default administrator user:', error);
      // No throw aquí para no bloquear la inicialización de la app
    }
  }

  private async validateEmailUniqueness(email: string): Promise<void> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('The email already exists');
      }
    } catch (error) {
      this.logger.error(`Error validating email uniqueness: ${email}`, error);
      throw error;
    }
  }

  private async resolveUserRole(roleId?: number): Promise<Role> {
    try {
      if (roleId != null) {
        return await this.findRoleById(roleId);
      }
      return await this.findDefaultRole();
    } catch (error) {
      this.logger.error(`Error resolving user role for roleId: ${roleId}`, error);
      throw error;
    }
  }

  private async findRoleById(roleId: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneBy({ id: roleId });
      if (!role) {
        throw new NotFoundException('The specified role does not exist');
      }
      return role;
    } catch (error) {
      this.logger.error(`Error finding role by ID: ${roleId}`, error);
      throw error;
    }
  }

  private async findDefaultRole(): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { name: 'VOLUNTEER' }
      });

      if (!role) {
        throw new NotFoundException('The default role "VOLUNTEER" does not exist');
      }
      return role;
    } catch (error) {
      this.logger.error('Error finding default role', error);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      this.logger.error('Error hashing password', error);
      throw new InternalServerErrorException('Error processing password');
    }
  }

  private buildUserData(
    createUserDto: CreateUserDto,
    role: Role,
    hashedPassword: string
  ): DeepPartial<User> {
    try {
      const { firstName, lastName, registrationNumber, email, status } = createUserDto;

      return {
        firstName,
        lastName,
        registrationNumber,
        email,
        password: hashedPassword,
        status,
        role,
      };
    } catch (error) {
      this.logger.error('Error building user data', error);
      throw new InternalServerErrorException('Error building user data');
    }
  }

  private async saveUser(userData: DeepPartial<User>): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Error saving user to database', error);
      throw new InternalServerErrorException('Error saving user');
    }
  }

  private async updateUserPassword(user: User, updateUserDto: UpdateUserDto): Promise<void> {
    try {
      if (updateUserDto.password) {
        user.password = await this.hashPassword(updateUserDto.password);
        delete updateUserDto.password;
      }
    } catch (error) {
      this.logger.error('Error updating user password', error);
      throw error;
    }
  }

  private async updateUserRole(user: User, updateUserDto: UpdateUserDto): Promise<void> {
    try {
      if (updateUserDto.roleId) {
        user.role = await this.findRoleById(updateUserDto.roleId);
        delete updateUserDto.roleId;
      }
    } catch (error) {
      this.logger.error('Error updating user role', error);
      throw error;
    }
  }

  private validatePasswordUpdateData(id: number, hashedPassword: string): void {
    if (!hashedPassword || id <= 0) {
      throw new BadRequestException('Invalid data for password update');
    }
  }
}