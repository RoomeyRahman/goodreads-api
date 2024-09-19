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
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { Review, Book, User } from '../models';
import { IUser } from '../common/interfaces';
import { SearchQueryDto } from '../common/dtos';

@Injectable()
export class ReviewsService {
  /**
   * Constructor
   * @param {Repository<Review>} repository
   */
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Create record
   * @param {IUser} user
   * @param {CreateReviewDto} data
   * @returns {Promise<Review>}
   */
  public async create(data: CreateReviewDto, user: IUser) {
    try {
      const bookEntity = await this.bookRepo.findOne({
        where: {
          id: data.book,
        },
      });

      const userEntity = await this.userRepo.findOne({
        where: {
          id: user.id,
        },
      });

      const payload = {
        ...data,
        book: bookEntity,
        user: userEntity,
        createdBy: String(user.id),
      };
      return await this.repository.save(payload);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit record
   * @param {IUser} user
   * @param {number} id
   * @param {UpdateReviewDto} data
   */
  async update(id: number, data: UpdateReviewDto, user: IUser) {
    try {
      if (data.hasOwnProperty('book')) {
        throw new NotAcceptableException(
          "Book can't be updated",
        );
      }

      const record = await this.repository.findOne({
        where: {
          id: id,
        },
      });
      if (!record) {
        throw new NotFoundException('Record not found.');
      }

      const payload = {
        ...record,
        ...data,
        updatedBy: user && String(user.id),
        updatedAt: new Date(),
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
        filter.review = ILike(`%${filter.review}%`);
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
}