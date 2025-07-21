import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TBL_EMPLOYEE' })
export class EmployeeEntity {
  @PrimaryColumn({ name: 'EMP_NO', type: 'varchar2', length: 20 })
  empNo: string;

  @Column({ name: 'EMP_NM', type: 'varchar2', length: 100 })
  empNm: string;

  @Column({ name: 'OWN_OUTS_DIV', type: 'char', length: 1 })
  ownOutsDiv: string;

  @Column({ name: 'RETIR_YN', type: 'char', length: 1 })
  retirYn: string;

  @Column({ name: 'DEPT_CD', type: 'varchar2', length: 20, nullable: true })
  deptCd: string | null;
} 