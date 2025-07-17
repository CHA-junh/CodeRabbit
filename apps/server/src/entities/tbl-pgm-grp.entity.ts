import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('TBL_PGM_GRP')
export class TblPgmGrp {
  @PrimaryColumn({ name: 'PGM_GRP_ID', type: 'varchar2', length: 10 })
  pgmGrpId: string;

  @Column({ name: 'PGM_GRP_NM', type: 'varchar2', length: 100 })
  pgmGrpNm: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1, default: 'Y' })
  useYn: string;
}
