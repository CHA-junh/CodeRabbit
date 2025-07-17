import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('TBL_MENU_INF')
export class TblMenuInf {
  @PrimaryColumn('varchar2', { name: 'MENU_ID', length: 20 })
  menuId: string;

  @Column('varchar2', { name: 'MENU_NM', nullable: true, length: 100 })
  menuNm: string | null;

  @Column('char', { name: 'USE_YN', nullable: true, length: 1 })
  useYn: string | null;

  @Column('varchar2', { name: 'REG_DTTM', nullable: true, length: 14 })
  regDttm: string | null;

  @Column('varchar2', { name: 'CHNG_DTTM', nullable: true, length: 14 })
  chngDttm: string | null;

  @Column('varchar2', { name: 'CHBGR_ID', nullable: true, length: 10 })
  chngrId: string | null;
}
