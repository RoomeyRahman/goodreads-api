import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '../common/interfaces';
import { User } from '../models';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.payload';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Fetches a user from database by email
   * @param {string} email
   * @returns {Promise<IUser>} queried user data
   */
  private async findByEmail(email: string): Promise<IUser> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new NotFoundException(`User ${email} not found`);
      }

      return user;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  private async validate(loginDTO: AuthDTO): Promise<IUser> {
    try {
      const email = loginDTO.email.toLowerCase();
      return await this.findByEmail(email);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  public async login(
    loginDTO: AuthDTO,
  ): Promise<any | { status: number; message: string }> {
    return this.validate(loginDTO).then((user) => {
      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      if (user.isDeleted) {
        throw new ForbiddenException('User is deleted');
      }

      if (!user.isActive) {
        throw new ForbiddenException('User acount is on hold');
      }

      const passwordIsValid = bcrypt.compareSync(
        loginDTO.password,
        user.password,
      );

      if (!passwordIsValid == true) {
        throw new UnauthorizedException('Unauthorized access: Wrong password');
      }

      const payload = {
        id: user.id,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        expiresIn: 7 * 24 * 60 * 60 * 1000,
        token: accessToken,
        user: payload,
        status: HttpStatus.OK,
      };
    });
  }

  public async validateUserByJwt(payload: JwtPayload) {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.createJwtPayload(user);
  }

  protected createJwtPayload(user) {
    const data: JwtPayload = {
      email: user.email,
    };

    const jwt = this.jwtService.sign(data);

    return {
      expiresIn: 7 * 24 * 60 * 60 * 1000,
      token: jwt,
    };
  }
}
