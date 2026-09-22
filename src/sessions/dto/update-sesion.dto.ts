// src/sessions/dto/update-sesion.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-sesion.dto';

export class UpdateSesionDto extends PartialType(CreateSessionDto) {}
