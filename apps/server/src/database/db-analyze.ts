import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

async function analyzeUserTables() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');

    // DB 연결
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');

    // 1. TBL_USER_INF 테이블 구조 분석
    console.log('\n👤 TBL_USER_INF 테이블 구조 분석:');
    try {
      const userColumnsResult = await connection.execute(`
        SELECT 
          c.COLUMN_NAME,
          c.DATA_TYPE,
          c.DATA_LENGTH,
          c.NULLABLE,
          c.COLUMN_ID,
          com.COMMENTS
        FROM USER_TAB_COLUMNS c
        LEFT JOIN USER_COL_COMMENTS com
          ON c.TABLE_NAME = com.TABLE_NAME AND c.COLUMN_NAME = com.COLUMN_NAME
        WHERE c.TABLE_NAME = 'TBL_USER_INF'
        ORDER BY c.COLUMN_ID
      `);

      if (userColumnsResult.rows && userColumnsResult.rows.length > 0) {
        console.log(
          '┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐',
        );
        console.log(
          '│ 컬럼명      │ 데이터타입  │ 길이        │ NULL 허용   │ 설명        │',
        );
        console.log(
          '├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤',
        );

        userColumnsResult.rows.forEach((row: any) => {
          const [
            columnName,
            dataType,
            dataLength,
            nullable,
            columnId,
            comments,
          ] = row;
          console.log(
            `│ ${String(columnName).padEnd(11)} │ ${String(dataType).padEnd(11)} │ ${String(dataLength || '').padEnd(11)} │ ${String(nullable).padEnd(11)} │ ${(comments || '').padEnd(11)} │`,
          );
        });
        console.log(
          '└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘',
        );
      } else {
        console.log(
          '⚠️  TBL_USER_INF 테이블이 존재하지 않거나 컬럼 정보가 없습니다.',
        );
      }
    } catch (error) {
      console.log('❌ TBL_USER_INF 테이블 조회 실패:', error);
    }

    // 2. TBL_DEPT 테이블 구조 분석
    console.log('\n🏢 TBL_DEPT 테이블 구조 분석:');
    try {
      const deptColumnsResult = await connection.execute(`
        SELECT 
          c.COLUMN_NAME,
          c.DATA_TYPE,
          c.DATA_LENGTH,
          c.NULLABLE,
          c.COLUMN_ID,
          com.COMMENTS
        FROM USER_TAB_COLUMNS c
        LEFT JOIN USER_COL_COMMENTS com
          ON c.TABLE_NAME = com.TABLE_NAME AND c.COLUMN_NAME = com.COLUMN_NAME
        WHERE c.TABLE_NAME = 'TBL_DEPT'
        ORDER BY c.COLUMN_ID
      `);

      if (deptColumnsResult.rows && deptColumnsResult.rows.length > 0) {
        console.log(
          '┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐',
        );
        console.log(
          '│ 컬럼명      │ 데이터타입  │ 길이        │ NULL 허용   │ 설명        │',
        );
        console.log(
          '├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤',
        );

        deptColumnsResult.rows.forEach((row: any) => {
          const [
            columnName,
            dataType,
            dataLength,
            nullable,
            columnId,
            comments,
          ] = row;
          console.log(
            `│ ${String(columnName).padEnd(11)} │ ${String(dataType).padEnd(11)} │ ${String(dataLength || '').padEnd(11)} │ ${String(nullable).padEnd(11)} │ ${(comments || '').padEnd(11)} │`,
          );
        });
        console.log(
          '└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘',
        );
      } else {
        console.log(
          '⚠️  TBL_DEPT 테이블이 존재하지 않거나 컬럼 정보가 없습니다.',
        );
      }
    } catch (error) {
      console.log('❌ TBL_DEPT 테이블 조회 실패:', error);
    }

    // 3. TBL_USER_INF 샘플 데이터 조회
    console.log('\n📊 TBL_USER_INF 샘플 데이터 (상위 3개):');
    try {
      const userSampleResult = await connection.execute(`
        SELECT * FROM TBL_USER_INF WHERE ROWNUM <= 3
      `);

      if (userSampleResult.rows && userSampleResult.rows.length > 0) {
        console.log(
          '컬럼명:',
          userSampleResult.metaData?.map((col) => col.name),
        );
        userSampleResult.rows.forEach((row: any, index: number) => {
          console.log(`행 ${index + 1}:`, row);
        });
      } else {
        console.log('⚠️  TBL_USER_INF 테이블에 데이터가 없습니다.');
      }
    } catch (error) {
      console.log('❌ TBL_USER_INF 샘플 데이터 조회 실패:', error);
    }

    // 4. TBL_DEPT 샘플 데이터 조회
    console.log('\n📊 TBL_DEPT 샘플 데이터 (상위 3개):');
    try {
      const deptSampleResult = await connection.execute(`
        SELECT * FROM TBL_DEPT WHERE ROWNUM <= 3
      `);

      if (deptSampleResult.rows && deptSampleResult.rows.length > 0) {
        console.log(
          '컬럼명:',
          deptSampleResult.metaData?.map((col) => col.name),
        );
        deptSampleResult.rows.forEach((row: any, index: number) => {
          console.log(`행 ${index + 1}:`, row);
        });
      } else {
        console.log('⚠️  TBL_DEPT 테이블에 데이터가 없습니다.');
      }
    } catch (error) {
      console.log('❌ TBL_DEPT 샘플 데이터 조회 실패:', error);
    }

    // 5. 사용자와 부서 정보 조인 쿼리 예시
    console.log('\n🔗 사용자-부서 조인 쿼리 예시:');
    try {
      const joinResult = await connection.execute(`
        SELECT 
          A.*, 
          B.DEPT_NM 
        FROM TBL_USER_INF A 
        LEFT JOIN TBL_DEPT B ON A.DEPT_CD = B.DEPT_CD 
        WHERE ROWNUM <= 3
      `);

      if (joinResult.rows && joinResult.rows.length > 0) {
        console.log(
          '컬럼명:',
          joinResult.metaData?.map((col) => col.name),
        );
        joinResult.rows.forEach((row: any, index: number) => {
          console.log(`행 ${index + 1}:`, row);
        });
      } else {
        console.log('⚠️  조인 쿼리 결과가 없습니다.');
      }
    } catch (error) {
      console.log('❌ 조인 쿼리 실행 실패:', error);
    }
  } catch (error) {
    console.error('❌ DB 연결 또는 조회 실패:', error);
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
  analyzeUserTables()
    .then(() => {
      console.log('\n✅ 사용자 테이블 분석 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { analyzeUserTables };
