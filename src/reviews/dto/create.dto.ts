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
  organization: number;

  constructor(data) {
    if (data) {
      data.ratings && (this.ratings = data.ratings);
      data.review && (this.review = data.review);
    }
  }
}
