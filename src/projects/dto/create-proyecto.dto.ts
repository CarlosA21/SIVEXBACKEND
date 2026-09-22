// src/projects/dto/create-project.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsIn,
  IsInt,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsOptional()
  @IsIn(['active', 'inactive', 'completed'], {
    message: 'Invalid status',
  })
  status?: 'active' | 'inactive' | 'completed';

  @IsNotEmpty()
  @IsIn(['extensionism', 'volunteering'], { message: 'Invalid project type' })
  projectType: 'extensionism' | 'volunteering';

  // Relación con AcademicUnit (puede ser opcional en algunos casos)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  academicUnitId: number;

  // Relación ManyToMany con User
  // @IsArray()
  // @IsInt({ each: true })
  // @ArrayNotEmpty()
  // @Type(() => Number)
  // userIds: number[];
}
