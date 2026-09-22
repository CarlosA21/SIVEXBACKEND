import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentRequest } from './entities/enrollment-request.entity';
import { CreateEnrollmentRequestDto } from './dto/create-enrollment-request.dto';
import { UpdateEnrollmentRequestDto } from './dto/update-enrollment-request.dto';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { CreateEnrollmentDto } from 'src/enrollments/dto/create-enrollment.dto';

@Injectable()
export class EnrollmentRequestsService {
  constructor(
    @InjectRepository(EnrollmentRequest)
    private readonly enrollmentRequestRepository: Repository<EnrollmentRequest>,

    private readonly enrollmentsService: EnrollmentsService,
  ) { }

  // Función para guardar la petición de inscripción
  async create(createDto: CreateEnrollmentRequestDto, userId: number): Promise<EnrollmentRequest> {
    // Revisar si ya existe una solicitud pendiente para este usuario y proyecto
    const existingRequest = await this.enrollmentRequestRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: createDto.projectId },
        status: 'pending', // Solo bloquea solicitudes pendientes
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Ya existe una solicitud pendiente para este proyecto.');
    }

    // Crear la nueva solicitud
    const newRequest = this.enrollmentRequestRepository.create({
      user: { id: userId },           // usuario logueado
      project: { id: createDto.projectId },
      comments: createDto.comments,
      status: 'pending',              // siempre inicia como pendiente
    });

    return this.enrollmentRequestRepository.save(newRequest);
  }

  findAll(): Promise<EnrollmentRequest[]> {
    return this.enrollmentRequestRepository.find({ relations: ['user', 'project'] });
  }


  findAllEnromentUser(userId: number): Promise<EnrollmentRequest[]> {
    // Añadimos una condición 'where' para filtrar por el ID del usuario.
    // TypeORM mapeará automáticamente 'user.id' a la columna 'user_id' en la tabla 'enrollment_requests'
    // debido a la relación ManyToOne y el @JoinColumn({ name: 'user_id' }).
    return this.enrollmentRequestRepository.find({
      relations: ['user', 'project'], // Incluye las relaciones 'user' y 'project'
      where: {
        user: {
          id: userId, // Filtra por el ID del usuario
        },
      },
    });
  }

  async findOne(id: number): Promise<EnrollmentRequest> {
    const request = await this.enrollmentRequestRepository.findOne({
      where: { id },
      relations: ['user', 'project'],
    });
    if (!request) {
      throw new NotFoundException(`Enrollment request with ID ${id} not found.`);
    }
    return request;
  }

  async update(id: number, updateDto: UpdateEnrollmentRequestDto): Promise<EnrollmentRequest> {
    const request = await this.enrollmentRequestRepository.findOne({
      where: { id },
      relations: ['user', 'project'],
    });

    if (!request) {
      throw new NotFoundException(`Enrollment request with ID ${id} not found.`);
    }

    if (!updateDto.status) {
      throw new BadRequestException('Status is required to update enrollment request.');
    }

    request.status = updateDto.status;

    if (updateDto.status === 'approved') {
      // Aquí podrías llamar a EnrollmentService para registrar la inscripción real
      // await this.enrollmentService.create({ userId: request.user.id, projectId: request.project.id });

      const enrollmentDto: CreateEnrollmentDto = {
        userId: request.user.id,
        projectId: request.project.id,
      };
      await this.enrollmentsService.create(enrollmentDto);
    }

    return this.enrollmentRequestRepository.save(request);
  }

  async remove(id: number): Promise<void> {
    const result = await this.enrollmentRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Enrollment request with ID ${id} not found.`);
    }
  }
}
