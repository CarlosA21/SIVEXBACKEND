// src/reports/dto/update-report.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';

export class UpdateReporteDto extends PartialType(CreateReportDto) {}
