import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barang } from '../entity/barang.entity';
import { Multer } from 'multer';
import { log } from 'console';

@Injectable()
export class BarangService {
    constructor(
        @InjectRepository(Barang)
        private barangRepository: Repository<Barang>,
    ) { }

    // Generate Kode Barang dengan Format BRG/YY/MM/00001
    private async generateKodeBarang(): Promise<string> {
        const latestBarang = await this.barangRepository.find({
            order: { kode_barang: 'DESC' },
            take: 1,
        });

        const date = new Date();
        const year = date.getFullYear().toString().slice(-2); // YY
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // MM

        let counter = 1;
        if (latestBarang.length > 0) {
            const lastKode = latestBarang[0].kode_barang;
            const lastCounter = parseInt(lastKode.split('/')[3]);
            counter = lastCounter + 1;
        }

        return `BRG/${year}/${month}/${counter.toString().padStart(5, '0')}`;
    }

    async createBarang(createBarangDto: any, foto: Multer.File) {
        const kodeBarang = await this.generateKodeBarang();
        const newBarang = this.barangRepository.create({
            nama_barang: createBarangDto.nama_barang,
            kode_barang: kodeBarang,
            stok: createBarangDto.stok,
            harga: createBarangDto.harga,
            foto: foto ? foto.originalname : null,
        });

        return this.barangRepository.save(newBarang);
    }

    async updateBarang(id: number, updateData: any, foto?: Multer.File) {
        const barang = await this.barangRepository.findOne({ where: { id } });

        if (!barang) {
            throw new NotFoundException('Barang tidak ditemukan');
        }

        // Jika ada foto baru, update foto
        if (foto) {
            barang.foto = foto.filename;
        }

        Object.assign(barang, updateData);

        return this.barangRepository.save(barang);
    }

    async updateStok(id: number, jumlah: number) {
        const barang = await this.barangRepository.findOne({ where: { id } });

        if (!barang) {
            throw new NotFoundException('Barang tidak ditemukan');
        }

        const newStok = barang.stok + jumlah;
        if (newStok < 0) {
            throw new BadRequestException('Stok tidak boleh negatif');
        }

        barang.stok = newStok;
        return this.barangRepository.save(barang);
    }

    async getAllBarang() {
        return this.barangRepository.find();
    }

    async findBarangById(barangId: number) {
        const barang = this.barangRepository.findOne({ where: { id: barangId } })

        if (!barang) {
            throw new NotFoundException('barang tidak di temukan.');
        }
        return barang
    }

    async deleteBarang(id: number) {
        this.findBarangById(id);
        const barang = await this.barangRepository.delete(id)
        if (barang.affected === 0) {
            throw new NotFoundException('Barang not found');
        }
        return { message: 'Barang deleted successfully' };
    }
}
