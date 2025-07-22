/**
 * SysModule - 사용자 역할 관리 모듈
 * 
 * 주요 기능:
 * - 사용자 역할 관리 (CRUD)
 * - 프로그램 그룹별 사용자 역할 연결 관리
 * - 메뉴 정보 관리
 * - 사용자 역할 복사 기능
 * 
 * 포함된 컴포넌트:
 * - SysController: 사용자 역할 관리 API 컨트롤러
 * - SysService: 사용자 역할 관리 비즈니스 로직
 * 
 * 연관 엔티티:
 * - TblUserRole: 사용자 역할 정보
 * - TblUserRolePgmGrp: 사용자 역할별 프로그램 그룹 연결
 * - TblMenuInf: 메뉴 정보
 * - TblPgmGrpInf: 프로그램 그룹 정보
 * 
 * API 엔드포인트:
 * - GET /api/sys/menus - 메뉴 목록 조회
 * - GET /api/sys/user-roles - 사용자 역할 목록 조회
 * - POST /api/sys/user-roles - 사용자 역할 저장
 * - GET /api/sys/user-roles/:usrRoleId/program-groups - 역할별 프로그램 그룹 조회
 * - GET /api/sys/program-groups - 전체 프로그램 그룹 조회
 * - POST /api/sys/user-roles/:usrRoleId/program-groups - 역할별 프로그램 그룹 저장
 * - POST /api/sys/user-roles/:usrRoleId/copy - 사용자 역할 복사
 * 
 * 사용 화면:
 * - SYS1003M00: 사용자 역할 관리 화면
 * 
 * 의존성:
 * - TypeORM: 데이터베이스 ORM
 * - NestJS Common: 기본 NestJS 기능
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { TblMenuInf } from '../entities/tbl-menu-inf.entity';
import { TblPgmGrpInf } from '../entities/tbl-pgm-grp-inf.entity';
import { SysController } from './SYS1003M00.controller';
import { SysService } from './SYS1003M00.service';

@Module({
  imports: [
    // TypeORM 엔티티 등록
    TypeOrmModule.forFeature([
      TblUserRole,        // 사용자 역할 정보
      TblUserRolePgmGrp,  // 사용자 역할별 프로그램 그룹 연결
      TblMenuInf,         // 메뉴 정보
      TblPgmGrpInf,       // 프로그램 그룹 정보
    ]),
  ],
  controllers: [SysController], // API 컨트롤러 등록
  providers: [SysService],      // 서비스 등록
})
export class SysModule {}
