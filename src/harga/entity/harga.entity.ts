import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Barang } from '../../barang/entity/barang.entity';

@Entity('harga')
export class Harga {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Barang)
  barang: Barang;

  @Column()
  harga: number;

  @Column()
  tanggal_berlaku: Date;
}
