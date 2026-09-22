import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';

import { EvidenceService } from './evidence.service';

import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenciaDto } from './dto/update-evidence.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
//import { extname } from 'path';
//import * as path from 'path';
import { extname } from 'path';
import { Request, Response } from 'express';
//import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { json } from 'stream/consumers';

@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) { }



  @Get('all')
  findAll() {
    return this.evidenceService.findAll();
  }


  @UseGuards(JwtAuthGuard)
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // carpeta donde se guardan los archivos
        filename: (req, file, callback) => {
          // nombre original sin extensión
          let name = file.originalname.split('.')[0];

          // 1. Reemplazar espacios por guiones bajos
          name = name.replace(/\s+/g, '_');

          // 2. Eliminar acentos (tildes)
          name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          // 3. Eliminar caracteres especiales no deseados
          name = name.replace(/[^a-zA-Z0-9_-]/g, '');


          // extensión del archivo
          const fileExtName = extname(file.originalname);
          // nombre aleatorio basado en timestamp
          const randomName = Date.now().toString();
          // callback con el nombre final
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Body() body, @Req() req: any) {
    // 1. Filtrar/parsear el body.adicional
    const data = body.adicional ? JSON.parse(body.adicional) : {};
    let nameFile = file.filename;

    const newData = {
      type: extname(file.originalname),
      filePath: nameFile,
      uploaDate: new Date(),
      activityId: data.activityId,
      userId: req.user.userId,
    }
    return this.evidenceService.create(newData);
  }


  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.evidenceService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file')) // Permite recibir archivos
  async update(
    @Param('id') id: number,
    @Body() updateEvidenciaDto: UpdateEvidenciaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.evidenceService.update(id, updateEvidenciaDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.evidenceService.remove(id);
  }

  @Get('download/:id')
  async downloadDocument(@Param('id') id: number, @Res() res: Response) {
    const filePath = await this.evidenceService.downloadDocument(id);

    if (!filePath) {
      throw new NotFoundException('Documento no encontrado');
    }
    return res.sendFile(filePath);
  }


}





// {
//       message: 'Archivo recibido correctamente',
//       archivo: file.filename,
//       adicional: body.adicional,
//     };