import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Products } from '../../products/entities/product.entity';
import { Inventories } from '../../inventory/entities/inventory.entity';

@Entity()
export class Batches {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('uuid')
  productId: string;

  @ManyToOne(() => Products, (product) => product.batches)
  @JoinColumn({ name: 'productId' })
  product: Products;

  @Column('text')
  code: string;

  @Column({ type: 'date' })
  expirationDate: Date;

  @Column({ type: 'int' })
  quantity: number;

  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToMany(() => Inventories, (inventory) => inventory.batch)
  inventories: Inventories[];
}
