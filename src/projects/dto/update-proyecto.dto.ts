// src/projects/dto/update-proyecto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-proyecto.dto';

export class UpdateProyectoDto extends PartialType(CreateProjectDto) {}
