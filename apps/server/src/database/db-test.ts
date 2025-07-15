import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

interface TableInfo {
  tableName: string;
  columnName: string;
  dataType: string;
  dataLength: number;
  nullable: string;
  columnId: number;
}

interface TableStructure {
  tableName: string;
  columns: TableInfo[];
}

async function testDatabaseConnection() {
  let connection: oracledb.Connection | null = null;

  try {
    console.log('🔌 DB 연결 시도 중...');
    console.log('📍 연결 정보:', {
      host: process.env.DB_HOST || '172.20.30.169',
      port: process.env.DB_PORT || '1521',
      user: process.env.DB_USER || 'NOT_SET',
      service: process.env.DB_SERVICE || 'NOT_SET',
    });

    // DB 연결
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST || '172.20.30.169'}:${process.env.DB_PORT || '1521'}/${process.env.DB_SERVICE}`,
    });

    console.log('✅ DB 연결 성공!');
    console.log('📊 Oracle 버전:', connection.oracleServerVersionString);

    // 1. 전체 테이블 목록 조회
    console.log('\n📋 전체 테이블 목록 조회 중...');
    const tablesResult = await connection.execute(`
      SELECT TABLE_NAME, COMMENTS 
      FROM USER_TAB_COMMENTS 
      WHERE TABLE_TYPE = 'TABLE'
      ORDER BY TABLE_NAME
    `);

    console.log(`📊 총 ${tablesResult.rows?.length || 0}개의 테이블 발견:`);
    if (tablesResult.rows) {
      tablesResult.rows.forEach((row: any, index: number) => {
        console.log(`  ${index + 1}. ${row[0]} - ${row[1] || '설명 없음'}`);
      });
    }

    // 2. 사용자 관련 테이블 우선 조회 (EMP, USER 등)
    console.log('\n👥 사용자 관련 테이블 상세 구조:');
    const userTables = ['EMP', 'USER', 'EMPLOYEE', 'USERS', 'MEMBER', 'STAFF'];

    for (const tableName of userTables) {
      try {
        const columnsResult = await connection.execute(
          `
          SELECT 
            COLUMN_NAME,
            DATA_TYPE,
            DATA_LENGTH,
            NULLABLE,
            COLUMN_ID,
            COMMENTS
          FROM USER_COL_COMMENTS 
          WHERE TABLE_NAME = :tableName
          ORDER BY COLUMN_ID
        `,
          [tableName],
        );

        if (columnsResult.rows && columnsResult.rows.length > 0) {
          console.log(`\n📋 테이블: ${tableName}`);
          console.log(
            '┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐',
          );
          console.log(
            '│ 컬럼명      │ 데이터타입  │ 길이        │ NULL 허용   │ 설명        │',
          );
          console.log(
            '├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤',
          );

          columnsResult.rows.forEach((row: any) => {
            const [
              columnName,
              dataType,
              dataLength,
              nullable,
              columnId,
              comments,
            ] = row;
            console.log(
              `│ ${columnName?.padEnd(11)} │ ${dataType?.padEnd(11)} │ ${String(dataLength || '').padEnd(11)} │ ${nullable?.padEnd(11)} │ ${(comments || '').padEnd(11)} │`,
            );
          });
          console.log(
            '└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘',
          );
        }
      } catch (error) {
        // 테이블이 존재하지 않는 경우 무시
        console.log(`⚠️  테이블 ${tableName} 존재하지 않음`);
      }
    }

        // 3. 전체 테이블의 컬럼 정보 조회 (상위 10개 테이블만)
    console.log('\n📊 전체 테이블 구조 분석 (상위 10개):');
    if (tablesResult.rows && tablesResult.rows.length > 0) {
      const topTables = tablesResult.rows.slice(0, 10);
      
      for (const tableRow of topTables) {
        const tableName = (tableRow as any)[0];

        try {
          const columnsResult = await connection.execute(
            `
            SELECT 
              COLUMN_NAME,
              DATA_TYPE,
              DATA_LENGTH,
              NULLABLE,
              COLUMN_ID
            FROM USER_TAB_COLUMNS 
            WHERE TABLE_NAME = :tableName
            ORDER BY COLUMN_ID
          `,
            [tableName],
          );

          if (columnsResult.rows && columnsResult.rows.length > 0) {
            console.log(
              `\n📋 ${tableName} (${columnsResult.rows.length}개 컬럼):`,
            );
            columnsResult.rows.forEach((row: any) => {
              const [columnName, dataType, dataLength, nullable, columnId] =
                row;
              console.log(
                `  - ${columnName} (${dataType}${dataLength ? `(${dataLength})` : ''}) ${nullable === 'Y' ? 'NULL' : 'NOT NULL'}`,
              );
            });
          }
        } catch (error) {
          console.log(`❌ ${tableName} 테이블 조회 실패:`, error);
        }
      }
    }

    // 4. 샘플 데이터 조회 (EMP 테이블이 있다면)
    try {
      console.log('\n📊 EMP 테이블 샘플 데이터 (상위 5개):');
      const sampleResult = await connection.execute(`
        SELECT * FROM EMP WHERE ROWNUM <= 5
      `);

      if (sampleResult.rows && sampleResult.rows.length > 0) {
        console.log(
          '컬럼명:',
          sampleResult.metaData?.map((col) => col.name),
        );
        sampleResult.rows.forEach((row: any, index: number) => {
          console.log(`행 ${index + 1}:`, row);
        });
      }
    } catch (error) {
      console.log(
        '⚠️  EMP 테이블 샘플 데이터 조회 실패 (테이블이 없거나 권한 없음)',
      );
    }
  } catch (error) {
    console.error('❌ DB 연결 또는 조회 실패:', error);
    console.error('💡 확인사항:');
    console.error(
      '  1. DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_SERVICE 환경변수 설정',
    );
    console.error('  2. DB 서버 접근 가능 여부');
    console.error('  3. 사용자 권한');
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
  testDatabaseConnection()
    .then(() => {
      console.log('\n✅ DB 분석 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { testDatabaseConnection };
