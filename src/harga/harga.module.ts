import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HargaService } from './service/harga.service';
import { HargaController } from './controller/harga.controller';
import { Harga } from './entity/harga.entity';
import { Barang } from '../barang/entity/barang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Harga, Barang])],
  controllers: [HargaController],
  providers: [HargaService],
  exports: [HargaService],
})
export class HargaModule {}
