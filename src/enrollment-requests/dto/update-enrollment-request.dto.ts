// src/enrollment-requests/dto/update-enrollment-request.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateEnrollmentRequestDto } from './create-enrollment-request.dto';

// Define the possible statuses for the enrollment request
enum EnrollmentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class UpdateEnrollmentRequestDto extends PartialType(
  CreateEnrollmentRequestDto,
) {
  @IsEnum(EnrollmentStatus)
  @IsNotEmpty()
  status: EnrollmentStatus;
}