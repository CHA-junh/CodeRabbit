import { Injectable } from '@nestjs/common'
import { OracleService } from './database/database.provider'
import * as oracledb from 'oracledb'
import { Code, CodeSearchResponseDto } from './code/dto/code.dto'
import { ProcedureDbParser } from './utils/procedure-db-parser.util'

/**
 * 코드 조회 서비스
 * 
 * 기존 Flex/ActionScript의 COM_03_0100.mxml 컴포넌트와 동일한 기능
 * COM_03_0101_S 프로시저를 호출하여 대분류코드에 해당하는 소분류 코드들을 조회
 */
@Injectable()
export class CodeService {
  constructor(
    private readonly oracle: OracleService,
    private readonly procedureDbParser: ProcedureDbParser
  ) {}

  /**
   * 코드 조회
   * 
   * @param param - 대분류코드
   * @returns 코드 목록과 프로시저 정보
   */
  async searchCodes(param: string): Promise<CodeSearchResponseDto> {
    // employee.service.ts와 동일하게 커넥션 관리
    const conn = await this.oracle.getConnection()

    try {
      // COM_03_0101_S 프로시저 호출
      const result = await conn.execute(
        `
        BEGIN
          COM_03_0101_S(
            :cursor,           -- OUT: 결과 커서
            :I_LRG_CSF_CD     -- IN: 대분류코드
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          I_LRG_CSF_CD: param
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
        }
      ) as { outBinds: { cursor: oracledb.ResultSet<any> } }

      // 결과 커서에서 데이터 추출
      const rs = result.outBinds.cursor
      const rows = await rs.getRows(100) // 최대 100개까지 조회
      await rs.close()

      if (!rows || rows.length === 0) {
        const response = new CodeSearchResponseDto()
        response.data = []
        response.procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0101_S')
        response.totalCount = 0
        return response
      }

      // 기존 Flex 코드와 동일한 응답 형식으로 변환
      // COM_03_0101_S 프로시저 결과: data(코드값), label(코드명)
      const codes = rows.map((code: any) => ({
        data: code.DATA || code.data,      // 소분류코드 (대문자 우선, 소문자 fallback)
        label: code.LABEL || code.label    // 소분류명 (대문자 우선, 소문자 fallback)
      }))

      // DB에서 실시간으로 프로시저 정보 가져오기
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb('COM_03_0101_S')
      
      const response = new CodeSearchResponseDto()
      response.data = codes
      response.procedureInfo = procedureInfo
      response.totalCount = codes.length
      
      return response
    } catch (error: any) {
      console.error('코드 조회 오류:', error)
      throw new Error(`코드 조회 중 오류가 발생했습니다: ${error.message}`)
    } finally {
      // 데이터베이스 연결 해제
      await conn.close()
    }
  }
} 