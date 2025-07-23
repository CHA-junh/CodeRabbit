'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

export default function BSN0730M00() {
  const columnDefs = useMemo(() => [
    { headerName: 'No', field: 'no', width: 60 },
    { headerName: '일자', field: 'date', width: 120 },
    { headerName: '구분', field: 'type', width: 100 },
    { headerName: '경과', field: 'result', width: 100 },
    { headerName: '등급', field: 'grade', width: 100 },
    { headerName: '단가', field: 'price', width: 100 },
    { headerName: '상세내용', field: 'detail', flex: 1 },
  ], []);

  const rowData = [
    { no: 1, date: '2025-07-01', type: '투입', result: '완료', grade: '초급', price: '3,000,000', detail: '초기 세팅 완료' },
    { no: 2, date: '2025-07-10', type: '변경', result: '진행', grade: '중급', price: '3,500,000', detail: '기술등급 상향 요청' },
    { no: 3, date: '2025-07-18', type: '철수', result: '완료', grade: '초급', price: '3,000,000', detail: '철수 보고 완료' },
  ];

  return (
    <div className="flex gap-4 h-full ">
      {/* 왼쪽 */}
      <div className="basis-1/2 flex flex-col min-h-0 min-w-[630px]">
        <div className="tit_area">
          <h3>외주지원정보</h3>
        </div>

            {/* 조건 테이블 */}
            <table className="form-table mb-4">
            <tbody>
                <tr className="form-tr">
                <th className="form-th w-[100px]">외주업체</th>
                <td className="form-td"><input type="text" className="input-base input-default" /></td>
                <th className="form-th">개발자명</th>
                <td className="form-td"><input type="text" className="input-base input-default" /></td>
                <th className="form-th">기술등급</th>
                <td className="form-td"><input type="text" className="input-base input-default" /></td>
                </tr>
                <tr className="form-tr">
                <th className="form-th">지원단가</th>
                <td className="form-td"><input type="text" className="input-base input-default" /></td>
                <th className="form-th">지원프로젝트</th>
                <td className="form-td" colSpan={3}><input type="text" className="input-base input-default w-full" /></td>
                </tr>
            </tbody>
            </table>

            {/* ag-Grid */}
            <div className="flex-1">
                <div className="gridbox-div ag-theme-alpine h-full min-h-[152px]">
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    headerHeight={36}
                    rowHeight={32}
                    domLayout="normal"         // ✅ autoHeight 제거!
                    suppressMovableColumns
                />
                </div>
            </div>
            {/* 버튼 */}
            <div className="flex justify-end gap-2 mt-2 h-[26px]">
            {/* <button className="btn-base btn-etc">신규</button>
            <button className="btn-base btn-act">저장</button>
            <button className="btn-base btn-delete">삭제</button> */}
            </div>
        </div>

      {/* 오른쪽 */}
      <div className="basis-1/2 flex flex-col min-h-0 min-w-[630px]">
        <div className="tit_area">
          <h3>외주소싱 진행등록</h3>
        </div>

        {/* 입력 테이블 */}
        <table className="form-table flex-grow mb-2">
          <tbody>
            <tr className="form-tr">
              <th className="form-th w-[80px]">구분</th>
              <td className="form-td w-[150px]">
                <select className="combo-base"><option>진행결과</option></select>
              </td>
              <th className="form-th">외주사번</th>
              <td className="form-td">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default flex-1 h-[26px]" />
                  <button className="icon_btn icon_search shrink-0" />
                </div>
              </td>
            </tr>

            <tr className="form-tr">
              <th className="form-th">진행일자</th>
              <td className="form-td"><input type="date" className="input-base input-calender" /></td>
              <th className="form-th">진행자</th>
              <td className="form-td">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default flex-1 h-[26px]" />
                  <button className="icon_btn icon_search shrink-0" />
                </div>
              </td>
            </tr>

            <tr className="form-tr">
              <th className="form-th">투입일자</th>
              <td className="form-td"><input type="date" className="input-base input-calender" /></td>
              <th className="form-th">투입등급</th>
              <td className="form-td"><input type="text" className="input-base input-default" /></td>
            </tr>

            <tr className="form-tr">
              <th className="form-th">프로젝트</th>
              <td className="form-td" colSpan={3}>
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default flex-1 h-[26px]" />
                  <button className="icon_btn icon_search shrink-0" />
                </div>
              </td>
            </tr>

            <tr className="form-tr">
              <th className="form-th">협의단가</th>
              <td className="form-td" colSpan={3}>
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default w-[100px]" />
                  <span className="m-1">원</span>
                </div>
              </td>
            </tr>

            {/* ✅ 상세내용 영역 확장 */}
            <tr className="form-tr h-full">
              <th className="form-th align-top pt-2">상세내용</th>
              <td className="form-td" colSpan={3}>
                <div className="flex flex-col flex-1 min-h-0 h-full">
                  <textarea className="textarea_def flex-1 w-full resize-none" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 버튼 */}
        <div className="flex justify-end gap-2">
          <button className="btn-base btn-etc">신규</button>
          <button className="btn-base btn-act">저장</button>
          <button className="btn-base btn-delete">삭제</button>
        </div>
      </div>
    </div>
  );
}
