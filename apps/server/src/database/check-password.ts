import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkPassword() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');

    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');

    const userId = '10529';

    console.log(`\n🔍 사용자 ${userId} 정보 확인:`);

    // 사용자 정보 조회
    const userResult = await connection.execute(
      'SELECT USER_ID, USER_NM, USER_PWD FROM TBL_USER_INF WHERE USER_ID = :userId',
      [userId],
    );

    if (userResult.rows && userResult.rows.length > 0) {
      const userData = userResult.rows[0] as any[];
      console.log('┌─────────────┬─────────────────────────────────────┐');
      console.log('│ 항목         │ 값                                 │');
      console.log('├─────────────┼─────────────────────────────────────┤');
      console.log(`│ 사번         │ ${userData[0]}                    │`);
      console.log(`│ 이름         │ ${userData[1] || 'N/A'}           │`);
      console.log(`│ 비밀번호     │ ${userData[2] || 'N/A'}           │`);
      console.log('└─────────────┴─────────────────────────────────────┘');
    } else {
      console.log('❌ 사용자를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('❌ 확인 실패:', error);
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
  checkPassword()
    .then(() => {
      console.log('\n✅ 비밀번호 확인 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { checkPassword };
