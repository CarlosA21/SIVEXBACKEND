// src/actividad/dto/update-actividad.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto} from './create-actividad.dto';

export class UpdateActividadDto extends PartialType(CreateActivityDto) {}
