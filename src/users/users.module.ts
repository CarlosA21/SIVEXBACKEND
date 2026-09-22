import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { Role  } from '../role/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import {Project} from '../projects/entities/project.entity'
import { ProjectModule } from 'src/projects/project.module';


//import { UsersService } from './users.service';
//import { UsersController } from './users.controller';
//import { User } from './entities/user.entity';
//import { Role } from './entities/role.entity';




@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        ProjectModule ,
        JwtModule.register({})],
    controllers: [UserController],
    providers: [UserService],
    exports:[UserService]
  })
  export class UserModule {}