import { Controller, Post, Body } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { EmployeeService } from './employee.service'
import { EmployeeSearchParams, Employee, EmployeeSearchResponseDto } from './employee/dto/employee.dto'

/**
 * 직원 관련 API 컨트롤러
 * 직원 검색 기능을 제공합니다.
 */
@Controller('api/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * 직원 검색 API
   * @param body - 검색 조건
   * @param body.kb - 검색 키워드
   * @param body.empNo - 사원번호
   * @param body.empNm - 사원명
   * @param body.ownOutsDiv - 내부/외부 구분
   * @param body.retirYn - 퇴직 여부
   * @returns 검색된 직원 목록과 프로시저 정보
   */
  @Post('search')
  @ApiOperation({ 
    summary: '직원 검색',
    description: '사원(직원)을 검색하고 프로시저 정보를 포함하여 반환합니다.'
  })
  @ApiBody({ 
    type: EmployeeSearchParams,
    description: '직원 검색 조건'
  })
  @ApiResponse({ 
    status: 200, 
    description: '직원 검색 성공',
    type: EmployeeSearchResponseDto
  })
  async searchEmployees(@Body() body: EmployeeSearchParams): Promise<EmployeeSearchResponseDto> {
    return this.employeeService.searchEmployees(body)
  }
} 