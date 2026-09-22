import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { reportController } from './reports.controller';
import { reportService } from './reports.service';
import { Report } from './entities/report.entity';


//modulos
import { UserModule } from 'src/users/users.module';
import { ProjectModule } from 'src/projects/project.module';
import { ActivityModule } from 'src/activities/activity.module';
import { AcademicUnitsModule } from 'src/academic-units/academic-units.module';

//importamos las entidades que utilizaremos en los reportes

import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { AcademicUnit } from 'src/academic-units/entities/academic-unit.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Report, User, Project, Activity, AcademicUnit])],
    controllers: [reportController],
    providers: [reportService],
    exports: [reportService]
})
export class ReportModule { }