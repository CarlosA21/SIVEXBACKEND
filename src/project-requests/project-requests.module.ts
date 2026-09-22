// src/project-requests/project-requests.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRequest } from './entities/project-request.entity';
import { ProjectRequestsService } from './project-requests.service';
import { ProjectRequestsController } from './project-requests.controller';
import { Project } from 'src/projects/entities/project.entity'; // Asegúrate de la ruta

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRequest, Project])],
  providers: [ProjectRequestsService],
  controllers: [ProjectRequestsController],
  exports: [ProjectRequestsService],
})
export class ProjectRequestsModule {}
