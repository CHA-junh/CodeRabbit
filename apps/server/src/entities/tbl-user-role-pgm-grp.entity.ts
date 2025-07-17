import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('TBL_USER_ROLE_PGM_GRP')
export class TblUserRolePgmGrp {
  @PrimaryColumn({ name: 'USR_ROLE_ID', type: 'varchar2', length: 10 })
  usrRoleId: string;

  @PrimaryColumn({ name: 'PGM_GRP_ID', type: 'varchar2', length: 10 })
  pgmGrpId: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1, default: 'Y' })
  useYn: string;

  // TBL_PGM_GRP 테이블과 조인하기 위한 가상 컬럼 (DB에는 없음)
  @Column({ select: false, insert: false, update: false })
  pgmGrpNm?: string;
}
