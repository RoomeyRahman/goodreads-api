import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements Readonly<CreateUserDto> {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(18)
  @MinLength(5)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/)
  password: string;
}
