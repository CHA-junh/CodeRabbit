import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkDutyStructure() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');

    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');

    // 직급 관련 테이블 목록 조회
    const dutyTablesResult = await connection.execute(
      `SELECT TABLE_NAME 
       FROM USER_TABLES 
       WHERE TABLE_NAME LIKE '%DUTY%' OR TABLE_NAME LIKE '%POSITION%' OR TABLE_NAME LIKE '%RANK%'`,
    );

    if (dutyTablesResult.rows && dutyTablesResult.rows.length > 0) {
      for (const row of dutyTablesResult.rows) {
        const tableName = (row as any[])[0];
        console.log(`\n👔 테이블: ${tableName}`);
        // 테이블 구조
        const structureResult = await connection.execute(
          `SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE 
           FROM USER_TAB_COLUMNS 
           WHERE TABLE_NAME = :tableName 
           ORDER BY COLUMN_ID`,
          [tableName],
        );
        if (structureResult.rows && structureResult.rows.length > 0) {
          console.log(
            '┌─────────────┬─────────────┬─────────────┬─────────────┐',
          );
          console.log(
            '│ 컬럼명       │ 데이터타입   │ 길이        │ NULL 허용    │',
          );
          console.log(
            '├─────────────┼─────────────┼─────────────┼─────────────┤',
          );
          structureResult.rows.forEach((col: any[]) => {
            console.log(
              `│ ${col[0]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${col[1]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${col[2]?.toString().padEnd(11) || 'N/A'.padEnd(11)} │ ${col[3]?.padEnd(11) || 'N/A'.padEnd(11)} │`,
            );
          });
          console.log(
            '└─────────────┴─────────────┴─────────────┴─────────────┘',
          );
        }
        // 데이터 샘플
        const sampleResult = await connection.execute(
          `SELECT * FROM ${tableName} WHERE ROWNUM <= 3`,
        );
        if (sampleResult.rows && sampleResult.rows.length > 0) {
          console.log('샘플 데이터:');
          sampleResult.rows.forEach((row: any[]) => {
            console.log(row);
          });
        }
      }
    } else {
      console.log('직급 관련 테이블을 찾을 수 없습니다.');
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
  checkDutyStructure()
    .then(() => {
      console.log('\n✅ 직급 테이블 구조 확인 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { checkDutyStructure };
