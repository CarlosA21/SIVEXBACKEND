import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { MailService } from '../mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '.././users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/users/users.module';
import { MailServiceApi } from 'src/mail/mailApi.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    JwtModule.registerAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory:async(configService: ConfigService)=>({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions:{expiresIn:'1h'},
        })
    }),
  ],
  controllers: [PasswordResetController],
  providers: [PasswordResetService, MailService, MailServiceApi],
  
})
export class PasswordResetModule {}
