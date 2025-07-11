import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user/user.service';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

// 세션 저장소 (실서비스는 Redis/DB로 대체)
interface SessionData {
  userId: string;
  userInfo: any;
  createdAt: number;
  lastAccess: number;
}

const sessionStore: Record<string, SessionData> = {};

// 서버 시작 시 세션 저장소 초기화
console.log('🚀 서버 시작 - 세션 저장소 초기화됨');

// 서버 시작 시 기존 세션 모두 삭제 (강제 초기화)
Object.keys(sessionStore).forEach((key) => {
  delete sessionStore[key];
});
console.log('🧹 기존 세션 모두 삭제됨');

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { empNo: string; password: string },
    @Res() res: Response,
  ) {
    try {
      // GW 인증
      const gwResult = await this.authService.login(body.empNo, body.password);

      if (!gwResult.success) {
        return res.json(gwResult);
      }

      // DB에서 사용자 정보 조회
      const userInfo = await this.userService.findUserWithDept(body.empNo);

      if (!userInfo) {
        return res.json({
          success: false,
          message: '사용자 정보를 찾을 수 없습니다.',
        });
      }

      // 세션 ID 생성
      const sessionId = randomUUID();
      const now = Date.now();

      // 세션 저장
      sessionStore[sessionId] = {
        userId: body.empNo,
        userInfo,
        createdAt: now,
        lastAccess: now,
      };

      console.log(
        '✅ 로그인 성공 - 세션 생성:',
        sessionId,
        '총 세션 수:',
        Object.keys(sessionStore).length,
      );

      // 세션 쿠키 설정
      res.cookie('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7일 (밀리초)
      });

      return res.json({
        success: true,
        message: '로그인 성공',
        user: userInfo,
      });
    } catch (error) {
      console.error('로그인 오류:', error);
      return res.json({
        success: false,
        message: '로그인 중 오류가 발생했습니다.',
      });
    }
  }

  @Get('session')
  async session(@Req() req: Request, @Res() res: Response) {
    try {
      const sessionId = req.cookies?.session;
      console.log('🔍 세션 확인 요청 - sessionId:', sessionId);
      console.log(
        '📊 현재 세션 저장소 상태 - 총 세션 수:',
        Object.keys(sessionStore).length,
      );
      console.log('📋 현재 세션 ID 목록:', Object.keys(sessionStore));

      // 세션 ID가 없거나 세션 저장소에 없는 경우
      if (!sessionId || !sessionStore[sessionId]) {
        console.log('❌ 세션 없음 - 쿠키 삭제');
        // 세션이 없으면 클라이언트 쿠키도 삭제
        res.clearCookie('session');
        return res.json({ success: false, user: null });
      }

      const session = sessionStore[sessionId];
      const now = Date.now();
      console.log(
        '✅ 세션 발견 - userId:',
        session.userId,
        '생성시간:',
        new Date(session.createdAt).toLocaleString(),
      );

      // 세션 만료 체크 (7일)
      if (now - session.createdAt > 7 * 24 * 60 * 60 * 1000) {
        console.log('⏰ 세션 만료 - 쿠키 삭제');
        delete sessionStore[sessionId];
        res.clearCookie('session');
        return res.json({ success: false, user: null });
      }

      // 마지막 접근 시간 업데이트
      session.lastAccess = now;
      console.log('✅ 세션 유효 - 사용자 정보 반환');

      return res.json({
        success: true,
        user: session.userInfo,
      });
    } catch (error) {
      console.error('❌ 세션 확인 오류:', error);
      // 오류 발생 시에도 쿠키 삭제
      res.clearCookie('session');
      return res.json({ success: false, user: null });
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const sessionId = req.cookies?.session;

      if (sessionId && sessionStore[sessionId]) {
        delete sessionStore[sessionId];
        console.log(
          '✅ 로그아웃 완료 - 세션 삭제:',
          sessionId,
          '남은 세션 수:',
          Object.keys(sessionStore).length,
        );
      }

      res.clearCookie('session');
      return res.json({ success: true });
    } catch (error) {
      console.error('로그아웃 오류:', error);
      return res.json({ success: false });
    }
  }
}
