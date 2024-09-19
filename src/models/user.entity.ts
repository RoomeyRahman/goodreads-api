import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';
import { ENTITY_NAME } from '../common/constant';
import { Review } from './review.entity';
import { Comment } from './comments.entity';

@Entity({ name: ENTITY_NAME.USER })
export class User extends BaseEntity {
  @Column({ unique: true, type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  @Exclude()
  password: string;

  @OneToMany(() => Review, (ref) => ref.user)
  reviews: Review[];

  @OneToMany(() => Comment, (ref) => ref.user)
  comments: Comment[];
}
