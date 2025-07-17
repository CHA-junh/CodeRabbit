import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { COMZ060P00Service } from './COMZ060P00.service';
import { COMZ060P00ResponseDto } from './dto/COMZ060P00.dto';

/**
 * 부서번호 검색 관련 API 컨트롤러
 * 부서번호/년도/부서구분코드로 부서 리스트 및 부서구분코드 목록을 제공합니다.
 */
@Controller('search-dept-no')
export class COMZ060P00Controller {
  constructor(private readonly deptNoSearchService: COMZ060P00Service) {}

  /**
   * 부서번호/년도/부서구분코드로 부서 리스트 조회
   * @param deptNo 부서번호
   * @param year 년도
   * @param deptDivCd 부서구분코드(선택)
   */
  @Get()
  @ApiOperation({ summary: '부서번호 검색', description: '부서번호/년도/부서구분코드로 부서 리스트를 조회합니다.' })
  @ApiQuery({ name: 'deptNo', required: true, description: '부서번호' })
  @ApiQuery({ name: 'year', required: true, description: '년도' })
  @ApiQuery({ name: 'deptDivCd', required: false, description: '부서구분코드' })
  @ApiResponse({ status: 200, description: '부서 리스트 조회 성공', type: COMZ060P00ResponseDto })
  async searchDeptNo(
    @Query('deptNo') deptNo: string,
    @Query('year') year: string,
    @Query('deptDivCd') deptDivCd?: string,
  ): Promise<COMZ060P00ResponseDto> {
    return this.deptNoSearchService.searchDeptNo(deptNo, year, deptDivCd);
  }

 
} 