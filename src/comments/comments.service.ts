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
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { Review, Comment, User } from '../models';
import { IUser } from '../common/interfaces';
import { SearchQueryDto } from '../common/dtos';

@Injectable()
export class CommentsService {
  /**
   * Constructor
   * @param {Repository<Review>} repository
   */
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Create record
   * @param {IUser} user
   * @param {CreateCommentDto} data
   * @returns {Promise<Review>}
   */
  public async create(data: CreateCommentDto, user: IUser) {
    try {
      const reviewEntity = await this.reviewRepository.findOne({
        where: {
          id: data.review,
        },
      });

      const userEntity = await this.userRepo.findOne({
        where: {
          id: user.id,
        },
      });

      const payload = {
        ...data,
        review: reviewEntity,
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
   * @param {UpdateCommentDto} data
   */
  async update(id: number, data: UpdateCommentDto, user: IUser) {
    try {
      if (data.hasOwnProperty('review')) {
        throw new NotAcceptableException(
          "Review can't be updated",
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
