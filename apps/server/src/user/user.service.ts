import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 사번으로 사용자 정보 조회 (부서명/직급명 포함)
   */
  async findUserWithDept(userId: string): Promise<UserInfoDto | null> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) return null;

    // 부서명 조회 (TBL_SML_CSF_CD 테이블에서 조회 - LRG_CSF_CD='112')
    let deptNm = '';
    if (user.deptCd) {
      const deptResult = await this.dataSource.query(
        'SELECT SML_CSF_NM FROM TBL_SML_CSF_CD WHERE LRG_CSF_CD = :lrgCsfCd AND SML_CSF_CD = :smlCsfCd AND ROWNUM = 1',
        ['112', user.deptCd.substring(user.deptCd.length - 4)],
      );
      deptNm = deptResult[0]?.SML_CSF_NM || '';
    }

    // 직급명 조회 (TBL_SML_CSF_CD 테이블에서 조회 - LRG_CSF_CD='116')
    let dutyNm = '';
    if (user.dutyCd) {
      const dutyResult = await this.dataSource.query(
        'SELECT SML_CSF_NM FROM TBL_SML_CSF_CD WHERE LRG_CSF_CD = :lrgCsfCd AND SML_CSF_CD = :smlCsfCd AND ROWNUM = 1',
        ['116', user.dutyCd],
      );
      dutyNm = dutyResult[0]?.SML_CSF_NM || '';
    }

    // 필요한 필드만 반환
    return {
      userId: user.userId,
      userName: user.userName,
      deptCd: user.deptCd,
      deptNm: deptNm,
      dutyCd: user.dutyCd,
      dutyNm: dutyNm,
      dutyDivCd: user.dutyDivCd,
      authCd: user.authCd,
      emailAddr: user.emailAddr,
      usrRoleId: user.usrRoleId,
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
