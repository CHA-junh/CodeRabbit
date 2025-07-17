import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { COMZ060P00ResultDto, COMZ060P00ResponseDto } from './dto/COMZ060P00.dto';

const DEPT_NO_SEARCH_CONSTANTS = {
  MAX_ROWS: 100,
} as const;

@Injectable()
export class COMZ060P00Service {
  private readonly logger = new Logger(COMZ060P00Service.name);
  constructor(private readonly oracleService: OracleService) {}

  /**
   * 부서번호/년도/부서구분코드로 부서 리스트 조회
   */
  async searchDeptNo(
    deptNo: string,
    year: string,
    deptDivCd?: string,
  ): Promise<COMZ060P00ResponseDto> {
    this.logger.log(`searchDeptNo called: deptNo=${deptNo}, year=${year}, deptDivCd=${deptDivCd}`);
    const oracledb = require('oracledb');
    const conn = await this.oracleService.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN BISBM.COM_02_0301_S(:o_result, :i_dept_no, :i_year, :i_dept_div_cd); END;`,
        {
          o_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          i_dept_no: deptNo,
          i_year: year,
          i_dept_div_cd: deptDivCd ?? null,
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const cursor = (result as any).outBinds.o_result;
      const rows: COMZ060P00ResultDto[] = [];
      let row;
      let count = 0;
      while ((row = await cursor.getRow()) && count < DEPT_NO_SEARCH_CONSTANTS.MAX_ROWS) {
        rows.push(row);
        count++;
      }
      await cursor.close();
      const response = new COMZ060P00ResponseDto();
      response.data = rows;
      response.totalCount = rows.length;
      console.log('[DeptNoSearchService] 반환 response:', response);
      return response;
    } finally {
      await conn.close();
    }
  }

} 