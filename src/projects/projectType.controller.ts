// @ts-ignore
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { projectService } from './project.service';
import { CreateProjectDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('/project-types')
export class ProjectTypeController {
  constructor(private readonly projectService: projectService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectTypeDto,
  ) {
    return this.projectService.updateProjectType(id, dto);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.removeProjectType(id);
  }
}
