import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { TblPgmGrp } from '../entities/tbl-pgm-grp.entity';
import { TblMenuInf } from '../entities/tbl-menu-inf.entity';
import { TblPgmGrpInf } from '../entities/tbl-pgm-grp-inf.entity';
import { toCamelCase } from '../utils/toCamelCase';

interface SaveUserRolesPayload {
  createdRows: TblUserRole[];
  updatedRows: TblUserRole[];
  deletedRows: TblUserRole[];
}

@Injectable()
export class SysService {
  constructor(
    @InjectRepository(TblUserRole)
    private userRoleRepository: Repository<TblUserRole>,
    @InjectRepository(TblUserRolePgmGrp)
    private pgmGrpRepository: Repository<TblUserRolePgmGrp>,
    @InjectRepository(TblMenuInf)
    private menuInfRepository: Repository<TblMenuInf>,
  ) {}

  async findAllMenus(): Promise<TblMenuInf[]> {
    try {
      return await this.menuInfRepository.find({
        where: { useYn: 'Y' },
        order: {
          menuId: 'ASC',
        },
      });
    } catch (error) {
      console.error('Error finding all menus:', error);
      throw error;
    }
  }

  async findAllUserRoles(
    usrRoleId?: string,
    useYn?: string,
  ): Promise<TblUserRole[]> {
    try {
      console.log('=== 사용자역할 조회 시작 ===');
      console.log('입력 파라미터:', { usrRoleId, useYn });
      console.log('usrRoleId 타입:', typeof usrRoleId, '값:', usrRoleId);
      console.log('useYn 타입:', typeof useYn, '값:', useYn);
      const queryBuilder = this.userRoleRepository.manager
        .createQueryBuilder(TblUserRole, 'ur')
        .leftJoin('TBL_MENU_INF', 'm', 'ur.menuId = m.menuId')
        .leftJoin('TBL_USER_INF', 'u', 'ur.usrRoleId = u.usrRoleId')
        .select([
          'ur.usrRoleId as USR_ROLE_ID',
          'ur.menuId as MENU_ID',
          'm.menuNm as MENU_NM',
          'ur.usrRoleNm as USR_ROLE_NM',
          'ur.athrGrdCd as ATHT_GRD_CD',
          'ur.useYn as USE_YN',
          'COUNT(u.userId) as CNT',
          'ur.orgInqRngCd as ORG_INQ_RANG_CD',
          'ur.baseOutputScrnPgmIdCtt as BASE_OUTPUT_SCRN_PGM_ID_CTT',
        ]);

      // 조회 조건 적용 (GROUP BY 이전에 적용)
      if (usrRoleId && usrRoleId.trim()) {
        queryBuilder.andWhere(
          '(ur.usrRoleId LIKE :usrRoleId OR ur.usrRoleNm LIKE :usrRoleNm)',
          {
            usrRoleId: `${usrRoleId}%`,
            usrRoleNm: `%${usrRoleId}%`,
          },
        );
        console.log('사용자역할코드/명 조건 적용:', usrRoleId);
      }

      if (useYn && useYn.trim()) {
        queryBuilder.andWhere('ur.useYn = :useYn', { useYn });
        console.log('사용여부 조건 적용:', useYn);
      }

      // 기본 쿼리 결과 확인 (조건 적용 전)
      const allRows = await this.userRoleRepository.manager
        .createQueryBuilder(TblUserRole, 'ur')
        .select(['ur.usrRoleId', 'ur.usrRoleNm', 'ur.useYn'])
        .getRawMany();
      console.log('=== 전체 사용자역할 데이터 (조건 적용 전) ===');
      console.log('총 개수:', allRows.length);
      console.log(
        'useYn 값들:',
        allRows.map((row) => ({
          usrRoleId: row.ur_usrRoleId,
          usrRoleNm: row.ur_usrRoleNm,
          useYn: row.ur_useYn,
        })),
      );

      const rawRows = await queryBuilder
        .groupBy(
          'ur.usrRoleId, ur.menuId, m.menuNm, ur.usrRoleNm, ur.athrGrdCd, ur.useYn, ur.orgInqRngCd, ur.baseOutputScrnPgmIdCtt',
        )
        .orderBy('ur.usrRoleId')
        .getRawMany();

      // 쿼리 결과 로그 출력
      console.log('사용자역할 조회 조건:', { usrRoleId, useYn });
      console.log('사용자역할 쿼리 결과 개수:', rawRows.length);
      console.log('사용자역할 쿼리 결과 (처음 3개):', rawRows.slice(0, 3));

      return toCamelCase(rawRows);
    } catch (error) {
      console.error('Error finding all user roles:', error);
      throw error;
    }
  }

