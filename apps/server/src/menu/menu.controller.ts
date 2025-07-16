import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import session from 'express-session';
import * as oracledb from 'oracledb';

// express-session 타입 확장
interface RequestWithSession extends Request {
  session: session.Session & { user?: any };
}

@Controller('menu')
export class MenuController {
  // MenuService 관련 코드 제거

  @Get('tree')
  async getMenuTree(@Req() req: RequestWithSession, @Res() res: Response) {
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '세션이 유효하지 않습니다.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: '권한 정보가 없습니다.' });
    }
    // 동적 파라미터 추출
    const topMenu = req.query.TOP_MENU as string | undefined;
    const hgrkMenuSeq = req.query.HGRK_MENU_SEQ as string | undefined;
    let startWith = 'A.HGRK_MENU_SEQ = 0';
    let connectBy = 'PRIOR A.MENU_SEQ = A.HGRK_MENU_SEQ';
    if (hgrkMenuSeq && hgrkMenuSeq !== '') {
      startWith = `A.HGRK_MENU_SEQ = :hgrkMenuSeq`;
      connectBy = 'PRIOR A.MENU_SEQ = A.HGRK_MENU_SEQ';
    } else if (topMenu && topMenu !== '') {
      startWith = 'A.HGRK_MENU_SEQ = 0';
      connectBy = 'PRIOR A.MENU_SEQ = 0';
    }
    let connection: oracledb.Connection | null = null;
    try {
      connection = await oracledb.getConnection();
      const menuTreeQuery = `
        SELECT
          A.MENU_DSP_NM,
          A.PGM_ID,
          A.MENU_SHP_DVCD,
          A.HGRK_MENU_SEQ,
          A.MENU_SEQ,
          CONNECT_BY_ISLEAF AS FLAG,
          A.USE_YN AS MENU_USE_YN,
          LEVEL AS MENU_LVL,
          A.MENU_DSP_NM AS MAP_TITLE,
          SUBSTR(SYS_CONNECT_BY_PATH(A.MENU_DSP_NM, ' > '), 4) AS MENU_PATH
        FROM (
          SELECT
            A1.MENU_DSP_NM,
            NVL(A1.HGRK_MENU_SEQ,0)||'' AS HGRK_MENU_SEQ,
            A1.MENU_SEQ,
            A1.MENU_ID,
            A1.SORT_SEQ,
            A1.MENU_SHP_DVCD,
            A1.PGM_ID,
            A1.USE_YN
          FROM TBL_MENU_DTL A1
          INNER JOIN TBL_MENU_INF A2 ON A1.MENU_ID = A2.MENU_ID
          INNER JOIN TBL_USER_ROLE A3 ON A1.MENU_ID = A3.MENU_ID
          WHERE A3.USR_ROLE_ID = :usrRoleId
            AND (
              A1.MENU_SHP_DVCD = 'M'
              OR
              A1.PGM_ID IN (
                            SELECT GRP_DTL.PGM_ID
                              FROM TBL_USER_ROLE_PGM_GRP ROLE
                              INNER JOIN TBL_PGM_GRP_INF GRP ON ROLE.PGM_GRP_ID= GRP.PGM_GRP_ID AND GRP.USE_YN = 'Y'
                              INNER JOIN TBL_PGM_GRP_PGM GRP_DTL ON ROLE.PGM_GRP_ID = GRP_DTL.PGM_GRP_ID
                            WHERE ROLE.USR_ROLE_ID = :usrRoleId
                              AND ROLE.USE_YN = 'Y'
                            )
            )
            AND A1.USE_YN = 'Y'
        ) A
        START WITH ${startWith}
        CONNECT BY ${connectBy}
        ORDER SIBLINGS BY A.SORT_SEQ
      `;
      const binds: any = { usrRoleId };
      if (hgrkMenuSeq && hgrkMenuSeq !== '') {
        binds.hgrkMenuSeq = hgrkMenuSeq;
      }
      const menuResult = await connection.execute(menuTreeQuery, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });
      const menus = menuResult.rows || [];
      return res.json({ success: true, data: menus });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'DB 오류', error: err });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch {}
      }
    }
  }

  @Get('search')
  async searchMenu(@Req() req: RequestWithSession, @Res() res: Response) {
    const userInfo = req.session.user;
    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: '세션이 유효하지 않습니다.' });
    }
    const usrRoleId = userInfo.usrRoleId;
    if (!usrRoleId) {
      return res
        .status(403)
        .json({ success: false, message: '권한 정보가 없습니다.' });
    }
    const keyword = req.query.keyword as string;
    if (!keyword || keyword.length < 2) {
      return res.status(400).json({
        success: false,
        message: '검색어는 2글자 이상 입력해야 합니다.',
      });
    }
    // MenuService가 없으므로 실제 검색 로직 필요 (임시로 빈 배열 반환)
    return res.json({ success: true, data: [] });
  }
}
