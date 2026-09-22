// src/project-requests/dto/update-project-request.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProjectRequestDto } from './create-project-request.dto';

// Define the possible statuses for the project request
enum ProjectRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class UpdateProjectRequestDto extends PartialType(
  CreateProjectRequestDto,
) {
  @IsEnum(ProjectRequestStatus)
  @IsNotEmpty()
  status: ProjectRequestStatus;

  @IsString()
  @IsOptional()
  comments?: string;
}