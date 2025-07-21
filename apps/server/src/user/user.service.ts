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
    const result = await this.dataSource.query(
      `
      SELECT 
        A.USER_ID as "userId",
        A.USER_NM as "userName",
        A.DEPT_CD as "deptCd",
        V.DEPT_NM as "deptNm",
        A.DUTY_CD as "dutyCd",
        (SELECT SML_CSF_NM FROM TBL_SML_CSF_CD 
          WHERE LRG_CSF_CD = '116' 
          AND SML_CSF_CD = A.DUTY_CD 
          AND ROWNUM = 1) AS "dutyNm",
        A.DUTY_DIV_CD as "dutyDivCd",
        A.AUTH_CD as "authCd",
        A.EMAIL_ADDR as "emailAddr",
        A.USR_ROLE_ID as "usrRoleId",
        V.DEPT_DIV_CD as "deptDivCd",
        V.HQ_DIV_CD as "hqDivCd",
        V.HQ_DIV_NM as "hqDivNm",
        V.DEPT_FULL_NM as "deptFullNm",
        V.DEPT_TP as "deptTp"
      FROM TBL_USER_INF A
      INNER JOIN V_DEPT_SUB V
        ON V.DEPT_CD = A.DEPT_CD
       AND V.USE_YN = 'Y'
      WHERE A.USER_ID = :userId
      `,
      [userId],
    );
    if (!result || result.length === 0) return null;
    return result[0];
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
