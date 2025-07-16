import { Module } from '@nestjs/common';
import { OracleService } from './database.provider';

@Module({
  providers: [OracleService],
  exports: [OracleService],
})
export class DatabaseModule {}
