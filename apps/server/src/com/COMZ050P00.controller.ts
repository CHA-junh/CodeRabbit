import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { COMZ050P00Service } from './COMZ050P00.service';
import { COMZ050P00ResponseDto } from './dto/COMZ050P00.dto';

@ApiTags('사업명검색')
@Controller('business-name-search')
export class COMZ050P00Controller {
  constructor(private readonly businessNameSearchService: COMZ050P00Service) {}

  @Post()
  @ApiOperation({ summary: '사업명 검색', description: '사업명, 시작년도, 진행상태 등으로 사업 리스트를 조회합니다.' })
  async searchBusinessNames(
    @Body() params: any,
  ): Promise<COMZ050P00ResponseDto> {
    if (params.SP && params.PARAM) {
      const [bsnNm, strtYear, pgrsStDiv, , loginId] = params.PARAM.split('|');
      return this.businessNameSearchService.searchBusinessNames({
        bsnNm,
        strtYear,
        pgrsStDiv,
        loginId,
      });
    }
    return this.businessNameSearchService.searchBusinessNames(params);
  }
} 