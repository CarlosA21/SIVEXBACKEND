// src/academic-units/dto/create-academic-unit.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAcademicUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  directorId: number;
}