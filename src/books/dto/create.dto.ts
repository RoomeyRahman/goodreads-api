import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto implements Readonly<CreateBookDto> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  genre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  isbn: string;

  constructor(data) {
    if (data) {
      data.name && (this.name = data.name);
      data.author && (this.author = data.author);
      data.genre && (this.genre = data.genre);
      data.isbn && (this.isbn = data.isbn);
    }
  }
}
