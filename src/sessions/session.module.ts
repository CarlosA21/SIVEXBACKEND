import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {sessionController} from './session.controller';
import {SessionService} from './session.service';
import {Session} from './entities/session.entity';




@Module({
    imports: [
        TypeOrmModule.forFeature([Session])],
    controllers: [sessionController],
    providers: [SessionService],
    exports:[SessionService]
  })
  export class SessionModule {}