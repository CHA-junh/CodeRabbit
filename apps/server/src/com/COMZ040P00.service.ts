import { Injectable } from '@nestjs/common';
import { OracleService } from '../database/database.provider';

interface BusinessSearchParams {
  bsnNo: string;
  startYear: string;
  progressStateDiv: string;
  searchDiv: string;
  hqCd: string;
  deptCd: string;
  userNm: string;
  loginId: string;
}

@Injectable()
export class COMZ040P00Service {
  constructor(private readonly oracleService: OracleService) {}

  async searchBusiness(params: BusinessSearchParams) {
    try {
      console.log('🔍 사업번호 검색 서비스 실행');
      console.log('📋 파라미터:', params);

      const {
        bsnNo,
        startYear,
        progressStateDiv,
        searchDiv,
        hqCd,
        deptCd,
        userNm,
        loginId,
      } = params;

      // PROCNAME: COM_02_0101_S (사업번호 검색)
      const result = await this.oracleService.executeProcedure('COM_02_0101_S', [
        bsnNo || null,
        startYear === 'ALL' ? null : startYear,
        progressStateDiv || null,
        searchDiv || null,
        hqCd === 'ALL' ? null : hqCd,
        deptCd === 'ALL' ? null : deptCd,
        userNm === 'ALL' ? null : userNm,
        loginId || null,
      ]);

      console.log('✅ 사업번호 검색 결과:', result);

      return result;
    } catch (error) {
      console.error('❌ 사업번호 검색 서비스 오류:', error);
      throw error;
    }
  }
} 