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
  async businessSearch(
    @Body() body: {
      bsnNo: string;
      startYear: string;
      progressStateDiv: string;
      searchDiv: string;
      hqCd: string;
      deptCd: string;
      userNm: string;
      loginId: string;
    },
    @Req() req: RequestWithSession,
  ) {
    try {
      console.log('📥 사업번호 검색 요청 받음');
      console.log('📋 요청 본문:', body);

      // 세션에서 로그인 사용자 정보 가져오기
      const loginId = req.session.user?.userId || req.session.user?.empNo || '';

      const result = await this.comz040p00Service.searchBusiness({
        ...body,
        loginId,
      });

      return {
        success: true,
        data: result.data,
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.error('사업번호 검색 오류:', error);
      return {
        success: false,
        message: '사업번호 검색 중 오류가 발생했습니다.',
      };
    }
  }
} 