import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class activityService {
   constructor(
    @InjectRepository(Activity)
    private readonly actividadRepository: Repository<Activity>,

    @InjectRepository(Project)
    private readonly proyectoRepository: Repository<Project>,
  ) {}


  async create(dto: CreateActivityDto): Promise<Activity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id: dto.projectId } });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${dto.projectId} no encontrado`);
    }

    const actividad = this.actividadRepository.create({
      ...dto,
      project: proyecto,
    });

    return await this.actividadRepository.save(actividad);
  }

  async findAll(): Promise<Activity[]> {
    return await this.actividadRepository.find();
  }

  async findOne(id: number): Promise<Activity> {
    const actividad = await this.actividadRepository.findOne({
      where: { id: id }
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return actividad;
  }

  async update(id: number, dto: UpdateActividadDto): Promise<Activity> {
    const actividad = await this.findOne(id);

    if (dto.projectId) {
      const proyecto = await this.proyectoRepository.findOne({ where: { id: dto.projectId } });
      if (!proyecto) {
        throw new NotFoundException(`Proyecto con ID ${dto.projectId} no encontrado`);
      }
      actividad.project = proyecto;
    }

    Object.assign(actividad, dto);
    return await this.actividadRepository.save(actividad);
  }

  async remove(id: number): Promise<void> {
    const actividad = await this.findOne(id);
    await this.actividadRepository.remove(actividad);
  }
}