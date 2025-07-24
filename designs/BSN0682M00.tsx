'use client';

import React from 'react';
import './common.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function BSN0682M00() {
  const columnDefs = [
    { headerName: 'No', field: 'no', width: 60 },
    { headerName: '사업본부', field: 'division' },
    { headerName: '직책', field: 'position' },
    { headerName: '성명', field: 'name' },
    { headerName: '근무상태', field: 'status' },
    {
      headerName: '투입 프로젝트 내역',
      children: [
        { headerName: '사업번호', field: 'projectNo' },
        { headerName: '프로젝트명', field: 'projectName' },
        { headerName: '등급', field: 'grade' },
        { headerName: '투입일자', field: 'startDate' },
        { headerName: '철수일자', field: 'endDate' },
        { headerName: '구분', field: 'type' },
        { headerName: '공수', field: 'days' },
        { headerName: '역할', field: 'role' },
        { headerName: '담당업무', field: 'task' },
      ],
    },
  ];

  const rowData = []; // 실제 데이터 바인딩

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 🔷 타이틀 + 엑셀 + 조회버튼 */}
      <div className="tit_area flex justify-between items-center mb-2">
        <h3>인원 리스트</h3>
        <div className="flex gap-2">
          <button className="btn-base btn-excel">엑셀</button>
          <button className="btn-base btn-search">조회</button>
        </div>
      </div>

      {/* 📊 ag-Grid (스크롤 가능한 그리드 영역) */}
      {/* 📊 ag-Grid (고정 높이 지정) */}
      <div className="flex-1 min-h-[400px] overflow-hidden">
        <div className="ag-theme-alpine w-full h-[400px]">
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            suppressMovableColumns
            headerHeight={28}
            rowHeight={28}
          />
        </div>
      </div>

      {/* 📌 안내문 */}
      <div className="text-[13px] text-left text-blue-500 mt-2">
        <p>※ 조회 현시점에서 투입 또는 철수 기간에 해당되는 인원 리스트를 조회하는 화면입니다. 리스트를 더블클릭하면 개인별 프로젝트 투입현황 화면이 팝업됩니다.</p>
        <p className="text-black mt-1">- 현재 휴직자이거나 퇴사자는 <span className="text-[13px] text-red-500">빨간색</span>으로 표시되고</p>
        <p className="text-black">비매출 투입자는 <span className="text-[13px] text-blue-500">파란색</span>으로 표시됩니다.</p>
      </div>
    </div>
  );
}
