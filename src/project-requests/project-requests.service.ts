// src/project-requests/project-requests.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectRequest } from './entities/project-request.entity';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { UpdateProjectRequestDto } from './dto/update-project-request.dto';
import { Project } from 'src/projects/entities/project.entity'; // Asegúrate de la ruta

@Injectable()
export class ProjectRequestsService {
  constructor(
    @InjectRepository(ProjectRequest)
    private readonly projectRequestRepository: Repository<ProjectRequest>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) { }

  async create(createDto: CreateProjectRequestDto, idFacilitador: number): Promise<ProjectRequest> {
    // Verificar si ya existe una solicitud pendiente para este proyecto
    const existingRequest = await this.projectRequestRepository.findOne({
      where: {
        project: { id: createDto.projectId },
        status: 'pending'
      },
    });

    if (existingRequest) {
      throw new BadRequestException('A pending request for this project already exists.');
    }

    const newRequest = this.projectRequestRepository.create({
      project: { id: createDto.projectId },
      facilitator: { id: idFacilitador },
      comments: createDto.comments,
    });

    return this.projectRequestRepository.save(newRequest);
  }

  async findAll(): Promise<ProjectRequest[]> {
    return this.projectRequestRepository.find({ relations: ['project', 'facilitator'] });
  }

  async findOne(id: number): Promise<ProjectRequest> {
    const request = await this.projectRequestRepository.findOne({
      where: { id },
      relations: ['project', 'facilitator'],
    });
    if (!request) {
      throw new NotFoundException(`Project request with ID ${id} not found.`);
    }
    return request;
  }

  async update(
    id: number,
    updateDto: UpdateProjectRequestDto,
  ): Promise<ProjectRequest> {
    const request = await this.projectRequestRepository.findOne({
      where: { id },
      relations: ['project'], // para poder acceder al proyecto si se aprueba
    });

    if (!request) {
      throw new NotFoundException(`Project request with ID ${id} not found.`);
    }

    // actualizar únicamente el status de la solicitud
    request.status = updateDto.status;

    // si la solicitud fue aprobada, activar el proyecto asociado
    if (updateDto.status === 'approved' && request.project) {
      request.project.status = 'active';
      await this.projectRepository.save(request.project);
    }

    return this.projectRequestRepository.save(request);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project request with ID ${id} not found.`);
    }
  }
}