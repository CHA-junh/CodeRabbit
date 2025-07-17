import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { MenuModule } from './menu/menu.module';
import { MenuController } from './menu/menu.controller';
import { DatabaseModule } from './database/database.module';
import { SysModule } from './sys/sys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // .env 파일을 전역 모듈로 설정
      isGlobal: true,
      // .env 파일의 경로를 프로젝트 루트로 지정
      envFilePath: '../../.env',
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
