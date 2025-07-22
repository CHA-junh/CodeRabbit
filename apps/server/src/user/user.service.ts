import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 12; // bcrypt 솔트 라운드

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 입력값 검증
   */
  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string') {
      throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
    }

    // 사용자 ID 형식 검증 (숫자만 허용)
    if (!/^\d+$/.test(userId)) {
      throw new BadRequestException('사용자 ID는 숫자만 입력 가능합니다.');
    }

    // 길이 제한
    if (userId.length > 20) {
      throw new BadRequestException('사용자 ID가 너무 깁니다.');
    }
  }

  /**
   * SHA512 해시 생성
   */
  private generateSHA512Hash(input: string): string {
    return crypto
      .createHash('sha512')
      .update(input)
      .digest('hex')
      .toLowerCase();
  }

  /**
   * 사번으로 사용자 정보 조회 (부서명/직급명 포함) - SQL Injection 방지
   */
  async findUserWithDept(userId: string): Promise<UserInfoDto | null> {
    try {
      // 입력값 검증
      this.validateUserId(userId);

      // TypeORM QueryBuilder를 사용한 안전한 쿼리
      const result = await this.dataSource
        .createQueryBuilder()
        .select([
          'A.USER_ID as "userId"',
          'A.USER_NM as "userName"',
          'A.DEPT_CD as "deptCd"',
          'V.DEPT_NM as "deptNm"',
          'A.DUTY_CD as "dutyCd"',
          '(SELECT SML_CSF_NM FROM TBL_SML_CSF_CD WHERE LRG_CSF_CD = :lrgCsfCd AND SML_CSF_CD = A.DUTY_CD AND ROWNUM = 1) AS "dutyNm"',
          'A.DUTY_DIV_CD as "dutyDivCd"',
          'A.AUTH_CD as "authCd"',
          'A.EMAIL_ADDR as "emailAddr"',
          'A.USR_ROLE_ID as "usrRoleId"',
          'V.DEPT_DIV_CD as "deptDivCd"',
          'V.HQ_DIV_CD as "hqDivCd"',
          'V.HQ_DIV_NM as "hqDivNm"',
          'V.DEPT_FULL_NM as "deptFullNm"',
          'V.DEPT_TP as "deptTp"',
        ])
        .from('TBL_USER_INF', 'A')
        .innerJoin(
          'V_DEPT_SUB',
          'V',
          'V.DEPT_CD = A.DEPT_CD AND V.USE_YN = :useYn',
        )
        .where('A.USER_ID = :userId', {
          userId,
          lrgCsfCd: '116',
          useYn: 'Y',
        })
        .getRawOne();

      return result || null;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('사용자 정보 조회 중 오류가 발생했습니다.');
    }
  }

  /**
   * 사용자 비밀번호 검증 (하이브리드 방식: 평문 + SHA512 + bcrypt)
   */
  async validateUserPassword(
    userId: string,
    password: string,
  ): Promise<boolean> {
    try {
      // 입력값 검증
      this.validateUserId(userId);

      if (!password || typeof password !== 'string') {
        console.log(
          `❌ 비밀번호 검증 실패 (${userId}): 비밀번호가 유효하지 않음`,
        );
        return false;
      }

      const user = await this.userRepository.findOne({ where: { userId } });
      if (!user || !user.userPwd) {
        console.log(
          `❌ 비밀번호 검증 실패 (${userId}): 사용자 또는 비밀번호가 없음`,
        );
        return false;
      }

      console.log(`🔍 비밀번호 검증 시작 (${userId}):`);
      console.log(`   - 입력 비밀번호 길이: ${password.length}`);
      console.log(`   - DB 비밀번호 길이: ${user.userPwd.length}`);
      console.log(`   - DB 비밀번호 형식: ${user.userPwd.substring(0, 10)}...`);

      // 1. SHA512 해시 검증 (기존 방식, 128자 16진수)
      const isSHA512Pattern =
        user.userPwd.length === 128 && /^[A-Fa-f0-9]{128}$/.test(user.userPwd);
      console.log(
        `   - SHA512 패턴 확인: ${isSHA512Pattern} (길이: ${user.userPwd.length}, 패턴: ${/^[A-Fa-f0-9]{128}$/.test(user.userPwd)})`,
      );

      if (isSHA512Pattern) {
        console.log(`   - SHA512 검증 시도`);
        const sha512Hash = this.generateSHA512Hash(password);
        console.log(`   - 생성된 SHA512: ${sha512Hash.substring(0, 10)}...`);
        console.log(`   - DB SHA512: ${user.userPwd.substring(0, 10)}...`);

        if (user.userPwd === sha512Hash) {
          console.log(`   - SHA512 검증 성공`);
          // 로그인 성공 시 자동으로 bcrypt로 마이그레이션
          this.migratePasswordToBcrypt(userId, password).catch((error) => {
            console.warn(
              `비밀번호 마이그레이션 실패 (${userId}):`,
              error.message,
            );
          });
          return true;
        }
        console.log(`   - SHA512 검증 실패`);
        return false;
      }

      // 2. bcrypt 해시 검증 (새로운 방식, 60자 이상이면서 $2b$ 또는 $2a$로 시작)
      if (
        user.userPwd.length >= 60 &&
        (user.userPwd.startsWith('$2b$') || user.userPwd.startsWith('$2a$'))
      ) {
        console.log(`   - bcrypt 검증 시도`);
        const bcryptResult = await bcrypt.compare(password, user.userPwd);
        console.log(`   - bcrypt 검증 결과: ${bcryptResult}`);
        return bcryptResult;
      }

      // 3. 평문 비밀번호 검증 (레거시 방식)
      console.log(`   - 평문 검증 시도`);
      if (user.userPwd === password) {
        console.log(`   - 평문 검증 성공`);
        // 로그인 성공 시 자동으로 bcrypt로 마이그레이션
        this.migratePasswordToBcrypt(userId, password).catch((error) => {
          console.warn(
            `비밀번호 마이그레이션 실패 (${userId}):`,
            error.message,
          );
        });
        return true;
      }
      console.log(`   - 평문 검증 실패`);

      console.log(`❌ 모든 검증 방식 실패 (${userId})`);
      return false;
    } catch (error) {
      console.error(`❌ 비밀번호 검증 오류 (${userId}):`, error);
      return false;
    }
  }

  /**
   * 평문 비밀번호를 bcrypt로 마이그레이션
   */
  private async migratePasswordToBcrypt(
    userId: string,
    plainPassword: string,
  ): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
      await this.userRepository.update(
        { userId },
        {
          userPwd: hashedPassword,
          pwdChngDttm: new Date().toISOString().slice(0, 14),
        },
      );
      console.log(`✅ 비밀번호 마이그레이션 완료: ${userId}`);
    } catch (error) {
      console.error(`❌ 비밀번호 마이그레이션 실패: ${userId}`, error);
      throw error;
    }
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      // 입력값 검증
      this.validateUserId(userId);

      const count = await this.userRepository.count({ where: { userId } });
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * 비밀번호 변경 (bcrypt 사용)
   */
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      // 입력값 검증
      this.validateUserId(userId);

      if (!newPassword || typeof newPassword !== 'string') {
        throw new BadRequestException('유효하지 않은 비밀번호입니다.');
      }

      // 비밀번호 복잡도 검증
      if (newPassword.length < 8) {
        throw new BadRequestException('비밀번호는 최소 8자 이상이어야 합니다.');
      }

      if (newPassword === userId) {
        throw new BadRequestException('비밀번호는 사번과 동일할 수 없습니다.');
      }

      // bcrypt를 사용한 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

      const result = await this.userRepository.update(
        { userId },
        {
          userPwd: hashedPassword,
          pwdChngDttm: new Date().toISOString().slice(0, 14),
        },
      );
      return (result.affected ?? 0) > 0;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('비밀번호 변경 중 오류가 발생했습니다.');
    }
  }
}
