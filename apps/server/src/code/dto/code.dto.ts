import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

/**
 * 코드 검색 파라미터 타입
 */
export class CodeSearchParams {
  @ApiProperty({ 
    required: true, 
    description: '대분류코드 (필수) - 조회할 코드의 대분류 코드를 입력하세요', 
    default: '',
    example: '100',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '대분류코드는 필수입니다.' })
  largeCategoryCode: string = ''
}

/**
 * 코드 정보 타입
 */
export interface Code {
  data: string
  label: string
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
 * 코드 검색 응답 DTO
 */
export class CodeSearchResponseDto {
  @ApiProperty({ description: '코드 목록', type: [Object] })
  data: Code[]

  @ApiProperty({ description: '프로시저 정보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto

  @ApiProperty({ description: '총 개수' })
  totalCount: number
} 