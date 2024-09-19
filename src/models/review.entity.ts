import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ENTITY_NAME } from '../common/constant';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity({ name: ENTITY_NAME.REVIEW })
export class Review extends BaseEntity {
    @Column({ type: 'int' })
    ratings: number;

    @Column({ type: 'varchar', length: 800 })
    review: string; 

    @ManyToOne(() => User, (ref) => ref.reviews)
    user: User;

    @ManyToOne(() => Book, (ref) => ref.reviews)
    book: Book;
}
