import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

/**
 * 단가 검색 파라미터 타입
 */
export class UnitPriceSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '내부/외부 구분 (필수) - 1: 자사, 2: 외주', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '내부/외부 구분은 필수입니다.' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '년도 (필수) - 검색할 년도를 입력하세요 (예: 2024)', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '년도는 필수입니다.' })
  year: string = ''

  @ApiProperty({ 
    required: false, 
    description: '사업자번호 (선택) - 특정 사업자의 단가만 검색할 때 사용', 
    default: '' 
  })
  @IsOptional()
  @IsString()
  bsnNo?: string = ''
}

/**
 * 단가 저장 파라미터 타입
 */
export class UnitPriceSaveParams {
  @ApiProperty({ 
    required: true, 
    description: '내부/외부 구분 (필수) - 1: 자사, 2: 외주', 
    default: '1' 
  })
  @IsString()
  @IsNotEmpty({ message: '내부/외부 구분은 필수입니다.' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '년도 (필수) - 단가를 적용할 년도 (예: 2024)', 
    default: '' 
  })
  @IsString()
  @IsNotEmpty({ message: '년도는 필수입니다.' })
  year: string = ''

  @ApiProperty({ 
    required: true, 
    description: '기술등급 (필수) - 기술자 등급 코드', 
    default: '',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '기술등급은 필수입니다.' })
  tcnGrd: string = ''

  @ApiProperty({ 
    required: true, 
    description: '직무코드 (필수) - 직무 분류 코드', 
    default: '',
    example: '9',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '직무코드는 필수입니다.' })
  dutyCd: string = ''

  @ApiProperty({ 
    required: true, 
    description: '단가 (필수) - 시간당 단가 금액', 
    default: '',
    example: '50000',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '단가는 필수입니다.' })
  unitPrice: string = ''
}

/**
 * 단가 삭제 파라미터 타입
 */
export class UnitPriceDeleteParams {
  @ApiProperty({ 
    required: true, 
    description: '내부/외부 구분 (필수) - 1: 자사, 2: 외주', 
    default: '1',
    example: '1',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '내부/외부 구분은 필수입니다.' })
  ownOutsDiv: string = '1'

  @ApiProperty({ 
    required: true, 
    description: '년도 (필수) - 삭제할 단가의 년도', 
    default: '',
    example: '2024',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '년도는 필수입니다.' })
  year: string = ''

  @ApiProperty({ 
    required: true, 
    description: '기술등급 (필수) - 삭제할 단가의 기술등급', 
    default: '',
    example: 'SENIOR',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '기술등급은 필수입니다.' })
  tcnGrd: string = ''

  @ApiProperty({ 
    required: true, 
    description: '직무코드 (필수) - 삭제할 단가의 직무코드', 
    default: '',
    example: 'DEV',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '직무코드는 필수입니다.' })
  dutyCd: string = ''
}

/**
 * 단가 정보 타입
 */
export interface UnitPrice {
  ownOutsDiv: string
  year: string
  tcnGrd: string
  dutyCd: string
  unitPrice: string
  [key: string]: any
}

/**
 * 프로시저 정보 DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '프로시저명' })
  name: string

  @ApiProperty({ description: '원본 주석 (줄별 배열)', type: [String] })
  originalCommentLines: string[]
}

/**
 * 단가 검색 응답 DTO
 */
export class UnitPriceSearchResponseDto {
  @ApiProperty({ description: '단가 목록', type: [Object] })
  data: UnitPrice[]

  @ApiProperty({ description: '프로시저 정보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: '총 개수' })
  totalCount: number
} 