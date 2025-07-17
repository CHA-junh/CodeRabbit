import { Injectable } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { DeptDivCodeDto } from '../com/dto/common.dto';

@Injectable()
export class CommonService {
  constructor(private readonly oracleService: OracleService) {}

  /**
   * 부서구분코드(112) 목록 조회 (공통)
   */
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracleService.getConnection();
    try {
      const result = await conn.execute(
        `SELECT SML_CSF_CD as code, SML_CSF_NM as name FROM TBL_SML_CSF_CD WHERE LRG_CSF_CD = '112' ORDER BY SML_CSF_CD`,
        [],
        { outFormat: (require('oracledb').OUT_FORMAT_OBJECT) }
      );
      return (result.rows as DeptDivCodeDto[]) ?? [];
    } finally {
      await conn.close();
    }
  }
} 