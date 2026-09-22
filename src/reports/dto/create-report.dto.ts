// src/reports/dto/create-report.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsIn, IsDateString, IsInt } from 'class-validator';

export class CreateReportDto {
  @IsDateString({}, { message: 'Generation date must be a valid date string' })
  generationDate: Date;

  @IsString()
  @IsNotEmpty({ message: 'Report type is required' })
  type: string;

  @IsIn(['PDF', 'Excel'], { message: 'Invalid format. Must be PDF or Excel' })
  format: 'PDF' | 'Excel';

  @IsOptional()
  @IsInt({ message: 'Project ID must be an integer' })
  projectId?: number;
}
