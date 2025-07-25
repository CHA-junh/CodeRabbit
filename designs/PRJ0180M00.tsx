'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

export default function PRJ0180M00() {
  const columnDefs = useMemo(() => [
    { headerName: '구분', field: 'division', width: 100 },
    { headerName: '예산', field: 'budget', width: 100 },
    { headerName: '실적', field: 'actual', width: 100 },
    { headerName: '차액', field: 'difference', width: 100 },
    { headerName: '비고', field: 'note', width: 300 },
  ], []);

const rowData = [
  { division: '재료비 (B)' },
  { division: '내자' },
  { division: '외자' },
  { division: '계' },

  { division: '인건비 (C)' },
  { division: '직접부문 > 특급', budget: 'M/M', actual: 'M/M' },
  { division: '직접부문 > 고급', budget: 'M/M', actual: 'M/M' },
  { division: '직접부문 > 중급', budget: 'M/M', actual: 'M/M' },
  { division: '직접부문 > 초급', budget: 'M/M', actual: 'M/M' },
  { division: '간접부문' },
  { division: '계', budget: 'M/M', actual: 'M/M' },

  { division: '직접경비 (D)' },
  { division: '투입시수(M/M)', budget: 'M/M', actual: 'M/M', difference: 'M/M' },
  { division: '복리후생비', note: '※프로젝트 지급·법인카드 사용실적' },
  { division: '여비교통비' },
  { division: '소모품비' },
  { division: '도서인쇄비' },
  { division: '세금과공과' },
  { division: '보험료' },
  { division: '교육훈련비' },
  { division: '운반비' },
  { division: '접대비' },
  { division: '기술도입비' },
  { division: '지급임차료' },
  { division: 'A/S비' },
  { division: '기타비용' },
  { division: '계', budget: 'M/M', actual: 'M/M' },

  { division: '외주비 (E)', budget: 'M/M', actual: 'M/M', difference: 'M/M' },
  { division: '직접원가 (F=B+C+D+E)' },
  { division: '제경비 (G)' },
  { division: '총원가 (H=F+G)' },
  { division: '경상이익 (A-H)' },
  { division: '부가가치 (A-B-E)' },
];


  return (
    <div className="mdi h-full flex flex-col overflow-hidden">
      {/* 🔷 타이틀 */}
      <div className="tit_area flex items-center justify-between">
        <h3>계획 대비 실적 (원가) 조회 및 등록</h3>
        <div className="flex gap-2">
            <button className="btn-base btn-excel">엑셀</button>
            <button className="btn-base btn-etc">최종등록</button>
            <button className="btn-base btn-etc">재작성</button>
            <button className="btn-base btn-act">저장</button>
        </div>
      </div>

      {/* 🔍 조회영역 */}
      <div className="search-div">
        <table className="search-table w-full">
          <tbody>
            <tr>
              <th className="search-th w-[110px]">사업번호</th>
              <td className="search-td w-[20%]">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default w-full" />
                  <button className="icon_btn icon_search" />
                </div>
              </td>
              <th className="search-th w-[110px]">사업명</th>
              <td className="search-td w-[20%]">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default w-full" />
                  <button className="icon_btn icon_search" />
                </div>
              </td>
              <th className="search-th w-[110px]">사업기간</th>
              <td className="search-td w-[25%]">
                <div className="flex items-center gap-1">
                  <input type="date" className="input-base input-default w-full" />
                  <span>~</span>
                  <input type="date" className="input-base input-default w-full" />
                </div>
              </td>
            </tr>
            <tr>
              <th className="search-th">수주금액 (A)</th>
              <td className="search-td">
                <input type="text" className="input-base input-default !w-[90%]" /> 원
              </td>
              <th className="search-th">사업부서 / 영업대표</th>
              <td className="search-td">
                <input type="text" className="input-base input-default w-[90%]" />
              </td>
              <th className="search-th">실행부서 / PM</th>
              <td className="search-td">
                <input type="text" className="input-base input-default w-[90%]" />
              </td>
            <td className="search-td flex justify-end"> <button className="btn-base btn-search">조회</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📊 그리드 */}
      <div className="gridbox-div ag-theme-alpine flex-1 min-h-0 mt-4">
            <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            defaultColDef={{ resizable: true }}
            domLayout="autoHeight"
            suppressMovableColumns
            headerHeight={36}
            rowHeight={28}
            />
      </div>
    </div>
  );
}
