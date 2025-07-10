import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool | null = null;

  // 🟡 환경변수 확인
  private checkEnvironmentVariables(): { valid: boolean; missing: string[] } {
    const requiredVars = [
      'DB_USER',
      'DB_PASSWORD',
      'DB_HOST',
      'DB_PORT',
      'DB_SERVICE',
    ];
    const missing: string[] = [];

    requiredVars.forEach((varName) => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  // ✅ NestJS가 시작될 때 자동으로 실행됨
  async onModuleInit() {
    try {
      const envCheck = this.checkEnvironmentVariables();
      if (!envCheck.valid) {
        throw new Error(
          `환경 변수가 누락되었습니다: ${envCheck.missing.join(', ')}`,
        );
      }

      this.pool = await oracledb.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 1,
      });

      console.log('✅ Oracle 커넥션 풀 생성 완료');
    } catch (error) {
      console.error('❌ 커넥션 풀 생성 실패:', error);
      throw error;
    }
  }

  // 🔄 커넥션 가져오기
  async getConnection(): Promise<oracledb.Connection> {
    if (!this.pool) {
      throw new Error('❗ 커넥션 풀이 아직 생성되지 않았습니다.');
    }

    return await this.pool.getConnection();
  }

  // 🔍 커넥션 풀 생성 여부 확인
  isConnected(): boolean {
    return this.pool !== null;
  }

  // 🔌 NestJS 종료 시 자동 호출
  async onModuleDestroy() {
    try {
      if (this.pool) {
        await this.pool.close(10); // 10초 안에 안전하게 종료
        console.log('🔌 Oracle 커넥션 풀 종료 완료');
      }
    } catch (error) {
      console.error('❌ 커넥션 풀 종료 실패:', error);
      throw error;
    }
  }
}