  async saveUserRoles(payload: SaveUserRolesPayload): Promise<TblUserRole[]> {
    const queryRunner =
      this.userRoleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { createdRows, updatedRows, deletedRows } = payload;
      const savedRoles: TblUserRole[] = [];

      if (deletedRows && deletedRows.length > 0) {
        const deleteIds = deletedRows.map((row) => row.usrRoleId);
        await queryRunner.manager.delete(TblUserRole, deleteIds);
      }

      // 엔티티의 @BeforeInsert 데코레이터에서 자동으로 usrRoleId 생성
      const processedCreatedRows = createdRows;

      const upsertRows = [...processedCreatedRows, ...updatedRows];
      if (upsertRows && upsertRows.length > 0) {
        // 엔티티 인스턴스로 변환하여 @BeforeInsert 데코레이터가 동작하도록 함
        const entityInstances = upsertRows.map((row) => {
          const entity = new TblUserRole();
          Object.assign(entity, row);

          // 신규 생성 시에만 등록일시 설정
          if (!row.usrRoleId || row.usrRoleId.trim() === '') {
            entity.regDttm = ''; // @BeforeInsert에서 자동 설정
            entity.chngrId = 'SYSTEM'; // TODO: 인증 시스템 구현 후 실제 사용자 ID로 변경
          } else {
            // 수정 시 변경일시 설정
            entity.chngDttm = ''; // @BeforeUpdate에서 자동 설정
            entity.chngrId = 'SYSTEM'; // TODO: 인증 시스템 구현 후 실제 사용자 ID로 변경
          }

          return entity;
        });

        const saved = await queryRunner.manager.save(
          TblUserRole,
          entityInstances,
        );
        savedRoles.push(...saved);
      }

      await queryRunner.commitTransaction();
      return savedRoles;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error saving user roles:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findProgramGroupsByRoleId(usrRoleId: string): Promise<any[]> {
    const rawRows = await this.pgmGrpRepository.manager
      .createQueryBuilder(TblPgmGrpInf, 'pg')
      .leftJoin(
        TblUserRolePgmGrp,
        'urpg',
        'pg.PGM_GRP_ID = urpg.PGM_GRP_ID AND urpg.USR_ROLE_ID = :usrRoleId',
        { usrRoleId },
      )
      .leftJoin(
        TblUserRolePgmGrp,
        'urpg_all',
        'pg.PGM_GRP_ID = urpg_all.PGM_GRP_ID',
      )
      .leftJoin('TBL_USER_INF', 'u', 'urpg_all.usrRoleId = u.usrRoleId')
      .select([
        'pg.PGM_GRP_ID as PGM_GRP_ID',
        'pg.PGM_GRP_NM as PGM_GRP_NM',
        'pg.USE_YN as PGM_GRP_USE_YN', // 프로그램그룹 자체의 사용여부
        'urpg.USR_ROLE_ID as USR_ROLE_ID',
        'urpg.USE_YN as USE_YN',
        'COUNT(DISTINCT u.userId) as CNT',
      ])
      .groupBy(
        'pg.PGM_GRP_ID, pg.PGM_GRP_NM, pg.USE_YN, urpg.USR_ROLE_ID, urpg.USE_YN',
      )
      .orderBy('pg.PGM_GRP_ID')
      .getRawMany();

    // 쿼리 결과 로그 출력
    console.log('프로그램그룹 쿼리 결과:', rawRows);

    // key를 camelCase로 변환해서 반환
    return toCamelCase(rawRows);
  }

  // 모든 프로그램 그룹 조회 (신규 시 사용)
  async findAllProgramGroups(): Promise<any[]> {
    const rawRows = await this.pgmGrpRepository.manager
      .createQueryBuilder(TblPgmGrpInf, 'pg')
      .leftJoin(
        TblUserRolePgmGrp,
        'urpg_all',
        'pg.PGM_GRP_ID = urpg_all.PGM_GRP_ID',
      )
      .leftJoin('TBL_USER_INF', 'u', 'urpg_all.usrRoleId = u.usrRoleId')
      .select([
        'pg.PGM_GRP_ID as PGM_GRP_ID',
        'pg.PGM_GRP_NM as PGM_GRP_NM',
        'pg.USE_YN as PGM_GRP_USE_YN', // 프로그램그룹 자체의 사용여부
        'COUNT(DISTINCT u.userId) as CNT',
      ])
      .groupBy('pg.PGM_GRP_ID, pg.PGM_GRP_NM, pg.USE_YN')
      .orderBy('pg.PGM_GRP_ID')
      .getRawMany();

    // 쿼리 결과 로그 출력
    console.log('전체 프로그램그룹 쿼리 결과:', rawRows);

    // key를 camelCase로 변환해서 반환
    return toCamelCase(rawRows);
  }

  async saveProgramGroupsForRole(
    usrRoleId: string,
    pgmGrps: TblUserRolePgmGrp[],
  ): Promise<void> {
    const queryRunner =
      this.pgmGrpRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 해당 역할의 기존 프로그램 그룹 연결을 모두 삭제
      await queryRunner.manager.delete(TblUserRolePgmGrp, { usrRoleId });

      // 2. 새로운 프로그램 그룹 목록을 저장 (pgmGrps가 비어있지 않은 경우)
      if (pgmGrps && pgmGrps.length > 0) {
        // payload에 usrRoleId가 없을 수 있으므로 다시 설정
        const entitiesToSave = pgmGrps.map((p) => ({ ...p, usrRoleId }));
        await queryRunner.manager.save(TblUserRolePgmGrp, entitiesToSave);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error saving program groups for role:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async copyUserRole(originalRoleId: string): Promise<TblUserRole> {
    const queryRunner =
      this.userRoleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 원본 역할 정보 조회
      const originalRole = await queryRunner.manager.findOne(TblUserRole, {
        where: { usrRoleId: originalRoleId },
      });
      if (!originalRole) {
        throw new Error('복사할 원본 역할을 찾을 수 없습니다.');
      }

      // 2. 새로운 역할 ID 생성 (기존 패턴: A + YYMMDD + 3자리 순번)
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const timestamp = Date.now().toString().slice(-3);

      const newRoleId = `A${year}${month}${day}${timestamp}`;

      // 3. 역할 정보 복사 및 저장 (엔티티 인스턴스로 변환하여 @BeforeInsert 데코레이터가 동작하도록 함)
      const newRoleEntity = new TblUserRole();
      Object.assign(newRoleEntity, {
        ...originalRole,
        usrRoleId: newRoleId,
        usrRoleNm: `${originalRole.usrRoleNm}_복사본`,
        regDttm: undefined, // @BeforeInsert에서 자동 설정
        chngDttm: undefined, // @BeforeInsert에서 자동 설정
        chngrId: 'SYSTEM', // @BeforeInsert에서 자동 설정
      });

      const savedRole = await queryRunner.manager.save(
        TblUserRole,
        newRoleEntity,
      );

      // 4. 원본 역할의 프로그램 그룹 연결 정보 조회 및 복사
      const originalPgmGrps = await queryRunner.manager.find(
        TblUserRolePgmGrp,
        { where: { usrRoleId: originalRoleId } },
      );
      if (originalPgmGrps.length > 0) {
        const newPgmGrps = originalPgmGrps.map((p) => ({
          ...p,
          usrRoleId: newRoleId,
        }));
        await queryRunner.manager.save(TblUserRolePgmGrp, newPgmGrps);
      }

      await queryRunner.commitTransaction();
      return savedRole;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error copying user role:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
