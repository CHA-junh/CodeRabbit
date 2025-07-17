import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { COMZ050P00RequestDto, COMZ050P00ResponseDto, COMZ050P00ResultDto } from './dto/COMZ050P00.dto';

@Injectable()
export class COMZ050P00Service {
  private readonly logger = new Logger(COMZ050P00Service.name);
  constructor(private readonly oracleService: OracleService) {}

  async searchBusinessNames(params: COMZ050P00RequestDto): Promise<COMZ050P00ResponseDto> {
    const oracledb = require('oracledb');
    const conn = await this.oracleService.getConnection();
    try {
      const { bsnNm, strtYear, pgrsStDiv, loginId } = params;
      const result = await conn.execute(
        `BEGIN BISBM.COM_02_0201_S(:o_result, :i_bsn_nm, :i_strt_year, :i_pgrs_st_div, :i_login_id); END;`,
        {
          o_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          i_bsn_nm: bsnNm ?? '',
          i_strt_year: strtYear ?? 'ALL',
          i_pgrs_st_div: pgrsStDiv ?? 'ALL',
          i_login_id: loginId ?? null,
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const cursor = (result as any).outBinds.o_result;
      const rows: COMZ050P00ResultDto[] = [];
      let row;
      while ((row = await cursor.getRow())) {
        rows.push(row);
      }
      await cursor.close();
      return {
        data: rows,
        totalCount: rows.length,
      };
    } catch (error) {
      this.logger.error('사업명 검색 중 오류', error);
      throw new InternalServerErrorException('사업명 검색 중 오류가 발생했습니다.');
    } finally {
      await conn.close();
    }
  }
} 