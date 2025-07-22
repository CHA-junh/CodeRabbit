import { Module } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';

// COM 관련 컨트롤러들
import { EmployeeController } from './employee.controller';
import { UsersController } from './users.controller';
import { UnitPriceController } from './unit-price.controller';
import { CodeController } from './code.controller';
import { COMZ010M00Controller } from './COMZ010M00.controller';
import { COMZ040P00Controller } from './COMZ040P00.controller';
import { COMZ050P00Controller } from './COMZ050P00.controller';
import { COMZ060P00Controller } from './COMZ060P00.controller';

// COM 관련 서비스들
import { EmployeeService } from './employee.service';
import { UsersService } from './users.service';
import { UnitPriceService } from './unit-price.service';
import { CodeService } from './code.service';
import { COMZ010M00Service } from './COMZ010M00.service';
import { COMZ040P00Service } from './COMZ040P00.service';
import { COMZ050P00Service } from './COMZ050P00.service';
import { COMZ060P00Service } from './COMZ060P00.service';

/**
 * COM 모듈
 * 
 * @description
 * - COM 관련 모든 컨트롤러와 서비스를 관리하는 모듈
 * - 사업관리, 사용자관리, 코드관리, 단가관리 등 COM 기능들을 포함
 * - 화면별 컨트롤러/서비스: COMZ010M00, COMZ040P00, COMZ050P00, COMZ060P00
 * - 공통 기능: Employee, Users, UnitPrice, Code
 * 
 * @controllers
 * - EmployeeController: 직원 관리
 * - UsersController: 사용자 관리  
 * - UnitPriceController: 단가 관리
 * - CodeController: 코드 관리
 * - COMZ010M00Controller: 시스템코드관리
 * - COMZ040P00Controller: 사업번호검색
 * - COMZ050P00Controller: 사업명검색
 * - COMZ060P00Controller: 부서번호검색
 * 
 * @providers
 * - EmployeeService: 직원 관련 비즈니스 로직
 * - UsersService: 사용자 관련 비즈니스 로직
 * - UnitPriceService: 단가 관련 비즈니스 로직
 * - CodeService: 코드 관련 비즈니스 로직
 * - COMZ010M00Service: 시스템코드관리 비즈니스 로직
 * - COMZ040P00Service: 사업번호검색 비즈니스 로직
 * - COMZ050P00Service: 사업명검색 비즈니스 로직
 * - COMZ060P00Service: 부서번호검색 비즈니스 로직
 */
@Module({
  controllers: [
    EmployeeController,
    UsersController,
    UnitPriceController,
    CodeController,
    COMZ010M00Controller,
    COMZ040P00Controller,
    COMZ050P00Controller,
    COMZ060P00Controller,
  ],
  providers: [
    OracleService,
    ProcedureDbParser,
    EmployeeService,
    UsersService,
    UnitPriceService,
    CodeService,
    COMZ010M00Service,
    COMZ040P00Service,
    COMZ050P00Service,
    COMZ060P00Service,
  ],
  exports: [
    EmployeeService,
    UsersService,
    UnitPriceService,
    CodeService,
    COMZ010M00Service,
    COMZ040P00Service,
    COMZ050P00Service,
    COMZ060P00Service,
  ],
})
export class ComModule {} 