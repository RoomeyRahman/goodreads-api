import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

function ToBoolean() {
  return Transform((v) => ['1', 1, 'true', true].includes(v.value));
}

export class SearchQueryDto implements Readonly<SearchQueryDto> {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  organization: number;

  @ApiProperty({ required: false })
  @IsOptional()
  select: any;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  filter: any;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  sort: any;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  pagination: boolean;
}
