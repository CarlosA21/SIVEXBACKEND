import { Controller, Get, Put, Delete,Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { activityService } from './activity.service';
import { CreateActivityDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@Controller('activities')
export class activityController {
  constructor(private readonly activityService: activityService) { }
  
  
  @Post()
  create(@Body() dto: CreateActivityDto) {
    return this.activityService.create(dto);
  }

  @Get()
  findAll() {
    return this.activityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActividadDto) {
    return this.activityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.remove(id);
  }

}