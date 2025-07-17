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
