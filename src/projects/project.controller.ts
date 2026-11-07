// @ts-ignore
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, Query, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { projectService } from './project.service';
import { CreateProjectDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { AssignUserDto } from './dto/assign-user.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
 
@Controller('projects')
export class projectController {

  //se inyecta el servicio de proyectos
  constructor(private readonly projectService: projectService) { }



  //-------------------Ruta para obtener los proyectos con sus responsables

  // Obtener proyecto con coordinador, facilitador y voluntarios usando JSON
  @UseGuards(JwtAuthGuard)
  @Post('responsables')
  getProjectResponsables(
    @Body('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.getProjectWithRoles(projectId);
  }

  // ------------------- Rutas de Proyectos -------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProjectDto, @Req() req: any) {
    return this.projectService.create(dto, req.user.userId);
  }

  //listar todos los proyectos con paginacion listar proyectos
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.projectService.findAll(Number(page), Number(limit));
  }

  //listar todos los proyectos paginados y por unidad academica del director
  @UseGuards(JwtAuthGuard)
  @Get('head_master')
  findAllMaster(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('search') search?: string
  ) {
    return this.projectService.findAllHeadMaster(
      Number(page),
      Number(limit),
      req.user.userId,
      status,
      dateFrom,
      dateTo,
      search
    );
  }



  //listar todos los proyectos con sus relaciones
  @Get('all')
  findAll_Project() {
    return this.projectService.findAll_Proyect();
  }



  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProyectoDto,
  ) {
    return this.projectService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }


  // ------------------- Rutas de Facilitador -------------------
  @UseGuards(JwtAuthGuard)
  @Get('facilitator/panel')
  getFacilitatorPanel(@Req() req: any) {
    return this.projectService.getFacilitatorPanel(req.user.userId);
  }

  //nuevo metodo para obtener proyecto con actividad evidencias y voluntarios
  @UseGuards(JwtAuthGuard)
  @Get(':id/details')
  async getProjectDetails(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectService.getProjectFullDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('facilitator/summary')
  getFacilitatorSummary(@Req() req: any) {
    return this.projectService.getFacilitatorSummary(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('enrollment_project/user')
  findAllEnrollmentUser(@Req() req: any) {
    return this.projectService.getUserProjects(req.user.userId);
  }

  // Asignar facilitador a proyecto
    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  @Post('assign-facilitator')
  assignFacilitator(@Body() dto: AssignUserDto) {
    return this.projectService.assignFacilitator(
      dto.projectId,
      dto.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  @Post('assign-coordinator')
  assignCoordinator(@Body() dto: AssignUserDto) {
    return this.projectService.assignCoordinator(
      dto.projectId,
      dto.userId,
    );
  }

  // ------------------- Rutas de director ----------------//

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMINISTRATOR, Role.SCHOOL_DIRECTOR)
  @Get('by-director/:directorId')
  getProjectsByDirector(
    @Param('directorId', ParseIntPipe) directorId: number,
    @Req() req: any,
  ) {
    const userId = Number(req.user.userId);
    const roleName = req.user.role?.name ?? req.user.role;

    if (
      roleName !== Role.ADMINISTRATOR &&
      userId !== directorId
    ) {
      throw new ForbiddenException(
        'No tienes permiso para consultar este director',
      );
    }

    return this.projectService.findProjectsByDirector(directorId);
  }


  // // ------------------- Tipos de Proyecto -------------------
  // @Post('types')
  // createProjectType(@Body() dto: CreateProjectTypeDto) {
  //   return this.projectService.createProjectType(dto);
  // }

  // @Get('types')
  // findAllProjectType() {
  //   return this.projectService.findAllProjectType();
  // }

  // @Get('types/:id')
  // findOneProjectType(@Param('id') id: number) {
  //   return this.projectService.findOneProjectType(id);
  // }

  // @Patch('types/:id')
  // updateProjectType(@Param('id') id: number, @Body() dto: UpdateProjectTypeDto) {
  //   return this.projectService.updateProjectType(id, dto);
  // }

  // @Delete('types/:id')
  // removeProjectType(@Param('id') id: number) {
  //   return this.projectService.removeProjectType(id);
  // }
}