// src/enrollment-requests/enrollment-requests.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentRequest } from './entities/enrollment-request.entity';
import { EnrollmentRequestsService } from './enrollment-requests.service';
import { EnrollmentRequestsController } from './enrollment-requests.controller';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  imports: [TypeOrmModule.forFeature([EnrollmentRequest]),
    EnrollmentsModule],
  providers: [EnrollmentRequestsService],
  controllers: [EnrollmentRequestsController],
  exports: [EnrollmentRequestsService],
})
export class EnrollmentRequestsModule { }