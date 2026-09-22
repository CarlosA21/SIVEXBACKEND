import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { reportService } from './reports.service';
import { CreateReportDto} from './dto/create-report.dto';
import { UpdateReporteDto } from './dto/update-report.dto';


@Controller('reports')
export class reportController {
  constructor(private readonly reportService: reportService) { }


  // Métricas principales
  @Get('kpis')
  async getKPIs() {
    return this.reportService.getKPIs();
  }

  // Usuarios agrupados por unidad académica
  @Get('users-by-unit')
  async getUsersByAcademicUnit() {
    return this.reportService.getUsersByAcademicUnit();
  }

  // Proyectos agrupados por unidad académica
  @Get('projects-by-unit')
  async getProjectsByAcademicUnit() {
    return this.reportService.getProjectsByAcademicUnit();
  }

  // Estado de actividades (completadas, en progreso, pendientes, etc.)
  @Get('activities-status')
  async getActivitiesStatus() {
    return this.reportService.getActivitiesStatus();
  }

  // Inscripciones/Usuarios creados por mes
  @Get('inscriptions-by-month')
  async getInscriptionsByMonth(@Query('year') year: number) {
    return this.reportService.getInscriptionsByMonth(year);
  }

  // Tabla: Usuarios detallados por unidad
  @Get('users-detail')
  async getUsersDetail() {
    return this.reportService.getUsersDetail();
  }

  // Tabla: Proyectos detallados por unidad
  @Get('projects-detail')
  async getProjectsDetail() {
    return this.reportService.getProjectsDetail();
  }






// todavia en desarrollo
  @Post()
  create(@Body() dto: CreateReportDto) {
    return this.reportService.create(dto);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reportService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateReporteDto) {
    return this.reportService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reportService.remove(id);
  }

}