import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { OracleService } from '../database/database.provider';

@Injectable()
export class COMZ010M00Service {
  private readonly logger = new Logger(COMZ010M00Service.name);
  constructor(private readonly oracleService: OracleService) {}

  async handleCodeMgmt(body: { SP: string; PARAM: string }) {
    const oracledb = require('oracledb');
    const conn = await this.oracleService.getConnection();
    try {
      const { SP, PARAM } = body;
      // SP에서 프로시저명만 추출 (괄호 전까지)
      const procName = SP.split('(')[0];
      // 파라미터 분리 (| 구분)
      const params = PARAM.split('|');
      // 프로시저 호출 (파라미터 개수에 따라 동적 바인딩)
      const bindParams: any = {};
      let idx = 0;
      // OUT 파라미터 타입 분기: 조회(_S)면 CURSOR, 아니면 STRING
      const isSelectProc = procName.endsWith('_S');
      if (isSelectProc) {
        bindParams.o_result = { dir: oracledb.BIND_OUT, type: oracledb.CURSOR };
      } else {
        bindParams.o_result = { dir: oracledb.BIND_OUT, type: oracledb.STRING };
      }
      // IN 파라미터 바인딩 (p1, p2, ...)
      for (let i = 0; i < params.length; i++) {
        bindParams[`p${i + 1}`] = params[i];
      }
      // 프로시저 호출 SQL 생성
      const inParams = Object.keys(bindParams).filter(k => k !== 'o_result').map(k => `:${k}`).join(', ');
      const sql = `BEGIN ${procName}(:o_result${inParams ? ', ' + inParams : ''}); END;`;
      let result: any;
      try {
        result = await conn.execute(sql, bindParams, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      } catch (dbErr) {
        throw dbErr;
      }
      const cursor = (result as any).outBinds.o_result;
      const rows: any[] = [];
      if (isSelectProc && cursor) {
        let row;
        while ((row = await cursor.getRow())) {
          rows.push(row);
        }
        await cursor.close();
        return { data: rows, totalCount: rows.length };
      } else {
        // 커서가 아니면(저장/수정/삭제) 문자열 반환
        return { result: cursor };
      }
    } catch (error) {
      throw new InternalServerErrorException('시스템코드관리 프로시저 호출 오류');
    } finally {
      await conn.close();
    }
  }
} 