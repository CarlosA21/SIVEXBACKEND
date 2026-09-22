import { Module } from '@nestjs/common';
import {JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/users.module';
import { SessionModule } from 'src/sessions/session.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SessionService } from 'src/sessions/session.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'sJd+3X8KvV5W98L3aB7j1sd2!kL4qL9mB1p5Xx0q7zQ_!',
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME || '2h' },
    }),
    UserModule,
    SessionModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}

//npm install --save @nestjs/passport passport passport-local
//npm install --save-dev @types/passport-local