import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './common/filters';
import {
  LoggingInterceptor,
  TransformInterceptor,
} from './common/interceptors';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfigService } from './common/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfigService.getTypeOrmConfig()),
    UsersModule,
    AuthModule,
    BooksModule,
    ReviewsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
