import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Req,
  Logger,
} from '@nestjs/common';

import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

/**
 * Auth Controller
 */
@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  /**
   * Constructor
   * @param {AuthService} authService
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * User login with jwtToken
   * @Body {AuthDTO} loginDto
   * @returns {Promise<any>}
   */
  @ApiTags('Auth')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return user information.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error!',
  })
  @ApiResponse({
    status: HttpStatus.METHOD_NOT_ALLOWED,
    description: 'Method not allowed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Authentication failed. User not found!',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized access: User verification is necessary or Wrong password',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is deleted or User account is on hold',
  })
  @HttpCode(200)
  @Post('login')
  public async login(
    @Req() req: Request,
    @Body() loginDto: AuthDTO,
  ): Promise<any> {
    const authRes = await this.authService.login(loginDto);
    const result = {
      status: 'SUCCESS',
      data: authRes.user,
      message: 'Login successful',
    };
    req.res.set({
      'X-GOODREADS-KEY': authRes.token,
      'X-GOODREADS-KEY-EXPIRES': authRes.expiresIn,
    });
    return result;
  }
}
