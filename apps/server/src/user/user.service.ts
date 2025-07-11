import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { UserInfoDto } from './dto/user-info.dto';

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
          A.USER_ID,
          A.USER_NM,
          A.DEPT_CD,
          D.SML_CSF_NM AS DEPT_NM,
          A.DUTY_CD,
          P.SML_CSF_NM AS DUTY_NM,
          A.DUTY_DIV_CD,
          A.AUTH_CD,
          A.EMAIL_ADDR,
          A.USR_ROLE_ID
        FROM TBL_USER_INF A
        LEFT JOIN TBL_SML_CSF_CD D ON D.LRG_CSF_CD = '112' AND D.SML_CSF_CD = SUBSTR(A.DEPT_CD, -4)
        LEFT JOIN TBL_SML_CSF_CD P ON P.LRG_CSF_CD = '116' AND P.SML_CSF_CD = A.DUTY_CD
        WHERE A.USER_ID = :userId`,
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
          userId: userData[0], // USER_ID (10529, 사번)
          name: userData[1], // USER_NM (성지훈, 이름)
          userName: userData[1], // USER_NM (성지훈, 이름) - 클라이언트 호환용
          deptCd: userData[2], // DEPT_CD (BIS01202, 부서코드)
          department: userData[3], // DEPT_NM (SI 2팀(25), 부서명)
          deptNm: userData[3], // DEPT_NM (SI 2팀(25), 부서명) - 클라이언트 호환용
          dutyCd: dutyCd, // DUTY_CD (6, 직급코드)
          position: dutyNm, // DUTY_NM (차장, 직급명)
          dutyNm: dutyNm, // DUTY_NM (차장, 직급명) - 클라이언트 호환용
          email: userData[8], // EMAIL_ADDR (이메일)
          // 필요시 추가 필드
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
   * 사용자 비밀번호 검증
   */
  async validateUserPassword(
    userId: string,
    password: string,
  ): Promise<boolean> {
    let connection: oracledb.Connection | null = null;
    try {
      console.log(`🔐 비밀번호 검증 시작: ${userId}`);
      connection = await oracledb.getConnection();

      const result = await connection.execute(
        'SELECT COUNT(*) as count FROM TBL_USER_INF WHERE USER_ID = :userId AND USER_PWD = :password',
        [userId, password],
      );

      const count = result.rows?.[0]?.[0] as number;
      console.log(`🔐 비밀번호 검증 결과: ${count > 0 ? '성공' : '실패'}`);
      return count > 0;
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
}
