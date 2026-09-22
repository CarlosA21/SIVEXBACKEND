import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EnrollmentRequestsService } from './enrollment-requests.service';
import { CreateEnrollmentRequestDto } from './dto/create-enrollment-request.dto';
import { UpdateEnrollmentRequestDto } from './dto/update-enrollment-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@Controller('enrollment-requests')
export class EnrollmentRequestsController {
  constructor(private readonly enrollmentRequestsService: EnrollmentRequestsService) { }

  // Solo voluntarios pueden crear solicitudes
  @UseGuards(JwtAuthGuard)
  @Roles(Role.VOLUNTEER)
  @Post()
  create(@Body() createDto: CreateEnrollmentRequestDto, @Req() req: any) {
    const userId = req.user.userId; // el usuario viene del token
    return this.enrollmentRequestsService.create(createDto, userId);
  }

  @Get('/all')
  findAll() {
    return this.enrollmentRequestsService.findAll();
  }
  

  //solicitudes de inscripcion de usuaio
  @UseGuards(JwtAuthGuard)
  @Get('/all_enrollmet_user')
  findAllEnrollmentUser(@Param('id') id: number, @Req() req: any) {
    return this.enrollmentRequestsService.findAllEnromentUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentRequestsService.findOne(+id);
  }

  // Solo el coordinador aprueba o rechaza solicitudes
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.COORDINATOR)
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEnrollmentRequestDto) {
    return this.enrollmentRequestsService.update(+id, updateDto);
  }



  // Solo el coordinador elimina solicitudes
  @UseGuards(JwtAuthGuard)
  @Roles(Role.COORDINATOR)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentRequestsService.remove(+id);
  }
}
