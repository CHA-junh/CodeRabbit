import { Injectable } from '@nestjs/common'
import { OracleService } from './database/database.provider'
import * as oracledb from 'oracledb'
import { Employee, EmployeeSearchParams, EmployeeSearchResponseDto } from './employee/dto/employee.dto'
import { ProcedureDbParser } from './utils/procedure-db-parser.util'

/**
 * 직원 검색 관련 상수
 */
const EMPLOYEE_CONSTANTS = {
  DEFAULT_KB: '1',
  DEFAULT_RETIR_YN: 'Y',
  MAX_ROWS: 100
} as const

/**
 * 직원 관련 서비스
 * 직원 검색 기능을 제공합니다.
 */
@Injectable()
export class EmployeeService {
  constructor(
    private readonly oracle: OracleService,
    private readonly procedureDbParser: ProcedureDbParser
  ) {}

  /**
   * 직원 검색
   * @param params - 검색 조건
   * @returns 검색된 직원 목록과 프로시저 정보
   */
  async searchEmployees(params: EmployeeSearchParams): Promise<EmployeeSearchResponseDto> {
    const conn = await this.oracle.getConnection()
    try {
      const result = await conn.execute(
        `
        BEGIN
          COM_02_0411_S(
            :cursor,
            :kb,
            :empNo,
            :empNm,
            :ownOutsDiv,
            :retirYn
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          kb: params.kb || EMPLOYEE_CONSTANTS.DEFAULT_KB,
          empNo: params.empNo || null,
          empNm: params.empNm || null,
          ownOutsDiv: params.ownOutsDiv || null,
          retirYn: params.retirYn || EMPLOYEE_CONSTANTS.DEFAULT_RETIR_YN
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
        }
      ) as { outBinds: { cursor: oracledb.ResultSet<Employee> } }
      
      const rs = result.outBinds.cursor
      const rows = await rs.getRows(EMPLOYEE_CONSTANTS.MAX_ROWS)
      await rs.close()
      
      // DB에서 실시간으로 프로시저 정보 가져오기
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb('COM_02_0411_S')
      
      const response = new EmployeeSearchResponseDto()
      response.data = rows
      response.procedureInfo = procedureInfo
      response.totalCount = rows.length
      
      return response
    } finally {
      await conn.close()
    }
  }
} 