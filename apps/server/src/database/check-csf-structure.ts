import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkCsfStructure() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');

    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');

    // TBL_LRG_CSF_CD 테이블 구조 확인
    console.log('\n🏢 TBL_LRG_CSF_CD 테이블 구조 확인:');
    const lrgStructureResult = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE 
       FROM USER_TAB_COLUMNS 
       WHERE TABLE_NAME = 'TBL_LRG_CSF_CD' 
       ORDER BY COLUMN_ID`,
    );

    if (lrgStructureResult.rows && lrgStructureResult.rows.length > 0) {
      console.log('┌─────────────┬─────────────┬─────────────┬─────────────┐');
      console.log(
        '│ 컬럼명       │ 데이터타입   │ 길이        │ NULL 허용    │',
      );
      console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
      lrgStructureResult.rows.forEach((row: any[]) => {
        console.log(
          `│ ${row[0]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[1]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[2]?.toString().padEnd(11) || 'N/A'.padEnd(11)} │ ${row[3]?.padEnd(11) || 'N/A'.padEnd(11)} │`,
        );
      });
      console.log('└─────────────┴─────────────┴─────────────┴─────────────┘');
    }

    // TBL_LRG_CSF_CD 데이터 샘플 확인
    console.log('\n📋 TBL_LRG_CSF_CD 데이터 샘플 (상위 10개):');
    const lrgSampleResult = await connection.execute(
      'SELECT * FROM TBL_LRG_CSF_CD WHERE ROWNUM <= 10',
    );

    if (lrgSampleResult.rows && lrgSampleResult.rows.length > 0) {
      console.log('샘플 데이터:');
      lrgSampleResult.rows.forEach((row: any[], index: number) => {
        console.log(`[${index + 1}]`, row);
      });
    }

    // TBL_SML_CSF_CD 테이블 구조 확인
    console.log('\n🏢 TBL_SML_CSF_CD 테이블 구조 확인:');
    const smlStructureResult = await connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE 
       FROM USER_TAB_COLUMNS 
       WHERE TABLE_NAME = 'TBL_SML_CSF_CD' 
       ORDER BY COLUMN_ID`,
    );

    if (smlStructureResult.rows && smlStructureResult.rows.length > 0) {
      console.log('┌─────────────┬─────────────┬─────────────┬─────────────┐');
      console.log(
        '│ 컬럼명       │ 데이터타입   │ 길이        │ NULL 허용    │',
      );
      console.log('├─────────────┼─────────────┼─────────────┼─────────────┤');
      smlStructureResult.rows.forEach((row: any[]) => {
        console.log(
          `│ ${row[0]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[1]?.padEnd(11) || 'N/A'.padEnd(11)} │ ${row[2]?.toString().padEnd(11) || 'N/A'.padEnd(11)} │ ${row[3]?.padEnd(11) || 'N/A'.padEnd(11)} │`,
        );
      });
      console.log('└─────────────┴─────────────┴─────────────┴─────────────┘');
    }

    // TBL_SML_CSF_CD 데이터 샘플 확인
    console.log('\n📋 TBL_SML_CSF_CD 데이터 샘플 (상위 10개):');
    const smlSampleResult = await connection.execute(
      'SELECT * FROM TBL_SML_CSF_CD WHERE ROWNUM <= 10',
    );

    if (smlSampleResult.rows && smlSampleResult.rows.length > 0) {
      console.log('샘플 데이터:');
      smlSampleResult.rows.forEach((row: any[], index: number) => {
        console.log(`[${index + 1}]`, row);
      });
    }

    // 사용자의 부서코드(BIS01202)와 직급코드(6)로 매핑 테스트
    console.log('\n🔍 사용자 정보 매핑 테스트:');
    console.log('부서코드: BIS01202, 직급코드: 6');

    // 부서명 조회 테스트
    console.log('\n🏢 부서명 조회 테스트:');
    const deptMappingResult = await connection.execute(
      'SELECT * FROM TBL_LRG_CSF_CD WHERE CSF_CD = :deptCode OR CSF_NM LIKE :deptCode',
      ['BIS01202', '%BIS01202%'],
    );

    if (deptMappingResult.rows && deptMappingResult.rows.length > 0) {
      console.log('부서 매핑 결과:');
      deptMappingResult.rows.forEach((row: any[], index: number) => {
        console.log(`[${index + 1}]`, row);
      });
    } else {
      console.log('부서 매핑 결과 없음');
    }

    // 직급명 조회 테스트
    console.log('\n👔 직급명 조회 테스트:');
    const dutyMappingResult = await connection.execute(
      'SELECT * FROM TBL_SML_CSF_CD WHERE CSF_CD = :dutyCode OR CSF_NM LIKE :dutyCode',
      ['6', '%6%'],
    );

    if (dutyMappingResult.rows && dutyMappingResult.rows.length > 0) {
      console.log('직급 매핑 결과:');
      dutyMappingResult.rows.forEach((row: any[], index: number) => {
        console.log(`[${index + 1}]`, row);
      });
    } else {
      console.log('직급 매핑 결과 없음');
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
  checkCsfStructure()
    .then(() => {
      console.log('\n✅ CSF 테이블 구조 확인 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { checkCsfStructure };
