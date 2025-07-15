import { Controller, Post, Body } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { CodeService } from './code.service'
import { CodeSearchParams, CodeSearchResponseDto } from './code/dto/code.dto'

/**
 * 코드 조회 컨트롤러
 * 
 * 기존 Flex/ActionScript의 COM_03_0100.mxml 컴포넌트와 동일한 기능
 * COM_03_0101_S 프로시저를 호출하여 대분류코드에 해당하는 소분류 코드들을 조회
 */
@Controller('api/code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  /**
   * 코드 조회 API
   * 
   * @param body - 요청 데이터 (param: 대분류코드)
   * @returns 코드 목록과 프로시저 정보
   */
  @Post('search')
  @ApiOperation({ 
    summary: '코드 조회',
    description: '대분류코드에 해당하는 소분류 코드들을 조회하고 프로시저 정보를 포함하여 반환합니다.'
  })
  @ApiBody({ 
    type: CodeSearchParams,
    description: '코드 검색 조건'
  })
  @ApiResponse({ 
    status: 200, 
    description: '코드 조회 성공',
    type: CodeSearchResponseDto
  })
  async searchCodes(@Body() body: CodeSearchParams): Promise<CodeSearchResponseDto> {
    return this.codeService.searchCodes(body.largeCategoryCode)
  }
} 