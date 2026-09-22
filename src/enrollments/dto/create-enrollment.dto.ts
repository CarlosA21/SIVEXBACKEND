// src/enrollments/dto/create-enrollment.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}