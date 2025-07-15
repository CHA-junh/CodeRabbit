import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkDeptNoStructure() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');

    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');

    // TB_DEPT_NO 테이블 구조 확인
    console.log('\n🏢 TB_DEPT_NO 테이블 구조 확인:');
    const structureResult = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE 
       FROM USER_TAB_COLUMNS 
       WHERE TABLE_NAME = 'TB_DEPT_NO' 
       ORDER BY COLUMN_ID`,
    );

    if (structureResult.rows && structureResult.rows.length > 0) {
      console.log('┌─────────────┬─────────────┬─────────────┬─────────────┐');
      console.log(
        '│ 컬럼명       │ 데이터타입   │ 길이        │ NULL 허용    │',
      );
      console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
      structureResult.rows.forEach((row: any[]) => {
        console.log(
          `│ ${row[0]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[1]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[2]?.toString().padEnd(11) || 'N/A'.padEnd(11)} │ ${row[3]?.padEnd(11) || 'N/A'.padEnd(11)} │`,
        );
      });
      console.log('└─────────────┴─────────────┴─────────────┴─────────────┘');
    }

    // TB_DEPT_NO 데이터 샘플 확인
    console.log('\n📋 TB_DEPT_NO 데이터 샘플 (상위 5개):');
    const sampleResult = await connection.execute(
      'SELECT * FROM TB_DEPT_NO WHERE ROWNUM <= 5',
    );

    if (sampleResult.rows && sampleResult.rows.length > 0) {
      console.log('샘플 데이터:');
      sampleResult.rows.forEach((row: any[]) => {
        console.log(row);
      });
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
  checkDeptNoStructure()
    .then(() => {
      console.log('\n✅ TB_DEPT_NO 구조 확인 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { checkDeptNoStructure };
