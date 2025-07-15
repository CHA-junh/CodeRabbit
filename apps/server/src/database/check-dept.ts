import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkDept() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');

    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');

    // 부서 코드 BIS01202에 해당하는 부서 정보 조회
    const deptCode = 'BIS01202';

    console.log(`\n🏢 부서 정보 확인: ${deptCode}`);

    // 부서 정보 조회
    const deptResult = await connection.execute(
      'SELECT DEPT_CD, DEPT_NM FROM TBL_DEPT WHERE DEPT_CD = :deptCode',
      [deptCode],
    );

    if (deptResult.rows && deptResult.rows.length > 0) {
      const deptData = deptResult.rows[0] as any[];
      console.log('┌─────────────┬─────────────────────────────────────┐');
      console.log('│ 항목         │ 값                                 │');
      console.log('├─────────────┼─────────────────────────────────────┤');
      console.log(`│ 부서코드     │ ${deptData[0]}                    │`);
      console.log(`│ 부서명       │ ${deptData[1] || 'N/A'}           │`);
      console.log('└─────────────┴─────────────────────────────────────┘');
    } else {
      console.log('❌ 부서 정보를 찾을 수 없습니다.');
    }

    // 전체 부서 목록 조회 (상위 10개)
    console.log('\n📋 전체 부서 목록 (상위 10개):');
    const allDeptResult = await connection.execute(
      'SELECT DEPT_CD, DEPT_NM FROM TBL_DEPT WHERE ROWNUM <= 10',
    );

    if (allDeptResult.rows && allDeptResult.rows.length > 0) {
      console.log('┌─────────────┬─────────────────────────────────────┐');
      console.log('│ 부서코드     │ 부서명                               │');
      console.log('├─────────────┼─────────────────────────────────────┤');
      allDeptResult.rows.forEach((row: any[]) => {
        console.log(
          `│ ${row[0]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[1]?.padEnd(35) || 'N/A'.padEnd(35)} │`,
        );
      });
      console.log('└─────────────┴─────────────────────────────────────┘');
    } else {
      console.log('❌ 부서 데이터가 없습니다.');
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
  checkDept()
    .then(() => {
      console.log('\n✅ 부서 정보 확인 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { checkDept };
