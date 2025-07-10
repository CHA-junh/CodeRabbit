import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

// 임시 세션 저장소 (실서비스는 Redis/DB/JWT 등으로 대체)
const sessionStore: Record<string, any> = {};

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { empNo: string; password: string },
    @Res() res: Response,
  ) {
    const result = await this.authService.login(body.empNo, body.password);
    if (result.success) {
      // 임시 세션: 사번을 키로 저장
      sessionStore[body.empNo] = result.user;
      // 쿠키에 사번 저장(실서비스는 JWT/세션ID 등)
      res.cookie('empNo', body.empNo, { httpOnly: true });
    }
    return res.json(result);
  }

  @Get('session')
  async session(@Req() req: Request, @Res() res: Response) {
    // 쿠키에서 사번 추출
    const empNo = req.cookies?.empNo;
    if (empNo && sessionStore[empNo]) {
      return res.json({ user: sessionStore[empNo] });
    }
    return res.json({ user: null });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const empNo = req.cookies?.empNo;
    if (empNo) {
      delete sessionStore[empNo];
      res.clearCookie('empNo');
    }
    return res.json({ success: true });
  }
}
