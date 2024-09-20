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

   /**
   * Search and fetch records
   */
   public async find(query: SearchQueryDto, user: IUser) {
    try {
      const filter = (query.filter && JSON.parse(query.filter)) ?? {};
      if (filter && filter.name) {
        filter.name = ILike(`%${filter.review}%`);
      }
      const where = {
        ...filter,
      };

      const sort = (query.sort && JSON.parse(query.sort)) ?? {
        name: 'ASC',
      };
      const order = {
        ...sort,
      };

      const res = await this.repository.find({
        where: where,
        take: query.limit || 10,
        skip: query.skip || 0,
        order: order,
      });

      const result: any = {
        data: res,
      };

      if (query.pagination) {
        const total = await this.repository.count({
          where: where,
        });
        result.pagination = {
          total,
          limit: query.limit,
          skip: query.skip,
        };
      }

      return result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetch a record by id
   * @param {number} id
   */
  public async findById(id: number) {
    try {
      const record = await this.repository.findOne({
        where: {
          id: id,
        },
      });

      if (!record) {
        throw new NotFoundException(`Record #${id} not found`);
      }

      return record;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
