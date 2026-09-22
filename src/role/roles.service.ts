import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolDto } from './dto/update-role';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async getById(id: number): Promise<Role> {
    const foundRole = await this.roleRepository.findOne({ where: { id:id } });
    if (!foundRole) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return foundRole;
  }

  async create(createRolDto: CreateRoleDto): Promise<Role> {
    const { name, description } = createRolDto;

    // Verificar si el rol ya existe (opcional)
    const exists = await this.roleRepository.findOne({ where: { name: name } });
    if (exists) {
      throw new HttpException('The role already exists.', HttpStatus.BAD_REQUEST);
    }

    const roleData: DeepPartial<Role> = {
      name: name,
      description: description
    };

    const role = this.roleRepository.create(roleData);
    return await this.roleRepository.save(role);
  }

  async update(rol_id: number, updateRolDto: UpdateRolDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id: rol_id } });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    role.name = updateRolDto.name ?? role.name;
    role.description = updateRolDto.description ?? role.description

    return await this.roleRepository.save(role);
  }

  async delete(rol_id: number): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id: rol_id } });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    await this.roleRepository.delete(rol_id);
  }
}