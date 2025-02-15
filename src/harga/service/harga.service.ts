import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harga } from '../entity/harga.entity';
import { Barang } from '../../barang/entity/barang.entity';

@Injectable()
export class HargaService {
  constructor(
    @InjectRepository(Harga)
    private hargaRepository: Repository<Harga>,

    @InjectRepository(Barang)
    private barangRepository: Repository<Barang>,
  ) {}

  async addHarga(barangId: number, harga: number, tanggalBerlaku: Date) {
    const barang = await this.barangRepository.findOne({ where: { id: barangId } });
    if (!barang) {
      throw new Error('Barang tidak ditemukan');
    }

    const newHarga = this.hargaRepository.create({
      barang,
      harga,
      tanggal_berlaku: tanggalBerlaku,
    });

    return this.hargaRepository.save(newHarga);
  }

  async getHargaPerTanggal(tanggal: Date) {
    return this.hargaRepository
      .createQueryBuilder('harga')
      .leftJoinAndSelect('harga.barang', 'barang')
      .select(['barang.nama_barang', 'harga.harga'])
      .where('harga.tanggal_berlaku = :tanggal', { tanggal })
      .orderBy('harga.tanggal_berlaku', 'DESC')
      .getMany();
  }

  async getStokPerTanggal(tanggal: Date) {
    return this.hargaRepository
      .createQueryBuilder('harga')
      .leftJoinAndSelect('harga.barang', 'barang')
      .select([
        'barang.nama_barang AS nama_barang',
        'barang.stok AS total_stok',
      ])
      .where('harga.tanggal_berlaku = :tanggal', { tanggal })
      .orderBy('harga.tanggal_berlaku', 'DESC')
      .getRawMany();
  }
}
