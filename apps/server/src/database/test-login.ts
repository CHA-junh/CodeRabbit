import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');

    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');

    // 샘플 사용자로 로그인 테스트
    const testUserId = '10485'; // 샘플 데이터에서 확인된 사용자
    const testPassword = '10485'; // 샘플 데이터에서 확인된 비밀번호

    console.log(`\n🧪 로그인 테스트: ${testUserId}`);

    // 1. 사용자 존재 여부 확인
    const userExistsResult = await connection.execute(
      'SELECT COUNT(*) as count FROM TBL_USER_INF WHERE USER_ID = :userId',
      [testUserId],
    );

    const userExists = userExistsResult.rows?.[0]?.[0] > 0;
    console.log(
      `사용자 존재 여부: ${userExists ? '✅ 존재' : '❌ 존재하지 않음'}`,
    );

    if (!userExists) {
      console.log('❌ 테스트 사용자가 존재하지 않습니다.');
      return;
    }

    // 2. 비밀번호 검증
    const passwordResult = await connection.execute(
      'SELECT COUNT(*) as count FROM TBL_USER_INF WHERE USER_ID = :userId AND USER_PWD = :password',
      [testUserId, testPassword],
    );

    const isValidPassword = passwordResult.rows?.[0]?.[0] > 0;
    console.log(`비밀번호 검증: ${isValidPassword ? '✅ 성공' : '❌ 실패'}`);

    if (!isValidPassword) {
      console.log('❌ 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 3. 사용자 정보 조회 (부서명 포함)
    const userInfoResult = await connection.execute(
      `SELECT 
        A.USER_ID,
        A.USER_NM,
        A.DEPT_CD,
        A.DUTY_CD,
        A.DUTY_DIV_CD,
        A.AUTH_CD,
        A.EMAIL_ADDR,
        A.USR_ROLE_ID,
        B.DEPT_NM
      FROM TBL_USER_INF A
      LEFT JOIN TBL_DEPT B ON A.DEPT_CD = B.DEPT_CD
      WHERE A.USER_ID = :userId`,
      [testUserId],
    );

    if (userInfoResult.rows && userInfoResult.rows.length > 0) {
      const userData = userInfoResult.rows[0] as any[];
      console.log('\n👤 로그인 성공! 사용자 정보:');
      console.log('┌─────────────┬─────────────────────────────────────┐');
      console.log('│ 항목         │ 값                                 │');
      console.log('├─────────────┼─────────────────────────────────────┤');
      console.log(`│ 사번         │ ${userData[0]}                    │`);
      console.log(`│ 이름         │ ${userData[1] || 'N/A'}           │`);
      console.log(`│ 부서코드     │ ${userData[2] || 'N/A'}           │`);
      console.log(`│ 부서명       │ ${userData[8] || 'N/A'}           │`);
      console.log(`│ 직책코드     │ ${userData[3] || 'N/A'}           │`);
      console.log(`│ 직책구분코드 │ ${userData[4] || 'N/A'}           │`);
      console.log(`│ 권한코드     │ ${userData[5] || 'N/A'}           │`);
      console.log(`│ 이메일       │ ${userData[6] || 'N/A'}           │`);
      console.log(`│ 역할ID       │ ${userData[7] || 'N/A'}           │`);
      console.log('└─────────────┴─────────────────────────────────────┘');
    } else {
      console.log('❌ 사용자 정보 조회 실패');
    }
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('\n🔌 DB 연결 종료');
      } catch (error) {
        console.error('❌ 연결 종료 실패:', error);
      }
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  testLogin()
    .then(() => {
      console.log('\n✅ 로그인 테스트 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { testLogin };
