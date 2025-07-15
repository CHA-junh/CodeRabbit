import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OracleService } from './database/database.provider';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UnitPriceController } from './unit-price.controller';
import { UnitPriceService } from './unit-price.service';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { ProcedureDbParser } from './utils/procedure-db-parser.util';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController, AuthController, EmployeeController, UsersController, UnitPriceController, CodeController],
  providers: [AppService, AuthService, OracleService, EmployeeService, UsersService, UnitPriceService, CodeService, ProcedureDbParser],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
