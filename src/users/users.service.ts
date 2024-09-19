import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  NotAcceptableException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models';
import { IUser } from '../common/interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';
  /**
   * Constructor
   * @param {Repository<IUser>} repository
   */
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<IUser>,
  ) {}

  /**
   * Create a user with RegisterPayload fields
   * @param {CreateUserDTO} data user payload
   * @returns {Promise<IUser>} created user data
   */
  async create(data: CreateUserDto) {
    try {
      const payload: any = {
        ...data,
      };
      payload.email = payload.email.toLowerCase();
      payload.password = bcrypt.hashSync(data.password, 8);
      return this.repository.save(payload);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
