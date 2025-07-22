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
      const result = await this.comz040p00Service.searchBusiness(body);
      return result;
    } catch (error) {
      throw new Error('사업번호 검색 중 오류가 발생했습니다.');
    }
  }
}
