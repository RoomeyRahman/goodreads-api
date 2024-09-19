import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ENTITY_NAME } from '../common/constant';
import { User } from './user.entity';
import { Book } from './book.entity';
import { Comment } from './comments.entity';

@Entity({ name: ENTITY_NAME.REVIEW })
export class Review extends BaseEntity {
    @Column({ type: 'int' })
    ratings: number;

    @Column({ type: 'varchar', length: 800 })
    review: string; 

    @Column({ type: 'varchar', length: 800 })
    dateStarted: string; 

    @Column({ type: 'varchar', length: 800 })
    dateFinished: string; 

    @ManyToOne(() => User, (ref) => ref.reviews)
    user: User;

    @ManyToOne(() => Book, (ref) => ref.reviews)
    book: Book;

    @OneToMany(() => Comment, (ref) => ref.review)
    comments: Comment[];
}
