import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 직원 검색 요청 DTO
 */
export class EmployeeSearchRequestDto {
  @ApiProperty({ 
    required: false, 
    description: '검색 키워드 (선택) - 검색 방식 선택', 
    example: '2' 
  })
  @IsOptional()
  @IsString()
  kb?: string;

  @ApiProperty({ 
    required: false, 
    description: '사원번호 (선택) - 특정 사원번호로 검색할 때 사용', 
    example: '' 
  })
  @IsOptional()
  @IsString()
  empNo?: string;

  @ApiProperty({ 
    required: true, 
    description: '사원명 (필수) - 검색할 사원의 이름을 입력하세요', 
    example: '홍길동',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '사원명은 필수입니다.' })
  empNm: string;

  @ApiProperty({ 
    required: false, 
    description: '내부/외부 구분 (선택) - 1: 자사, 2: 외주, ALL: 전체', 
    example: 'ALL' 
  })
  @IsOptional()
  @IsString()
  ownOutsDiv?: string;

  @ApiProperty({ 
    required: false, 
    description: '퇴직 여부 (선택) - Y: 퇴직자 포함, N: 퇴직자 제외', 
    example: 'Y' 
  })
  @IsOptional()
  @IsString()
  retirYn?: string;
}

/**
 * 직원 정보 DTO (Entity와 매핑)
 */
export class EmployeeDto {
  @ApiProperty({ description: '사원번호' })
  EMP_NO: string;

  @ApiProperty({ description: '사원명' })
  EMP_NM: string;

  @ApiProperty({ description: '내부/외부 구분' })
  OWN_OUTS_DIV: string;

  @ApiProperty({ description: '퇴직 여부' })
  RETIR_YN: string;

  @ApiProperty({ description: '부서 코드' })
  DEPT_CD: string;
}

/**
 * 프로시저 정보 DTO
 */
export class ProcedureInfoDto {
  @ApiProperty({ description: '프로시저명' })
  name: string;

  @ApiProperty({ description: '원본 주석 (줄별 배열)', type: [String] })
  originalCommentLines: string[];
}

/**
 * 직원 검색 응답 DTO
 */
export class EmployeeSearchResponseDto {
  @ApiProperty({ description: '직원 목록', type: [EmployeeDto] })
  data: EmployeeDto[];

  @ApiProperty({ description: '프로시저 정보', type: ProcedureInfoDto })
  procedureInfo: ProcedureInfoDto;

  @ApiProperty({ description: '총 개수' })
  totalCount: number;
} 