import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Batches } from '../../batches/entities/batch.entity';
import { Inventories } from '../../inventory/entities/inventory.entity';

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', {
    unique: true,
  })
  sku: string;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @OneToMany(() => Batches, (batch) => batch.product, { eager: true })
  batches: Batches[];
  @OneToMany(() => Inventories, (inventories) => inventories.product)
  inventories: Inventories[];
}
