// src/academic-units/dto/update-academic-unit.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber } from 'class-validator';
import { CreateAcademicUnitDto } from './create-academic-unit.dto';

export class UpdateAcademicUnitDto extends PartialType(CreateAcademicUnitDto) {
  @IsNumber()
  @IsOptional()
  directorId?: number;
}