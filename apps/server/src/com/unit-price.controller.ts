import { Controller, Post, Body } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { UnitPriceService } from './unit-price.service'
import { 
  UnitPriceSearchParams, 
  UnitPriceSaveParams, 
  UnitPriceDeleteParams, 
  UnitPrice,
  UnitPriceSearchResponseDto
} from './dto/unit-price.dto'

/**
 * 단가 관련 API 컨트롤러
 * 단가 검색, 저장, 삭제 기능을 제공합니다.
 */
@Controller('unit-price')
export class UnitPriceController {
  constructor(private readonly unitPriceService: UnitPriceService) {}

  /**
   * 단가 검색 API
   * @param body - 검색 조건
   * @param body.ownOutsDiv - 내부/외부 구분
   * @param body.year - 년도
   * @param body.bsnNo - 사업번호 (선택)
   * @returns 검색된 단가 목록과 프로시저 정보
   */
  @Post('search')
  @ApiOperation({ 
    summary: '단가 검색',
    description: '등급별 단가를 검색하고 프로시저 정보를 포함하여 반환합니다.'
  })
  @ApiBody({ 
    type: UnitPriceSearchParams,
    description: '단가 검색 조건'
  })
  @ApiResponse({ 
    status: 200, 
    description: '단가 검색 성공',
    type: UnitPriceSearchResponseDto
  })
  async searchUnitPrices(@Body() body: UnitPriceSearchParams): Promise<UnitPriceSearchResponseDto> {
    return this.unitPriceService.searchUnitPrices(body.ownOutsDiv, body.year, body.bsnNo)
  }

  /**
   * 단가 저장 API
   * @param body - 저장할 단가 정보
   * @param body.ownOutsDiv - 내부/외부 구분
   * @param body.year - 년도
   * @param body.tcnGrd - 기술등급
   * @param body.dutyCd - 직무코드
   * @param body.unitPrice - 단가
   * @returns 저장 결과
   */
  @Post('save')
  @ApiOperation({ 
    summary: '단가 저장',
    description: '등급별 단가를 저장합니다. 기존 단가가 있으면 업데이트하고, 없으면 새로 생성합니다.'
  })
  @ApiBody({ 
    type: UnitPriceSaveParams,
    description: '단가 저장 정보'
  })
  @ApiResponse({ 
    status: 200, 
    description: '단가 저장 성공',
    schema: {
      type: 'object',
      properties: {
        rtn: {
          type: 'string',
          description: '저장 결과 메시지',
          example: 'SUCCESS'
        }
      }
    }
  })
  async saveUnitPrice(@Body() body: UnitPriceSaveParams): Promise<{ rtn: string }> {
    return this.unitPriceService.saveUnitPrice(body)
  }

  /**
   * 단가 삭제 API
   * @param body - 삭제할 단가 정보
   * @param body.ownOutsDiv - 내부/외부 구분
   * @param body.year - 년도
   * @param body.tcnGrd - 기술등급
   * @param body.dutyCd - 직무코드
   * @returns 삭제 결과
   */
  @Post('delete')
  @ApiOperation({ 
    summary: '단가 삭제',
    description: '등급별 단가를 삭제합니다. 지정된 조건의 단가가 존재하면 삭제합니다.'
  })
  @ApiBody({ 
    type: UnitPriceDeleteParams,
    description: '단가 삭제 정보'
  })
  @ApiResponse({ 
    status: 200, 
    description: '단가 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        rtn: {
          type: 'string',
          description: '삭제 결과 메시지',
          example: 'SUCCESS'
        }
      }
    }
  })
  async deleteUnitPrice(@Body() body: UnitPriceDeleteParams): Promise<{ rtn: string }> {
    return this.unitPriceService.deleteUnitPrice(body)
  }
} 