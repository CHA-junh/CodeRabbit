import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_PGM_INF' })
export class ProgramEntity {
  @PrimaryColumn({ name: 'PGM_ID', type: 'varchar2', length: 20 })
  pgmId: string;

  @Column({ name: 'PGM_NM', type: 'varchar2', length: 100 })
  pgmNm: string;

  @Column({ name: 'LINK_PATH', type: 'varchar2', length: 200, nullable: true })
  linkPath: string;

  @Column({ name: 'PGM_DIV_CD', type: 'varchar2', length: 10, nullable: true })
  pgmDivCd: string;

  @Column({ name: 'BIZ_DIV_CD', type: 'varchar2', length: 10, nullable: true })
  bizDivCd: string;

  @Column({ name: 'PGM_HGHT', type: 'number', nullable: true })
  pgmHght: number;

  @Column({ name: 'PGM_WDTH', type: 'number', nullable: true })
  pgmWdth: number;

  @Column({ name: 'PGM_PSN_TOP', type: 'number', nullable: true })
  pgmPsnTop: number;

  @Column({ name: 'PGM_PSN_LFT', type: 'number', nullable: true })
  pgmPsnLft: number;

  @Column({
    name: 'TGT_MDI_DIV_CD',
    type: 'varchar2',
    length: 10,
    nullable: true,
  })
  tgtMdiDivCd: string;

  @Column({ name: 'SZ_UPD_USE_YN', type: 'char', length: 1, nullable: true })
  szUpdUseYn: string;

  @Column({ name: 'POPUP_SWT_USE_YN', type: 'char', length: 1, nullable: true })
  popupSwtUseYn: string;

  @Column({ name: 'USE_YN', type: 'char', length: 1 })
  useYn: string;
}
