import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SysService } from './sys.service';
import { TblUserRole } from '../entities/tbl-user-role.entity';
import { TblUserRolePgmGrp } from '../entities/tbl-user-role-pgm-grp.entity';
import { Response } from 'express';

interface SaveUserRolesPayload {
  createdRows: TblUserRole[];
  updatedRows: TblUserRole[];
  deletedRows: TblUserRole[];
}

@Controller('sys')
export class SysController {
  constructor(private readonly sysService: SysService) {}

  @Get('menus')
  async findAllMenus() {
    return this.sysService.findAllMenus();
  }

  @Get('user-roles')
  async findAllUserRoles(
    @Query('usrRoleId') usrRoleId?: string,
    @Query('useYn') useYn?: string,
    @Req() request?: Request,
  ): Promise<TblUserRole[]> {
    console.log('=== 컨트롤러에서 받은 쿼리 파라미터 ===');
    console.log('usrRoleId:', usrRoleId, '타입:', typeof usrRoleId);
    console.log('useYn:', useYn, '타입:', typeof useYn);
    console.log('전체 쿼리 객체:', { usrRoleId, useYn });
    console.log('request.query:', request?.query);
    console.log('request.url:', request?.url);
    return this.sysService.findAllUserRoles(usrRoleId, useYn);
  }

  @Post('user-roles')
  async saveUserRoles(
    @Body() payload: SaveUserRolesPayload,
    @Res() res: Response,
  ) {
    try {
      const savedRoles = await this.sysService.saveUserRoles(payload);
      return res.status(HttpStatus.OK).json({
        message: '저장되었습니다.',
        savedRoles: savedRoles,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '저장에 실패했습니다.', error: error.message });
    }
  }

  @Get('user-roles/:usrRoleId/program-groups')
  async findProgramGroupsByRoleId(
    @Param('usrRoleId') usrRoleId: string,
  ): Promise<TblUserRolePgmGrp[]> {
    return this.sysService.findProgramGroupsByRoleId(usrRoleId);
  }

  @Get('program-groups')
  async findAllProgramGroups(): Promise<any[]> {
    return this.sysService.findAllProgramGroups();
  }

  @Post('user-roles/:usrRoleId/program-groups')
  async saveProgramGroupsForRole(
    @Param('usrRoleId') usrRoleId: string,
    @Body() pgmGrps: TblUserRolePgmGrp[],
    @Res() res: Response,
  ) {
    try {
      await this.sysService.saveProgramGroupsForRole(usrRoleId, pgmGrps);
      return res
        .status(HttpStatus.OK)
        .json({ message: '프로그램 그룹이 저장되었습니다.' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '저장에 실패했습니다.', error: error.message });
    }
  }

  @Post('user-roles/:usrRoleId/copy')
  async copyUserRole(
    @Param('usrRoleId') originalRoleId: string,
    @Res() res: Response,
  ) {
    try {
      const newRole = await this.sysService.copyUserRole(originalRoleId);
      return res.status(HttpStatus.CREATED).json(newRole);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: '역할 복사에 실패했습니다.', error: error.message });
    }
  }
}
