// src/academic-units/academic-units.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicUnit } from './entities/academic-unit.entity';
import { AcademicUnitsService } from './academic-units.service';
import { AcademicUnitsController } from './academic-units.controller';
import { User } from '../users/entities/user.entity'; // Asegúrate de la ruta

@Module({
  imports: [TypeOrmModule.forFeature([AcademicUnit, User])],
  providers: [AcademicUnitsService],
  controllers: [AcademicUnitsController],
  exports: [AcademicUnitsService],
})
export class AcademicUnitsModule {}