import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() dto: CreateAlertDto) {
    return this.alertsService.create(dto);
  }

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.alertsService.markAsRead(+id);
  }
}
