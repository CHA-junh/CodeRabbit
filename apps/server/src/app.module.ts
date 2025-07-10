import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OracleService } from './database/database.provider';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, OracleService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
