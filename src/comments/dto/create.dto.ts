import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto implements Readonly<CreateCommentDto> {
  @ApiProperty()
  comment: string

  @ApiProperty()
  review: number;

  constructor(data) {
    if (data) {
      data.comment && (this.comment = data.comment);
      data.review && (this.review = data.review);
    }
  }
}
