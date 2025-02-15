import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('barang')
export class Barang {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama_barang: string;

  @Column({ unique: true })
  kode_barang: string;

  @Column()
  stok: number;

  @Column()
  harga: number;

  @Column({ nullable: true })
  foto: string;
}
