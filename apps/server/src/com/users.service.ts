import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { UserEntity } from './entities/user.entity';
import { ProcedureDbParser } from '../utils/procedure-db-parser.util';
import { UserSearchParams, UserSearchResponseDto, ProcedureInfoDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly procedureDbParser: ProcedureDbParser
  ) {}

  async searchUsers(
    userNm: string, 
    hqDiv: string = 'ALL', 
    deptDiv: string = 'ALL'
  ): Promise<UserSearchResponseDto> {
    const connection = await (this.dataSource.driver as any).oracle.getConnection();
    
    try {
      const result = await connection.execute(
        `
        BEGIN
          USR_01_0201_S(
            :cursor,
            :hq,
            :dept,
            :name
          );
        END;
        `,
        {
          cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          hq: hqDiv,
          dept: deptDiv,
          name: userNm || null
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT
        }
      ) as { outBinds: { cursor: oracledb.ResultSet<any> } };
      
      const rs = result.outBinds.cursor;
      const rows = await rs.getRows(100);
      await rs.close();
      
      if (!rows || rows.length === 0) {
        const response = new UserSearchResponseDto();
        response.data = [];
        response.procedureInfo = await this.getProcedureInfo('USR_01_0201_S');
        response.totalCount = 0;
        return response;
      }
      
      // UserEntity 형태로 변환
      const users = rows.map((row: any) => ({
        USR_ID: row.USR_ID || row.usrId,
        USR_NM: row.USR_NM || row.usrNm,
        HQ_DIV: row.HQ_DIV || row.hqDiv,
        DEPT_DIV: row.DEPT_DIV || row.deptDiv,
        USE_YN: row.USE_YN || row.useYn || 'Y'
      }));
      
      // DB에서 실시간으로 프로시저 정보 가져오기
      const procedureInfo = await this.getProcedureInfo('USR_01_0201_S');
      
      const response = new UserSearchResponseDto();
      response.data = users;
      response.procedureInfo = procedureInfo;
      response.totalCount = users.length;
      
      return response;
    } catch (error: any) {
      console.error('사용자 조회 오류:', error);
      throw new Error(`사용자 조회 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      await connection.close();
    }
  }

  /**
   * DB에서 실시간으로 프로시저 정보 조회
   */
  private async getProcedureInfo(procedureName: string): Promise<ProcedureInfoDto> {
    try {
      const procedureInfo = await this.procedureDbParser.getProcedureInfoFromDb(procedureName);
      
      const dto = new ProcedureInfoDto();
      dto.name = procedureInfo.name;
      dto.originalCommentLines = procedureInfo.originalCommentLines;
      
      return dto;
    } catch (error) {
      console.error(`프로시저 정보 조회 오류 (${procedureName}):`, error);
      
      // 오류 발생 시 기본 정보 반환
      const dto = new ProcedureInfoDto();
      dto.name = procedureName;
      dto.originalCommentLines = ['프로시저 정보를 조회할 수 없습니다.'];
      
      return dto;
    }
  }
} 