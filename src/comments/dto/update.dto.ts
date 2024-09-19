import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto implements Readonly<UpdateCommentDto> {
  @ApiProperty()
  comment: string

  constructor(data) {
    if (data) {
      data.comment && (this.comment = data.comment);
    }
  }
}
