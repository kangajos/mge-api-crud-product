import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { HargaService } from '../service/harga.service';

@Controller('harga')
export class HargaController {
  constructor(private hargaService: HargaService) {}

  @Post(':id')
  async addHarga(
    @Param('id') id: number,
    @Body() body: { harga: number; tanggal_berlaku: string },
  ) {
    return this.hargaService.addHarga(id, body.harga, new Date(body.tanggal_berlaku));
  }

  @Get('per-tanggal')
  async getHargaPerTanggal(@Query('tanggal') tanggal: string) {
    return this.hargaService.getHargaPerTanggal(new Date(tanggal));
  }

  @Get('stok-per-tanggal')
  async getStokPerTanggal(@Query('tanggal') tanggal: string) {
    return this.hargaService.getStokPerTanggal(new Date(tanggal));
  }
}
