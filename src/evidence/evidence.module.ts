import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evidence } from './entities/evidence.entity';
import { User } from '../users/entities/user.entity';
import { Activity } from '../activities/entities/activity.entity';
import { EvidenceService } from './evidence.service';
import { EvidenceController } from './evidence.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Evidence, Activity, User])],
  controllers: [EvidenceController],
  providers: [EvidenceService],
})
export class EvidenceModule {}