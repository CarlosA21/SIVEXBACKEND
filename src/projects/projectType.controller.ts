import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { projectService } from './project.service';
import { CreateProjectDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';

@Controller('/project-types')
export class ProjectTypeController {
  constructor(private readonly projectService: projectService) {}

  @Post()
  create(@Body() dto: CreateProjectTypeDto) {
    return this.projectService.createProjectType(dto);
  }

  @Get()
  findAll() {
    return this.projectService.findAllProjectType();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.projectService.findOneProjectType(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProjectTypeDto) {
    return this.projectService.updateProjectType(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.projectService.removeProjectType(id);
  }
}