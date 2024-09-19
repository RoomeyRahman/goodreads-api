import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ENTITY_NAME } from '../common/constant';
import { User } from './user.entity';
import { Book } from './book.entity';
import { Review } from './review.entity';

@Entity({ name: ENTITY_NAME.COMMENT })
export class Comment extends BaseEntity {
    @Column({ type: 'varchar', length: 800 })
    comment: string; 

    @ManyToOne(() => Review, (ref) => ref.comments)
    review: Review;

    @ManyToOne(() => User, (ref) => ref.comments)
    user: User;
}
