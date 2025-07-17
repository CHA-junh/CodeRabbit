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
import session from 'express-session';
import { MenuService } from '../menu/menu.service';
import { ProgramService } from '../entities/program.service';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly menuService: MenuService,
    private readonly programService: ProgramService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { empNo: string; password: string },
    @Req() req: RequestWithSession,
  ): Promise<any> {
    try {
      console.log('📥 로그인 요청 받음');
      console.log('📋 요청 본문:', body);
      console.log('📋 요청 본문 타입:', typeof body);

      const { empNo, password } = body;

      // 입력 검증
      if (!empNo || !password) {
        return {
          success: false,
          message: '사원번호와 비밀번호를 입력해주세요.',
        };
      }

      // 1. 사용자 존재 여부 확인
      const userExists = await this.userService.userExists(empNo);
      if (!userExists) {
        return {
          success: false,
          message: '존재하지 않는 사용자입니다.',
        };
      }

      // 2. DB를 이용한 비밀번호 검증
      const isPasswordValid = await this.userService.validateUserPassword(
        empNo,
        password,
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: '비밀번호가 일치하지 않습니다.',
        };
      }
      console.log(`🔐 DB 인증 성공: ${empNo}`);

      // 3. 사용자 정보 조회 (부서명 포함)
      const userInfo = await this.userService.findUserWithDept(empNo);
      if (!userInfo) {
        return {
          success: false,
          message: '사용자 정보 조회에 실패했습니다.',
        };
      }

      if (!userInfo.usrRoleId) {
        return {
          success: false,
          message: '권한 정보가 없습니다. 관리자에게 문의하세요.',
        };
      }

      // 비밀번호가 사번과 동일한지 확인
      const needsPasswordChange = password === empNo;

      if (needsPasswordChange) {
        return {
          success: false,
          needsPasswordChange: true,
          user: { needsPasswordChange: true },
          message:
            '초기 비밀번호입니다. 비밀번호를 변경해야 로그인할 수 있습니다.',
        };
      }

      // menuList, programList 조회
      const menuList = await this.menuService.getMenuListByRole(
        userInfo.usrRoleId,
      );
      const programList = await this.programService.getProgramListByRole(
        userInfo.usrRoleId,
      );
      // express-session 기반 세션에 사용자 정보 + 메뉴/프로그램 저장
      req.session.user = {
        ...userInfo,
        needsPasswordChange,
        menuList,
        programList,
      };
      return {
        success: true,
        message: '로그인 성공',
        user: { ...userInfo, needsPasswordChange, menuList, programList },
      };
    } catch (error) {
      console.error('로그인 API 오류:', error);
      return {
        success: false,
        message: '서버 오류가 발생했습니다.',
      };
    }
  }

  @Get('session')
  async checkSession(@Req() req: RequestWithSession): Promise<any> {
    try {
      // express-session 기반 세션 확인
      if (!req.session.user) {
        return { success: false, user: null };
      }
      return {
        success: true,
        user: req.session.user,
      };
    } catch (error) {
      console.error('세션 확인 API 오류:', error);
      return { success: false, user: null };
    }
  }

  @Post('change-password')
  async changePassword(
    @Body() body: { userId: string; newPassword: string },
  ): Promise<any> {
    try {
      const { userId, newPassword } = body;
      if (!userId || !newPassword) {
        return {
          success: false,
          message: '사용자 ID와 새 비밀번호를 모두 입력해주세요.',
        };
      }

      const isSuccess = await this.userService.updatePassword(
        userId,
        newPassword,
      );

      if (isSuccess) {
        return {
          success: true,
          message: '비밀번호가 성공적으로 변경되었습니다.',
        };
      } else {
        return {
          success: false,
          message: '비밀번호 변경에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('비밀번호 변경 API 오류:', error);
      return {
        success: false,
        message: '서버 오류가 발생했습니다.',
      };
    }
  }

  @Post('logout')
  async logout(@Req() req: RequestWithSession): Promise<any> {
    try {
      return new Promise((resolve) => {
        req.session.destroy((err) => {
          if (err) {
            console.error('로그아웃 오류:', err);
            resolve({ success: false });
          } else {
            resolve({ success: true, message: '로그아웃 성공' });
          }
        });
      });
    } catch (error) {
      console.error('로그아웃 API 오류:', error);
      return { success: false, message: '서버 오류가 발생했습니다.' };
    }
  }
}
