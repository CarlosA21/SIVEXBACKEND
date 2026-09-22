// src/enrollments/enrollments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { User } from 'src/users/entities/user.entity'; // Asegúrate de la ruta
import { Project } from 'src/projects/entities/project.entity'; // Asegúrate de la ruta

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, User, Project])],
  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}