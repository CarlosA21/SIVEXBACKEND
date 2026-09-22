// src/evidence/dto/create-evidence.dto.ts
import { IsString, IsNotEmpty, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateEvidenceDto {

  // @IsString()
  // @IsNotEmpty({ message: 'Type is required' })
  // type: string;

  // @IsString()
  // @IsNotEmpty({ message: 'File path is required' })
  // filePath: string;

  // @IsDateString({}, { message: 'Upload date must be a valid date string' })
  // @IsNotEmpty({ message: 'Upload date is required' })
  // uploadDate: Date;

  @IsInt({ message: 'Activity ID must be an integer' })
  @IsNotEmpty({ message: 'Activity ID is required' })
  activityId: number;

  @IsInt({ message: 'User ID must be an integer' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: number;
}