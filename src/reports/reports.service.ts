import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReporteDto } from './dto/update-report.dto';


import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { AcademicUnit } from 'src/academic-units/entities/academic-unit.entity';


import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class reportService {
  constructor(
    @InjectRepository(Report)
    private readonly reporteRepository: Repository<Report>,


    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
    @InjectRepository(AcademicUnit)
    private readonly academicUnitRepo: Repository<AcademicUnit>,






  ) { }



  // === KPIs generales ===
  async getKPIs() {
    const totalUsers = await this.userRepo.count();
    const activeProjects = await this.projectRepo.count({ where: { status: 'active' } });
    const completedActivities = await this.activityRepo.count({ where: { status: 'completed' } });
    const totalUnits = await this.academicUnitRepo.count();

    return {
      totalUsers,
      activeProjects,
      completedActivities,
      totalUnits,
    };
  }

  // === Usuarios por Unidad Académica ===
  async getUsersByAcademicUnit() {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.academicUnit', 'unit')
      .select('unit.name', 'unit')
      .addSelect('COUNT(user.id)', 'total')
      .groupBy('unit.name')
      .getRawMany();
  }

  // === Proyectos por Unidad Académica ===
  async getProjectsByAcademicUnit() {
    return this.projectRepo
      .createQueryBuilder('project')
      .leftJoin('project.academicUnit', 'unit')
      .select('unit.name', 'unit')
      .addSelect('COUNT(project.id)', 'total')
      .groupBy('unit.name')
      .getRawMany();
  }

  // === Estado de Actividades ===
  async getActivitiesStatus() {
    return this.activityRepo
      .createQueryBuilder('activity')
      .select('activity.status', 'status')
      .addSelect('COUNT(activity.id)', 'total')
      .groupBy('activity.status')
      .getRawMany();
  }

  // === Inscripciones (usuarios creados) por mes ===
  async getInscriptionsByMonth(year: number) {

    return this.userRepo
      .createQueryBuilder('user')
      .select("MONTH(user.createdAt)", 'month')
      .addSelect('COUNT(user.id)', 'total')
      .where("YEAR(user.createdAt) = :year", { year })
      .groupBy('MONTH(user.createdAt)')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  // === Tabla Detalle Usuarios ===
  async getUsersDetail() {
    return this.userRepo.find({
      relations: ['academicUnit'],
      select: ['id', 'firstName', 'email'],
    });
  }

  // === Tabla Detalle Proyectos ===
  async getProjectsDetail() {
    return this.projectRepo.find({
      relations: ['academicUnit'],
      select: ['id', 'title', 'status'],
    });
  }



















































  //aun en desarrollo

  async create(dto: CreateReportDto): Promise<Report> {
    const reporte = this.reporteRepository.create({
      ...dto,
      project: dto.projectId ? { proyecto_id: dto.projectId } as any : null,
    });
    return await this.reporteRepository.save(reporte);
  }

  async findAll(): Promise<Report[]> {
    return await this.reporteRepository.find({ relations: ['proyecto'] });
  }

  async findOne(reporte_id: number): Promise<Report> {
    const reporte = await this.reporteRepository.findOne({
      where: { id: reporte_id },
      relations: ['proyecto'],
    });
    if (!reporte) throw new NotFoundException('Reporte no encontrado');
    return reporte;
  }

  async update(reporte_id: number, dto: UpdateReporteDto): Promise<Report> {
    const reporte = await this.findOne(reporte_id);
    Object.assign(reporte, dto);
    if (dto.projectId !== undefined) {
      reporte.project = dto.projectId ? { proyecto_id: dto.projectId } as any : null;
    }
    return await this.reporteRepository.save(reporte);
  }

  async remove(reporte_id: number): Promise<void> {
    const reporte = await this.findOne(reporte_id);
    await this.reporteRepository.remove(reporte);
  }

}