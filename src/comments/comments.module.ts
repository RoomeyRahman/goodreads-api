import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Review, Comment, User } from '../models';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Comment, User])],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
