import { Controller, Post, Body, Req } from '@nestjs/common';
import { COMZ040P00Service } from './COMZ040P00.service';
import { Request } from 'express';
import session from 'express-session';

interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Controller('COMZ040P00')
export class COMZ040P00Controller {
  constructor(private readonly comz040p00Service: COMZ040P00Service) {}

  @Post()
  async searchBusinessNo(@Body() body: any): Promise<any> {
    try {
      console.log('🔍 COMZ040P00 컨트롤러 - 검색 요청:', body);
      
      const result = await this.comz040p00Service.searchBusiness(body);
      
      console.log('✅ COMZ040P00 컨트롤러 - 검색 완료:', result);
      
      return result;
    } catch (error) {
      console.error('❌ COMZ040P00 컨트롤러 - 검색 오류:', error);
      
      return {
        success: false,
        data: [],
        totalCount: 0,
        message: '사업번호 검색 중 오류가 발생했습니다.'
      };
    }
  }
}
