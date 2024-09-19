import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidationPipe, TrimPipe, NullValidationPipe } from '../common/pipes';
import { CreateUserDto } from './dto/create.dto';
import {
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.service.create(createUserDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }
}
