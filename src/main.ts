import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RolesService } from './role/roles.service';
import { UserRoles } from './users/user-roles.enum';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const configService = app.get(ConfigService);
  if (configService.get<string>('NODE_ENV') === 'development') {
    const rolesService = app.get(RolesService);

    for (const roleName of Object.values(UserRoles)) {
      try {
        await rolesService.create({ name: roleName });
        console.log(`Role ${roleName} creado exitosamente.`);
      } catch (error) {
        if (
          error instanceof HttpException &&
          error.getStatus() === HttpStatus.BAD_REQUEST
        ) {
          console.log(`El role ${roleName} ya existe.`);
        } else {
          console.error(`Error al crear el role ${roleName}:`, error);
        }
      }
    }
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
