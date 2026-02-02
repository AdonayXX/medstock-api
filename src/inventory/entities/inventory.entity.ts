import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Products } from '../../products/entities/product.entity';
import { User } from '../../auth/entities/user.entity';
import { Batches } from '../../batches/entities/batch.entity';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('inventory_movements')
@Index(['productId', 'createdAt'])
export class Inventories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  // PRODUCT
  @Column('uuid')
  productId: string;

  @ManyToOne(() => Products, (product) => product.inventories, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'productId' })
  product: Products;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // USER
  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.inventories, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // BATCH
  @Column('uuid', { nullable: true })
  batchId: string | null;

  @ManyToOne(() => Batches, (batch) => batch.inventories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'batchId' })
  batch: Batches | null;
}
