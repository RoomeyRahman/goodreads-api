import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ENTITY_NAME } from '../common/constant';
import { Review } from './review.entity';

@Entity({ name: ENTITY_NAME.BOOK })
export class Book extends BaseEntity {
    @Column({ type: 'varchar', length: 80 })
    name: string;

    @Column({ type: 'varchar', length: 80 })
    author: string; 

    @Column({ type: 'varchar', length: 80 })
    genre: string; 

    @Column({ type: 'varchar', length: 80 })
    isbn: string; 

    @OneToMany(() => Review, (ref) => ref.book)
    reviews: Review[];
}
