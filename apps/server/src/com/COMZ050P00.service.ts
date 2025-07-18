import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { COMZ050P00RequestDto, COMZ050P00ResponseDto, COMZ050P00ResultDto } from './dto/COMZ050P00.dto';
import { toCamelCase } from '../utils/toCamelCase';

@Injectable()
export class COMZ050P00Service {
  private readonly logger = new Logger(COMZ050P00Service.name);
  constructor(private readonly oracleService: OracleService) {}

  async searchBusinessNames(params: COMZ050P00RequestDto): Promise<COMZ050P00ResponseDto> {
    try {
      const { sp, bsnNm, strtYear, pgrsStDiv, loginId } = params ?? {};

      if (!sp) {
        this.logger.error('필수 파라미터(sp)가 누락되었습니다.');
        throw new InternalServerErrorException('필수 파라미터(sp)가 누락되었습니다.');
      }

      const spName = sp.replace(/\(.*\)/, '');
      
      // PROCNAME: 동적 프로시저명 (sp 파라미터에서 추출, 주로 COM_02_0201_S)
      // OracleService의 executeProcedure 메서드 사용
      const result = await this.oracleService.executeProcedure(spName, [
        bsnNm ?? '',
        strtYear ?? 'ALL',
        pgrsStDiv ?? 'ALL',
        loginId ?? null,
      ]);
      
      // 결과를 카멜케이스로 변환하여 반환
      return toCamelCase(result);
    } catch (error) {
      this.logger.error('사업명 검색 중 오류', error);
      throw new InternalServerErrorException('사업명 검색 중 오류가 발생했습니다.');
    }
  }
} 