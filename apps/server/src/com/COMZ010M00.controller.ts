import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { COMZ010M00Service } from './COMZ010M00.service';

@ApiTags('시스템코드관리')
@Controller('COMZ010M00')
export class COMZ010M00Controller {
  constructor(private readonly comz010m00Service: COMZ010M00Service) {}

  @Post()
  @ApiOperation({ summary: '시스템코드관리 통합 API', description: 'SP, PARAM 구조로 대/소분류 코드 조회/등록/수정/삭제' })
  async handleCodeMgmt(@Body() body: { SP: string; PARAM: string }) {
    return this.comz010m00Service.handleCodeMgmt(body);
  }
} 