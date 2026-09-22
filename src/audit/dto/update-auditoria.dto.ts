// src/auditoria/dto/update-auditoria.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditDto } from './create-auditoria.dto';

export class UpdateAuditoriaDto extends PartialType(CreateAuditDto) {}
