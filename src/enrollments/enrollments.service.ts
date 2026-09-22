// src/enrollments/enrollments.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createDto: CreateEnrollmentDto): Promise<Enrollment> {
    const { userId, projectId } = createDto;

    // Verificar si el voluntario ya está inscrito en este proyecto
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('User is already enrolled in this project.');
    }

    // Verificar si el usuario y el proyecto existen
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const project = await this.projectRepository.findOne({ where: { id: projectId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    const newEnrollment = this.enrollmentRepository.create({
      user,
      project,
    });

    return this.enrollmentRepository.save(newEnrollment);
  }

  

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentRepository.find({ relations: ['user', 'project'] });
  }

  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['user', 'project'],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found.`);
    }

    return enrollment;
  }

  async remove(id: number): Promise<void> {
    const result = await this.enrollmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Enrollment with ID ${id} not found.`);
    }
  }
}