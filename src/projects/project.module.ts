import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {projectController} from './project.controller';
import {projectService} from './project.service';

import {Project} from './entities/project.entity';
import { ProjectType } from './entities/projectType.entity';

import { ProjectRequest } from 'src/project-requests/entities/project-request.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { ProjectTypeController } from './projectType.controller';
import { UserProjectRole } from './entities/user_project_role.entity';
import { ProjectRequestsModule } from 'src/project-requests/project-requests.module';
import { User } from 'src/users/entities/user.entity';
import { Evidence } from 'src/evidence/entities/evidence.entity';
import { AcademicUnit } from 'src/academic-units/entities/academic-unit.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project,User, ProjectType, ProjectRequest, Activity, Enrollment,UserProjectRole, Evidence, AcademicUnit])],
    controllers: [projectController, ProjectTypeController],
    providers: [projectService],
    exports:[projectService]
  })
  export class ProjectModule {}