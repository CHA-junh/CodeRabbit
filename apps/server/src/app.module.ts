import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OracleService } from './database/database.provider';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmployeeController } from './com/employee.controller';
import { EmployeeService } from './com/employee.service';
import { UsersController } from './com/users.controller';
import { UsersService } from './com/users.service';
import { UnitPriceController } from './com/unit-price.controller';
import { UnitPriceService } from './com/unit-price.service';
import { CodeController } from './com/code.controller';
import { CodeService } from './com/code.service';
import { ProcedureDbParser } from './utils/procedure-db-parser.util';
import { MenuModule } from './menu/menu.module';
import { MenuController } from './menu/menu.controller';
import { DatabaseModule } from './database/database.module';
import { SysModule } from './sys/sys.module';

import { COMZ010M00Controller } from './com/COMZ010M00.controller';
import { COMZ010M00Service } from './com/COMZ010M00.service';
import { COMZ040P00Controller } from './com/COMZ040P00.controller';
import { COMZ040P00Service } from './com/COMZ040P00.service';
import { COMZ050P00Controller } from './com/COMZ050P00.controller';
import { COMZ050P00Service } from './com/COMZ050P00.service';
import { COMZ060P00Controller } from './com/COMZ060P00.controller';
import { COMZ060P00Service } from './com/COMZ060P00.service';
// 공통 서비스/컨트롤러
import { CommonService } from './common/common.service';
import { CommonController } from './common/common.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      sid: process.env.DB_SERVICE,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: false,
    }),
    AuthModule,
    UserModule,
    MenuModule,
    DatabaseModule,
    SysModule,
  ],
  controllers: [
    AppController,
    AuthController,
    EmployeeController,
    UsersController,
    UnitPriceController,
    CodeController,
    COMZ010M00Controller,
    COMZ040P00Controller,
    COMZ050P00Controller,
    COMZ060P00Controller,
    CommonController,
  ],
  providers: [
    AppService,
    AuthService,
    EmployeeService,
    UsersService,
    UnitPriceService,
    CodeService,
    ProcedureDbParser,
    COMZ010M00Service,
    COMZ040P00Service,
    COMZ050P00Service,
    COMZ060P00Service,
    CommonService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
