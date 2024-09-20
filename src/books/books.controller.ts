import {
  HttpStatus,
  Controller,
  Body,
  Get,
  HttpException,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../common/decorators';
import { TrimPipe, ValidationPipe } from '../common/pipes';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create.dto';
import { IUser } from 'src/common/interfaces';
import { SearchQueryDto } from 'src/common/dtos';

@Controller('books')
export class BooksController {
  constructor(private readonly service: BooksService) {}

  /**
   * Record create
   * @Body {CreateBrandDto} data
   * @user {IUser} user
   * @returns {Promise<IBrand>}
   */
  @ApiOperation({ summary: 'Record creation' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return Record.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() user: IUser, @Body() data: CreateBookDto) {
    try {
      return this.service.create(data, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  /**
   * Search and fetch records
   */
  @ApiOperation({ summary: 'Get all record' })
  @UsePipes(new ValidationPipe(true))
  @UseGuards(JwtAuthGuard)
  @Get()
  public find(
    @User() user: IUser,
    @Query() query: SearchQueryDto,
  ) {
    try {
      return this.service.find(query, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
  

  /**
   * @Param {number} id
   */
  @ApiOperation({ summary: 'Get record from id' })
  @ApiResponse({ status: 200, description: 'Return record.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User Not found.',
  })
  @Get(':id')
  public async getOne(@Param('id') id: number) {
    try {
      return await this.service.findById(id);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
