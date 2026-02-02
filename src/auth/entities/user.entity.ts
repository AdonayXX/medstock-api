import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inventories } from '../../inventory/entities/inventory.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  name: string;

  @Column('text')
  lastName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];
  @OneToMany(() => Inventories, (inventory) => inventory.user)
  inventories: Inventories[];
}
