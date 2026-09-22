// src/academic-units/academic-units.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AcademicUnitsService } from './academic-units.service';
import { CreateAcademicUnitDto } from './dto/create-academic-unit.dto';
import { UpdateAcademicUnitDto } from './dto/update-academic-unit.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { User } from 'src/users/entities/user.entity';


@Controller('academic-units')
export class AcademicUnitsController {
  constructor(private readonly academicUnitsService: AcademicUnitsService) { }


  // solo administradores pueden crear unidades académicas
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR)
  @Post()
  create(@Body() createDto: CreateAcademicUnitDto) {
    return this.academicUnitsService.create(createDto);
  }

   @Get('directors')
  async getAllDirectors(): Promise<User[]> {
    return this.academicUnitsService.findAllDirectors();
  }


  

  // solo administradores pueden obtener todas las unidades académicas
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.ADMINISTRATOR)
  @Get()
  findAll() {
    return this.academicUnitsService.findAll();
  }

  // solo administradores pueden obtener una unidad académica por id
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicUnitsService.findOne(+id);
  }

 

  // solo administradores pueden actualizar unidades académicas  
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.ADMINISTRATOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAcademicUnitDto) {
    return this.academicUnitsService.update(+id, updateDto);
  }

  // solo administradores pueden eliminar unidades académicas
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicUnitsService.remove(+id);
  }
}