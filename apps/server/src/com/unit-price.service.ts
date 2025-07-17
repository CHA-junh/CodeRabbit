import { Injectable } from '@nestjs/common'
import { OracleService } from '../database/database.provider'
import * as oracledb from 'oracledb'
import { 
  UnitPrice, 
  UnitPriceSearchParams, 
  UnitPriceSaveParams, 
  UnitPriceDeleteParams,
  UnitPriceSearchResponseDto
} from './dto/unit-price.dto'
import { ProcedureDbParser } from '../utils/procedure-db-parser.util'

/**
 * 단가 관련 상수
 */
const UNIT_PRICE_CONSTANTS = {
  DEFAULT_OWN_OUTS_DIV: 'A',
  MAX_ROWS: 100,
  MAX_RETURN_SIZE: 1000
} as const

/**
 * 단가 관련 서비스
 * 단가 검색, 저장, 삭제 기능을 제공합니다.
 */
@Injectable()
export class UnitPriceService {
  constructor(
    private readonly oracle: OracleService,
    private readonly procedureDbParser: ProcedureDbParser
  ) {}

  /**
   * 단가 검색
   * @param ownOutsDiv - 내부/외부 구분
   * @param year - 년도
   * @param bsnNo - 사업번호 (선택)
   * @returns 검색된 단가 목록과 프로시저 정보
   */
  async searchUnitPrices(ownOutsDiv: string, year: string, bsnNo?: string): Promise<UnitPriceSearchResponseDto> {
    const conn = await this.oracle.getConnection()
    try {
      const result = await conn.execute(
        `
        BEGIN
          COM_01_0201_S(
            :cursor,
            :ownOutsDiv,
            :year,
            :bsnNo
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          ownOutsDiv: ownOutsDiv || UNIT_PRICE_CONSTANTS.DEFAULT_OWN_OUTS_DIV,
          year: year,
          bsnNo: bsnNo || null
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
        }
      ) as { outBinds: { cursor: oracledb.ResultSet<UnitPrice> } }
      
      const rs = result.outBinds.cursor
      const rows = await rs.getRows(UNIT_PRICE_CONSTANTS.MAX_ROWS)
      await rs.close()
      
      // DB에서 실시간으로 프로시저 정보 가져오기
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb('COM_01_0201_S')
      
      const response = new UnitPriceSearchResponseDto()
      response.data = rows
      response.procedureInfo = procedureInfo
      response.totalCount = rows.length
      
      return response
    } finally {
      await conn.close()
    }
  }

  /**
   * 단가 저장
   * @param params - 저장할 단가 정보
   * @returns 저장 결과
   */
  async saveUnitPrice(params: UnitPriceSaveParams): Promise<{ rtn: string }> {
    const conn = await this.oracle.getConnection()
    try {
      const result = await conn.execute(
        `
        BEGIN
          COM_01_0202_T(
            :rtn,
            :ownOutsDiv,
            :year,
            :tcnGrd,
            :dutyCd,
            :unitPrice
          );
        END;
        `,
        {
          rtn: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: UNIT_PRICE_CONSTANTS.MAX_RETURN_SIZE },
          ownOutsDiv: params.ownOutsDiv,
          year: params.year,
          tcnGrd: params.tcnGrd,
          dutyCd: params.dutyCd,
          unitPrice: params.unitPrice
        }
      ) as { outBinds: { rtn: string } }
      return { rtn: result.outBinds.rtn }
    } finally {
      await conn.close()
    }
  }

  /**
   * 단가 삭제
   * @param params - 삭제할 단가 정보
   * @returns 삭제 결과
   */
  async deleteUnitPrice(params: UnitPriceDeleteParams): Promise<{ rtn: string }> {
    const conn = await this.oracle.getConnection()
    try {
      const result = await conn.execute(
        `
        BEGIN
          COM_01_0203_D(
            :rtn,
            :ownOutsDiv,
            :year,
            :tcnGrd,
            :dutyCd
          );
        END;
        `,
        {
          rtn: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: UNIT_PRICE_CONSTANTS.MAX_RETURN_SIZE },
          ownOutsDiv: params.ownOutsDiv,
          year: params.year,
          tcnGrd: params.tcnGrd,
          dutyCd: params.dutyCd
        }
      ) as { outBinds: { rtn: string } }
      return { rtn: result.outBinds.rtn }
    } finally {
      await conn.close()
    }
  }
} 