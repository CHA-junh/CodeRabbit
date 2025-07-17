import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
=======
>>>>>>> f7e058b8666a60208329caba739e9643c4479079
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

@Module({
  imports: [
<<<<<<< HEAD
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      sid: process.env.DB_SERVICE,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: false,
=======
    ConfigModule.forRoot({
      // .env 파일을 전역 모듈로 설정
      isGlobal: true,
      // .env 파일의 경로를 프로젝트 루트로 지정
      envFilePath: '../../.env',
>>>>>>> f7e058b8666a60208329caba739e9643c4479079
    }),
    AuthModule,
    UserModule,
    MenuModule,
    DatabaseModule,
<<<<<<< HEAD
=======
    SysModule,
>>>>>>> f7e058b8666a60208329caba739e9643c4479079
  ],
  controllers: [
    AppController,
    AuthController,
    EmployeeController,
    UsersController,
    UnitPriceController,
    CodeController,
  ],
  providers: [
    AppService,
    AuthService,
    EmployeeService,
    UsersService,
    UnitPriceService,
    CodeService,
    ProcedureDbParser,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
