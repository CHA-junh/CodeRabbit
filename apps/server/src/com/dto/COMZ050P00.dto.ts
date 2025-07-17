import { ApiProperty } from '@nestjs/swagger';

export class COMZ050P00RequestDto {
  @ApiProperty({ description: '사업명' })
  bsnNm: string;

  @ApiProperty({ description: '시작년도', required: false })
  strtYear?: string;

  @ApiProperty({ description: '진행상태구분', required: false })
  pgrsStDiv?: string;

  @ApiProperty({ description: '로그인ID', required: false })
  loginId?: string;
}

export class COMZ050P00ResultDto {
  @ApiProperty({ description: '사업번호' })
  BSN_NO: string;
  @ApiProperty({ description: '사업명' })
  BSN_NM: string;
}

export class COMZ050P00ResponseDto {
  @ApiProperty({ type: [COMZ050P00ResultDto], description: '사업명 검색 결과 리스트' })
  data: COMZ050P00ResultDto[];

  @ApiProperty({ description: '총 건수' })
  totalCount: number;
} 