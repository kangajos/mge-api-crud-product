import { Controller, Post, Body, Param, UseGuards, Get, UseInterceptors, UploadedFile, Patch, Delete } from '@nestjs/common';
import { BarangService } from '../service/barang.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('barang')
export class BarangController {
  constructor(private barangService: BarangService) { }

  @Get()
  async getAllBarang() {
    return this.barangService.getAllBarang();
  }

  @Get(':id')
  async findBarangById(@Param('id') id: number) {
    return this.barangService.findBarangById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  async createBarang(
    @Body() createBarangDto: any,
    @UploadedFile() foto: Multer.File,
  ) {
    return this.barangService.createBarang(createBarangDto, foto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto',{
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = extname(file.originalname); 
        cb(null, uniqueSuffix + fileExt);
      },
    }),
  })) 
  
  async updateBarang(
    @Param('id') id: number,
    @Body() updateData: any,
    @UploadedFile() foto?: Multer.File, 
  ) {
    return this.barangService.updateBarang(id, updateData, foto);
  }

  @Delete('/:id')
  async deleteBarang(@Param('id') id: number) {
    return this.barangService.deleteBarang(id);
  }
  @Post('update-stok/:id')
  async updateStok(@Param('id') id: number, @Body() body: { jumlah: number }) {
    return this.barangService.updateStok(id, body.jumlah);
  }
}
