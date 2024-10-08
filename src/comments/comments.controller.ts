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
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { IUser } from '../common/interfaces';
import { CommentsService } from './comments.service';
import { SearchQueryDto } from '../common/dtos';

@ApiTags('Comment')
@ApiBearerAuth()
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('comments')
export class CommentsController {
  /**
   * Constructor
   * @param {ReviewsService} service
   */
  constructor(private readonly service: CommentsService) {}

  /**
   * Record create
   * @Body {CreateCommentDto} data
   * @user {IUser} user
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
  create(@User() user: IUser, @Body() data: CreateCommentDto) {
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
   * Record update
   * @Body {UpdateCommentDto} data
   * @User {IUser} user
   */
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Record update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated record.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async update(
    @User() user: IUser,
    @Param('id') id: number,
    @Body() data: UpdateCommentDto,
  ) {
    try {
      return await this.service.update(id, data, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}


