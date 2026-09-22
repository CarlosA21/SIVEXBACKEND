import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpException,
    HttpStatus,
    UseGuards,
  } from '@nestjs/common';
  import { RolesService } from './roles.service';
  import { CreateRoleDto } from './dto/create-role.dto';
  import { UpdateRolDto } from './dto/update-role';
  import { Role } from './entities/role.entity';
  import { AuthGuard } from '@nestjs/passport';
  
  //@UseGuards(AuthGuard('jwt'))
  @Controller('roles')
  export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
  
    // Ruta para obtener todos los usuarios
    @Get()
    async getAll(): Promise<Role[]> {
      try {
        return await this.rolesService.getAll();
      } catch (error) {
        if (error instanceof Error) {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        throw new HttpException(
          'Error inesperado',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    // Ruta para obtener un roll por su ID
    @Get(':id')
    async getById(@Param('id') id: string): Promise<Role> {
      try {
        const rol = await this.rolesService.getById(Number(id));
        if (!rol) {
          throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        return rol;
      } catch (error) {
        if (error instanceof Error) {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        throw new HttpException(
          'Error inesperado',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    // Ruta para crear un nuevo roll
    @Post()
    async create(@Body() body: CreateRoleDto): Promise<Role> {
      try {
        return await this.rolesService.create(body);
      } catch (error) {
        if (error instanceof Error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('Unexpected error', HttpStatus.BAD_REQUEST);
      }
    }
  
    // Ruta para actualizar un usuario existente
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() body: UpdateRolDto,
    ): Promise<Role> {
      try {
        const rol = await this.rolesService.update(Number(id), body);
        if (!rol) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return rol;
      } catch (error) {
        if (error instanceof Error) {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        throw new HttpException(
          'Unexpected error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    // Ruta para eliminar un usuario
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ message: string }> {
      try {
        await this.rolesService.delete(Number(id));
        return { message: 'User deleted' };
      } catch (error) {
        if (error instanceof Error) {
          throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        throw new HttpException(
          'Unexpected error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }