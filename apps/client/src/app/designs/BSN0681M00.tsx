'use client';

import React from 'react';
import './common.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const months = [
  '1월', '2월', '3월', '4월',
  '5월', '6월', '7월', '8월',
  '9월', '10월', '11월', '12월',
];

const columnDefs = [
  { headerName: '구분', field: 'type', width: 80 },
  { headerName: '성명', field: 'name', width: 100 },
  { headerName: '직책', field: 'position', width: 100 },
  { headerName: '등급', field: 'grade', width: 80 },
  { headerName: '일자', field: 'date', width: 120 },
];

const rowData: any[] = [];

export default function BSN0681M00() {
  return (
    <div className=" min-h-screen flex flex-col">
      {/* 🔷 타이틀 + 엑셀 버튼 */}
      <div className="tit_area flex justify-between items-center mb-3">
        <h3>월별 투입/철수 현황</h3>
        <button className="btn-base btn-excel">엑셀</button>
      </div>

      {/* 📊 12개월 그리드 (3열 × 4행) */}
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, index) => (
          <div key={index} className="w-full">
            {/* 월 타이틀 */}
            <div className="bg-[#f1f1f1] font-semibold text-[14px] text-center p-2 mb-2 rounded-md">
              20xx년 {month}
            </div>

            {/* ag-grid */}
            <div className="ag-theme-alpine w-full">
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                headerHeight={28}
                rowHeight={28}
                domLayout="autoHeight"
                suppressMovableColumns
                suppressColumnVirtualisation
              />
            </div>
          </div>
        ))}
      </div>

      {/* 📌 안내문 */}
      <div className="text-[12px] text-left text-blue-500 mt-6">
        <p>
          조회한 시점에서 투입 또는 철수 기간에 해당되는 월 인력현황을 조회하는 화면입니다. 
          해당 월의 리스트를 더블클릭하면 인원 투입 및 철수 리스트 화면으로 갑니다.
        </p>
        <p className="text-black mt-1">
          - 현재 휴직자이거나 퇴사자는 <span className="text-red-600">빨간색</span>으로 표시되고, 
          비매출 투입자는 <span className="text-blue-600">파란색</span>으로 표시됩니다.
        </p>
      </div>
    </div>
  );
}
