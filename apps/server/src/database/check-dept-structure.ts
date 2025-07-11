import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkDeptStructure() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');

    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');

    // 부서 테이블 구조 확인
    console.log('\n🏢 TBL_DEPT 테이블 구조 확인:');
    const deptStructureResult = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE 
       FROM USER_TAB_COLUMNS 
       WHERE TABLE_NAME = 'TBL_DEPT' 
       ORDER BY COLUMN_ID`,
    );

    if (deptStructureResult.rows && deptStructureResult.rows.length > 0) {
      console.log('┌─────────────┬─────────────┬─────────────┬─────────────┐');
      console.log(
        '│ 컬럼명       │ 데이터타입   │ 길이        │ NULL 허용    │',
      );
      console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
      deptStructureResult.rows.forEach((row: any[]) => {
        console.log(
          `│ ${row[0]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[1]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[2]?.toString().padEnd(11) || 'N/A'.padEnd(11)} │ ${row[3]?.padEnd(11) || 'N/A'.padEnd(11)} │`,
        );
      });
      console.log('└─────────────┴─────────────┴─────────────┴─────────────┘');
    }

    // 부서 데이터 샘플 확인
    console.log('\n📋 TBL_DEPT 데이터 샘플 (상위 5개):');
    const deptSampleResult = await connection.execute(
      'SELECT * FROM TBL_DEPT WHERE ROWNUM <= 5',
    );

    if (deptSampleResult.rows && deptSampleResult.rows.length > 0) {
      console.log('┌─────────────┬─────────────┬─────────────┬─────────────┐');
      console.log(
        '│ DEPT_CD     │ DEPT_NM     │ 기타 컬럼들...              │',
      );
      console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
      deptSampleResult.rows.forEach((row: any[]) => {
        const deptCd = row[0] || 'N/A';
        const deptNm = row[1] || 'N/A';
        console.log(`│ ${deptCd.padEnd(11)} │ ${deptNm.padEnd(11)} │ ...`);
      });
      console.log('└─────────────┴─────────────┴─────────────┴─────────────┘');
    }

    // 직급 관련 테이블 확인
    console.log('\n👔 직급 관련 테이블 확인:');
    const dutyTablesResult = await connection.execute(
      `SELECT TABLE_NAME 
       FROM USER_TABLES 
       WHERE TABLE_NAME LIKE '%DUTY%' OR TABLE_NAME LIKE '%POSITION%' OR TABLE_NAME LIKE '%RANK%'`,
    );

    if (dutyTablesResult.rows && dutyTablesResult.rows.length > 0) {
      console.log('직급 관련 테이블들:');
      dutyTablesResult.rows.forEach((row: any[]) => {
        console.log(`- ${row[0]}`);
      });
    } else {
      console.log('직급 관련 테이블을 찾을 수 없습니다.');
    }

    // 사용자의 부서코드로 부서명 조회 테스트
    const userDeptCode = 'BIS01202';
    console.log(`\n🔍 사용자 부서코드 ${userDeptCode}로 부서명 조회:`);
    const userDeptResult = await connection.execute(
      'SELECT DEPT_CD, DEPT_NM FROM TBL_DEPT WHERE DEPT_CD = :deptCode',
      [userDeptCode],
    );

    if (userDeptResult.rows && userDeptResult.rows.length > 0) {
      const deptData = userDeptResult.rows[0] as any[];
      console.log(`✅ 부서코드: ${deptData[0]}, 부서명: ${deptData[1]}`);
    } else {
      console.log(
        `❌ 부서코드 ${userDeptCode}에 해당하는 부서를 찾을 수 없습니다.`,
      );
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
  checkDeptStructure()
    .then(() => {
      console.log('\n✅ 부서 구조 확인 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { checkDeptStructure };
