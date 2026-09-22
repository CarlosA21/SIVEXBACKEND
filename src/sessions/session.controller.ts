import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';


@Controller('sessions')
export class sessionController {
  constructor(private readonly sessionService: SessionService) {}

  // @Post()
  // create(@Body() dto: CreateSessionDto) {
  //   return this.sessionService.create(dto);
  // }

  // @Get()
  // findAll() {
  //   return this.sessionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.sessionService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() dto: UpdateSesionDto) {
  //   return this.sessionService.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.sessionService.remove(id);
  // }
}