import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ENTITY_NAME } from '../common/constant';

@Entity({ name: ENTITY_NAME.USER })
export class User extends BaseEntity {
  @Column({ unique: true, type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  @Exclude()
  password: string;
}
