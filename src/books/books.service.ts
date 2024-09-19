import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../models';
import { SearchQueryDto } from '../common/dtos';
import { CreateBookDto } from './dto/create.dto';
import { IUser } from '../common/interfaces';

@Injectable()
export class BooksService {
  /**
   * Constructor
   * @param {Repository<Brand>} repository
   */
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,
  ) {}


  /**
   * Create record
   * @param {IUser} user
   * @param {CreateBookDto} data
   * @returns {Promise<IBrand>}
   */
  public async create(data: CreateBookDto, user: IUser) {
    try {
      const payload = {
        ...data,
        createdBy: String(user.id),
      };
      return await this.repository.save(payload);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all books`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
