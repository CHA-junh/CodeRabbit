import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommonService } from './common.service';
import { DeptDivCodeDto } from '../com/dto/common.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('dept-div-codes')
  @ApiOperation({ summary: '부서구분코드 목록', description: '부서구분코드(112) 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '부서구분코드 목록 조회 성공', type: [DeptDivCodeDto] })
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    return this.commonService.getDeptDivCodes();
  }
} 