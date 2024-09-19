import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto implements Readonly<CreateReviewDto> {
  @ApiProperty()
  ratings: number

  @ApiProperty()
  @IsString()
  @MaxLength(5000)
  review: string;

  @ApiProperty()
  @IsString()
  dateStarted: string;

  @ApiProperty()
  @IsString()
  dateFinished: string;

  @ApiProperty()
  book: number;

  constructor(data) {
    if (data) {
      data.ratings && (this.ratings = data.ratings);
      data.review && (this.review = data.review);
      data.dateStarted && (this.dateStarted = data.dateStarted);
      data.dateFinished && (this.dateFinished = data.dateFinished);
      data.book && (this.book = data.book);
    }
  }
}
