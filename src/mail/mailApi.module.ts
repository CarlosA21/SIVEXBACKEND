import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailServiceApi } from './mailApi.service';
import { MailControllerApi } from './mailApi.controller';

@Module({
  imports: [
    ConfigModule, // Asegura que las variables de entorno estén disponibles
  ],
  providers: [MailServiceApi],
  controllers: [MailControllerApi],
  exports: [MailServiceApi], // Si quieres usarlo en otros módulos
})
export class MailApiModule {}