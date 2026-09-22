import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

//import { Role } from './users/entities/role.entity';
import { UserModule,  } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './role/roles.module';
import { MailModule } from './mail/mail.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { ActivityModule } from './activities/activity.module';
import { AuditModule } from './audit/audit.module';
import { EvidenceModule } from './evidence/evidence.module';
import { ProjectModule } from './projects/project.module';
import { ReportModule } from './reports/reports.module';
import { SessionModule } from './sessions/session.module';
import { AlertsModule } from './alerts/alerts.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ProjectRequestsModule } from './project-requests/project-requests.module';
import { EnrollmentRequestsModule } from './enrollment-requests/enrollment-requests.module';
import { AcademicUnitsModule } from './academic-units/academic-units.module';
import { SupportModule } from './support/support.module';
import { MailApiModule } from './mail/mailApi.module';
import { AppController } from './app.controller';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true,
                           envFilePath: '.env'
     }), // Carga .env automáticamente
     TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') === 'development', // Solo sincroniza en desarrollo
      }),
      inject: [ConfigService],
    }),
    
    UserModule,
    AuthModule,
    RolesModule,
    MailModule,
    PasswordResetModule,
    ActivityModule,
    AuditModule,
    EvidenceModule,
    ProjectModule,
    ReportModule,
    SessionModule,
    AlertsModule,
    SupportModule,
    EnrollmentsModule,
    EnrollmentRequestsModule,
    AcademicUnitsModule,
    ProjectRequestsModule,
    MailApiModule,

    ScheduleModule.forRoot()
  ],
  providers:[],
  controllers:[AppController]
})
export class AppModule {}
