// src/project-requests/project-requests.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectRequestsService } from './project-requests.service';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@Controller('project-requests')
export class ProjectRequestsController {
  constructor(private readonly projectRequestsService: ProjectRequestsService) { }

  // solo facilitadores pueden crear solicitudes de aprobacion de proyectos
  @UseGuards(JwtAuthGuard)
  @Roles(Role.FACILITATOR)
  @Post()
  create(@Body() createDto: CreateProjectRequestDto, @Req() req: any) {
    return this.projectRequestsService.create(createDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.projectRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectRequestsService.findOne(+id);
  }

  //esta ruta sera usada por el coordinador para aprobar la solicitud de proyecto
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.COORDINATOR)
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectRequestDto) {
    return this.projectRequestsService.update(+id, updateDto);
  }

  // Solo el coordinador elimina solicitudes
  @UseGuards(JwtAuthGuard)
  @Roles(Role.COORDINATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectRequestsService.remove(+id);
  }
}