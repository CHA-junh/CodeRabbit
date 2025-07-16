import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { UserInfoDto } from './dto/user-info.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  /**
   * 사번으로 사용자 정보 조회 (부서명/직급명 포함)
   */
  async findUserWithDept(userId: string): Promise<UserInfoDto | null> {
    let connection: oracledb.Connection | null = null;
    try {
      console.log(`🔍 사용자 정보 조회 시작: ${userId}`);
      connection = await oracledb.getConnection();
      console.log('✅ DB 연결 성공');

      const result = await connection.execute(
        `SELECT 
            U.USER_ID,
            U.USER_NM,
            U.DEPT_CD,
            D.SML_CSF_NM AS DEPT_NM,
            U.DUTY_CD,
            P.SML_CSF_NM AS DUTY_NM,
            U.DUTY_DIV_CD,
            U.AUTH_CD,
            U.EMAIL_ADDR,
            U.USR_ROLE_ID
          FROM TBL_USER_INF U
          LEFT JOIN TBL_SML_CSF_CD D ON D.LRG_CSF_CD = '112' AND D.SML_CSF_CD = SUBSTR(U.DEPT_CD, -4)
          LEFT JOIN TBL_SML_CSF_CD P ON P.LRG_CSF_CD = '116' AND P.SML_CSF_CD = U.DUTY_CD
          WHERE U.USER_ID = :userId`,
        [userId],
      );

      console.log(`📊 조회 결과: ${result.rows?.length || 0}건`);

      if (result.rows && result.rows.length > 0) {
        const userData = result.rows[0] as any[];
        console.log('👤 사용자 데이터:', userData);
        // 컬럼 순서: [USER_ID, USER_NM, DEPT_CD, DEPT_NM, DUTY_CD, DUTY_NM, DUTY_DIV_CD, AUTH_CD, EMAIL_ADDR, USR_ROLE_ID]
        const dutyCd = userData[4]; // DUTY_CD (6, 직급코드)
        const dutyNmFromDb = userData[5]; // DUTY_NM (차장, 직급명) - DB에서 조회
        console.log('🟡 dutyCd:', dutyCd, 'dutyNmFromDb:', dutyNmFromDb);
        // DB에서 조회된 직급명 사용, 없으면 기본값
        const dutyNm = dutyNmFromDb || '직급명 없음';
        console.log('🟢 최종 dutyNm:', dutyNm);

        const userInfo = {
          userId: userData[0],
          name: userData[1],
          userName: userData[1],
          deptCd: userData[2],
          department: userData[3],
          deptNm: userData[3],
          dutyCd: dutyCd,
          position: dutyNm,
          dutyNm: dutyNm,
          email: userData[8],
          usrRoleId: userData[9], // 권한ID
        };
        console.log('✅ 반환할 사용자 정보:', userInfo);
        return userInfo;
      }
      console.log('❌ 사용자 정보가 없습니다');
      return null;
    } catch (error) {
      console.error('❌ 사용자 정보 조회 실패:', error);
      return null;
    } finally {
      if (connection) {
        try {
          await connection.close();
          console.log('🔌 DB 연결 종료');
        } catch (error) {
          console.error('❌ 연결 종료 실패:', error);
        }
      }
    }
  }

  /**
   * 사용자 비밀번호 검증 (SHA512 해시 사용)
   */
  async validateUserPassword(
    userId: string,
    password: string,
  ): Promise<boolean> {
    let connection: oracledb.Connection | null = null;
    try {
      console.log(`🔐 비밀번호 검증 시작 (해시): ${userId}`);
      connection = await oracledb.getConnection();

      // 1. DB에서 사용자 비밀번호 해시 조회
      const result = await connection.execute(
        `SELECT USER_PWD FROM TBL_USER_INF WHERE USER_ID = :userId`,
        [userId],
      );

      const rows = result.rows as any[][];
      if (!rows || rows.length === 0) {
        console.log(`❌ 비밀번호 검증: 사용자(${userId})를 찾을 수 없습니다.`);
        return false;
      }

      const storedPasswordHash = rows[0][0] as string;

      if (!storedPasswordHash) {
        console.log(
          `❌ 비밀번호 검증: 사용자(${userId})의 비밀번호가 없습니다.`,
        );
        return false;
      }

      // 2. 입력된 비밀번호를 SHA512로 해싱
      const inputPasswordHash = crypto
        .createHash('sha512')
        .update(password)
        .digest('hex');

      // 3. 해시 비교
      const isValid =
        storedPasswordHash.toLowerCase() === inputPasswordHash.toLowerCase();
      console.log(`🔐 비밀번호 검증 결과: ${isValid ? '성공' : '실패'}`);

      return isValid;
    } catch (error) {
      console.error('❌ 비밀번호 검증 실패:', error);
      return false;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('❌ 연결 종료 실패:', error);
        }
      }
    }
  }

  /**
   * 사용자 존재 여부 확인
   */
  async userExists(userId: string): Promise<boolean> {
    let connection: oracledb.Connection | null = null;
    try {
      console.log(`👤 사용자 존재 확인 시작: ${userId}`);
      connection = await oracledb.getConnection();

      const result = await connection.execute(
        'SELECT COUNT(*) as count FROM TBL_USER_INF WHERE USER_ID = :userId',
        [userId],
      );

      const count = result.rows?.[0]?.[0] as number;
      console.log(
        `👤 사용자 존재 확인 결과: ${count > 0 ? '존재' : '존재하지 않음'}`,
      );
      return count > 0;
    } catch (error) {
      console.error('❌ 사용자 존재 확인 실패:', error);
      return false;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('❌ 연결 종료 실패:', error);
        }
      }
    }
  }

  /**
   * 비밀번호 변경
   */
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    let connection: oracledb.Connection | null = null;
    try {
      console.log(`🔑 비밀번호 변경 시작: ${userId}`);
      connection = await oracledb.getConnection();

      // 새 비밀번호를 SHA512로 해싱
      const hashedPassword = crypto
        .createHash('sha512')
        .update(newPassword)
        .digest('hex');

      const result = await connection.execute(
        `UPDATE TBL_USER_INF SET USER_PWD = :password, PWD_CHNG_DTTM = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') WHERE USER_ID = :userId`,
        [hashedPassword, userId],
        { autoCommit: true },
      );

      const isSuccess = (result.rowsAffected ?? 0) > 0;
      console.log(`🔑 비밀번호 변경 결과: ${isSuccess ? '성공' : '실패'}`);
      return isSuccess;
    } catch (error) {
      console.error('❌ 비밀번호 변경 실패:', error);
      return false;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('❌ 연결 종료 실패:', error);
        }
      }
    }
  }
}
