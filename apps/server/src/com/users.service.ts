import { Injectable } from '@nestjs/common'
import { OracleService } from '../database/database.provider'
import * as oracledb from 'oracledb'
import { User, UserSearchResponseDto } from './dto/users.dto'
import { ProcedureDbParser } from '../utils/procedure-db-parser.util'

/**
 * 사용자 검색 관련 상수
 */
const USER_CONSTANTS = {
  DEFAULT_HQ_DIV: 'ALL',
  DEFAULT_DEPT_DIV: 'ALL',
  MAX_ROWS: 100
} as const

/**
 * 사용자 관련 서비스
 * 사용자 검색 기능을 제공합니다.
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly oracle: OracleService,
    private readonly procedureDbParser: ProcedureDbParser
  ) {}

  /**
   * 사용자 검색
   * @param userNm - 사용자명
   * @param hqDiv - 본사 구분 (기본값: 'ALL')
   * @param deptDiv - 부서 구분 (기본값: 'ALL')
   * @returns 검색된 사용자 목록과 프로시저 정보
   */
  async searchUsers(
    userNm: string, 
    hqDiv: string = USER_CONSTANTS.DEFAULT_HQ_DIV, 
    deptDiv: string = USER_CONSTANTS.DEFAULT_DEPT_DIV
  ): Promise<UserSearchResponseDto> {
    const conn = await this.oracle.getConnection()
    try {
      const result = await conn.execute(
        `
        BEGIN
          USR_01_0201_S(
            :cursor,
            :hq,
            :dept,
            :name
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          hq: hqDiv,
          dept: deptDiv,
          name: userNm || null
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
        }
      ) as { outBinds: { cursor: oracledb.ResultSet<User> } }
      
      const rs = result.outBinds.cursor
      const rows = await rs.getRows(USER_CONSTANTS.MAX_ROWS)
      await rs.close()
      
      // DB에서 실시간으로 프로시저 정보 가져오기
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb('USR_01_0201_S')
      
      const response = new UserSearchResponseDto()
      response.data = rows
      response.procedureInfo = procedureInfo
      response.totalCount = rows.length
      
      return response
    } finally {
      await conn.close()
    }
  }
} 