import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 사번으로 사용자 정보 조회 (부서명/직급명 포함)
   */
  async findUserWithDept(userId: string): Promise<UserInfoDto | null> {
    // 부서/직급명은 별도 테이블 조인 필요, 여기서는 User 엔티티만 사용
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) return null;
    // 필요한 필드만 반환
    return {
      userId: user.userId,
      userName: user.userName,
      deptCd: user.deptCd,
      dutyCd: user.dutyCd,
      dutyDivCd: user.dutyDivCd,
      authCd: user.authCd,
      emailAddr: user.emailAddr,
      usrRoleId: user.usrRoleId,
      // deptNm, dutyNm 등은 별도 조인/조회 필요 (여기서는 생략)
    };
  }

  /**
   * 사용자 비밀번호 검증 (SHA512 해시 사용)
   */
  async validateUserPassword(
    userId: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user || !user.userPwd) return false;
    const inputPasswordHash = crypto
      .createHash('sha512')
      .update(password)
      .digest('hex');
    return user.userPwd.toLowerCase() === inputPasswordHash.toLowerCase();
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { userId } });
    return count > 0;
  }

  /**
   * 비밀번호 변경
   */
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    const hashedPassword = crypto
      .createHash('sha512')
      .update(newPassword)
      .digest('hex');
    const result = await this.userRepository.update(
      { userId },
      {
        userPwd: hashedPassword,
        pwdChngDttm: new Date().toISOString().slice(0, 14),
      },
    );
    return (result.affected ?? 0) > 0;
  }
}
