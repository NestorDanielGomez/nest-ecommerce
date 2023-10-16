import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadGatewayException, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    //para ver las variables de entorno
    private readonly configService: ConfigService
  ) { }

  @Get("product/:imageName")
  findProductImage(
    @Res() res: Response,
    @Param("imageName") imageName: string) {

    const path = this.filesService.getStaticProductImage(imageName)

    res.sendFile(path)
  }



  @Post("product")
  @UseInterceptors(FileInterceptor("file", {
    fileFilter: fileFilter,
    limits: { fileSize: 500000 },
    storage: diskStorage({
      destination: "./static/products",
      filename: fileNamer

    })
  }))

  uploadImage(
    @UploadedFile() file: Express.Multer.File) {

    if (!file) {
      throw new BadGatewayException("la extensión del archivo no corresponde con una imagen valida")
    }
    const secureUrl = `${this.configService.get("HOST_API")}/files/product/${file.filename}`
    return { secureUrl }
  }

}
