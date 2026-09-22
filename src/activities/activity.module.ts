import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {activityController} from './activity.controller';
import {activityService} from './activity.service';
import {Activity} from './entities/activity.entity';
import { Project } from '../projects/entities/project.entity';



@Module({
    imports: [
        TypeOrmModule.forFeature([Activity, Project])],
    controllers: [activityController],
    providers: [activityService],
    exports:[activityService]
  })
  export class ActivityModule {}