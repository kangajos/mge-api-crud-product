import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barang } from '../entity/barang.entity';

@Injectable()
export class StokService {
  constructor(
    @InjectRepository(Barang)
    private barangRepository: Repository<Barang>,
  ) {}

  async getStokPerTanggal(tanggal: Date) {
    return this.barangRepository
      .createQueryBuilder('barang')
      .select(['barang.nama_barang', 'barang.stok'])
      .where('barang.updatedAt <= :tanggal', { tanggal })
      .orderBy('barang.nama_barang', 'ASC')
      .getMany();
  }
}
