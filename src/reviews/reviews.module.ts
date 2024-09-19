import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, Book, User } from '../models';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Book, User])],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
