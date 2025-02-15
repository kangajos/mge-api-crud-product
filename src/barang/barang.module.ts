import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarangService } from './service/barang.service';
import { BarangController } from './controller/barang.controller';
import { Barang } from './entity/barang.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forFeature([Barang]), MulterModule.register({
    dest: './uploads',
  }),],
  controllers: [BarangController],
  providers: [BarangService],
  exports: [BarangService],
})
export class BarangModule { }
