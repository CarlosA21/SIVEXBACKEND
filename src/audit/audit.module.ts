import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import {auditController} from './audit.controller';
import {auditService} from './audit.service';
import {Audit} from './entities/audit.entity';
import { User } from '../users/entities/user.entity';



@Module({
    imports: [
        TypeOrmModule.forFeature([Audit, User])],
    controllers: [auditController],
    providers: [auditService],
    exports:[auditService]
  })
  export class AuditModule {}