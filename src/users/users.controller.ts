import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe, ValidationPipe, HttpException, HttpStatus, ConflictException, UseGuards, HttpCode, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AssignProjectToUserDto } from './dto/assign-project-to-user.dto'
import { parseEnv } from 'util';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

//controller para la gestion de usuarios
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) { }


  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {

      const user = await this.usersService.create(createUserDto);

      return { message: 'User created successfully', user }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT); // 409 Conflict
      }
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR);

    }

  }


  @Get(':id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.findById(id);

  }

  @Get('by-name/:name')
  getUserByName(@Param('name') name: string): Promise<User> {
    return this.usersService.findByName(name);

  }

  @Get('by-email/:email')
  getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);

  }

  

  //listar todos los usuarios con paginacion
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAllPaginated(Number(page), Number(limit));
  }




  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  // Delete user - only for ADMINISTRATOR role
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.usersService.delete(id);
      return { message: 'User deleted successfully' }; // Opcional: mensaje de éxito
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post('create-management-user')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.CREATED)
  async createManagementUser(@Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto) {
    try {
      if (!createUserDto.roleId) {
        throw new HttpException('Role ID is required for this action.', HttpStatus.BAD_REQUEST);
      }
      const newUser = await this.usersService.AdminUsercreate(createUserDto);
      return { message: 'Management user created successfully', user: newUser };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR)
  @Post('assign-project')
  @HttpCode(HttpStatus.OK)
  async assignProjectToUser(@Body() assignDto: AssignProjectToUserDto) {
    const { userId, projectId } = assignDto;
    await this.usersService.assignProjectToUser(userId, projectId);
    return {
      message: 'Proyecto asignado al usuario exitosamente.',
    };
  }

  // @Delete('unassign-project')
  // @HttpCode(HttpStatus.OK)
  // async unassignProjectFromUser(@Body() assignDto: AssignProjectToUserDto) {
  //   const { userId, projectId } = assignDto;
  //   await this.usersService.quitarProyectoDeUsuario(userId, projectId);
  //   return {
  //     message: 'Proyecto desasignado del usuario exitosamente.',
  //   };
  // }


}  
