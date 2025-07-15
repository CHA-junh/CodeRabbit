import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from '../user/dto/user-info.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body() body: { empNo: string; password: string },
    @Res() res: Response,
  ) {
    try {
      console.log('📥 로그인 요청 받음');
      console.log('📋 요청 본문:', body);
      console.log('📋 요청 본문 타입:', typeof body);

      const { empNo, password } = body;

      // 입력 검증
      if (!empNo || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: '사원번호와 비밀번호를 입력해주세요.',
        });
      }

      // 1. 사용자 존재 여부 확인
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: '존재하지 않는 사용자입니다.',
        });
      }

      // 2. DB를 이용한 비밀번호 검증
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: '비밀번호가 일치하지 않습니다.',
        });
      }
      console.log(`🔐 DB 인증 성공: ${empNo}`);

      // 3. 사용자 정보 조회 (부서명 포함)
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '사용자 정보 조회에 실패했습니다.',
        });
      }

      // 비밀번호가 사번과 동일한지 확인
      const needsPasswordChange = password === empNo;

      if (needsPasswordChange) {
        // 세션/쿠키 발급 없이 비밀번호 변경 안내만 응답
        return res.status(HttpStatus.OK).json({
          success: false,
          needsPasswordChange: true,
          user: { needsPasswordChange: true },
          message:
            '초기 비밀번호입니다. 비밀번호를 변경해야 로그인할 수 있습니다.',
        });
      }

      // 4. 세션 쿠키 설정
      const token = `db-token-${Date.now()}`;

      const response: LoginResponseDto = {
        success: true,
        message: '로그인 성공',
        user: {
          ...userInfo,
          needsPasswordChange,
        },
        token,
      };

      console.log('📤 서버 응답 데이터:', response);
      console.log('📤 서버 응답 JSON:', JSON.stringify(response, null, 2));

      // 쿠키 설정
      res.cookie('session', `db-session-${empNo}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7일 (밀리초)
      });

      console.log('🍪 쿠키 설정 완료:', `db-session-${empNo}`);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error('로그인 API 오류:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
      });
    }
  }

  @Get('session')
  async checkSession(@Req() req: Request, @Res() res: Response) {
    try {
      const sessionCookie = req.cookies?.session;

      if (!sessionCookie) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: '세션이 없습니다.',
        });
      }

      // 세션 쿠키에서 사용자 ID 추출 (gw-session-{userId} 또는 db-session-{userId} 형식)
      let userId = sessionCookie.replace('gw-session-', '');
      if (userId === sessionCookie) {
        userId = sessionCookie.replace('db-session-', '');
      }

      console.log('🍪 원본 세션 쿠키:', sessionCookie);
      console.log('👤 추출된 사용자 ID:', userId);

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: '유효하지 않은 세션입니다.',
        });
      }

      // 사용자 정보 조회
      const userInfo = await this.userService.findUserWithDept(userId);
      console.log('🔍 세션 확인 - 조회된 사용자 정보:', userInfo);

      if (!userInfo) {
        console.log('❌ 세션 확인 - 사용자 정보 없음');
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: '사용자 정보를 찾을 수 없습니다.',
        });
      }

      console.log('✅ 세션 확인 - 사용자 정보 조회 성공');
      return res.status(HttpStatus.OK).json({
        success: true,
        user: userInfo,
      });
    } catch (error) {
      console.error('세션 확인 API 오류:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
      });
    }
  }

  @Post('change-password')
  async changePassword(
    @Body() body: { userId: string; newPassword: string },
    @Res() res: Response,
  ) {
    try {
      const { userId, newPassword } = body;
      if (!userId || !newPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: '사용자 ID와 새 비밀번호를 모두 입력해주세요.',
        });
      }

      const isSuccess = await this.userService.updatePassword(
        userId,
        newPassword,
      );

      if (isSuccess) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: '비밀번호가 성공적으로 변경되었습니다.',
        });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: '비밀번호 변경에 실패했습니다.' });
      }
    } catch (error) {
      console.error('비밀번호 변경 API 오류:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
      });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      // 세션 쿠키 삭제
      res.clearCookie('session');

      return res.status(HttpStatus.OK).json({
        success: true,
        message: '로그아웃 성공',
      });
    } catch (error) {
      console.error('로그아웃 API 오류:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
      });
    }
  }
}
