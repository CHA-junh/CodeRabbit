'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

export default function BSN0100M00() {
  const columnDefs = useMemo(() => [
    { headerName: 'No', field: 'no', width: 60 },
    { headerName: '역할', field: 'role' },
    { headerName: '이름', field: 'name' },
    { headerName: '직책', field: 'position' },
    { headerName: '소속', field: 'department' },
    { headerName: '투입기간', field: 'period' },
  ], []);

  const rowData = [
    { no: 1, role: 'PM', name: '최인호', position: '부장', department: '자사', period: '2025/01/01~12/31' },
    { no: 2, role: 'DP', name: '서연희', position: '대리', department: '자사', period: '2025/03/01~12/31' },
  ];

  const bottomColumnDefs = useMemo(() => [
    { headerName: '기술등급', field: 'level' },
    { headerName: '01월', field: 'jan' },
    { headerName: '02월', field: 'feb' },
    { headerName: '03월', field: 'mar' },
    { headerName: '04월', field: 'apr' },
    { headerName: '05월', field: 'may' },
    { headerName: '06월', field: 'jun' },
    { headerName: '07월', field: 'jul' },
    { headerName: '08월', field: 'aug' },
    { headerName: '09월', field: 'sep' },
    { headerName: '10월', field: 'oct' },
    { headerName: '11월', field: 'nov' },
    { headerName: '12월', field: 'dec' },
  ], []);

  const bottomData = [
    { level: '특급', jan: 1.0, feb: 1.0, mar: 1.0, apr: 1.0, may: 1.0, jun: 1.0, jul: 1.0, aug: 1.0, sep: 1.0, oct: 1.0, nov: 1.0, dec: 1.0 },
    { level: '중급', jan: 0.0, feb: 0.0, mar: 1.0, apr: 1.0, may: 1.0, jun: 1.0, jul: 1.0, aug: 1.0, sep: 1.0, oct: 1.0, nov: 1.0, dec: 1.0 },
  ];

  return (
    <div className="mdi flex flex-col h-full overflow-hidden">
      {/* 🔍 조회 조건 */}
      <div className="search-div mb-4">
        <table className="search-table">
          <tbody>
            <tr>
              <th className="search-th w-[100px]">조회년월</th>
              <td className="search-td w-[150px]">
                <select className="input-base input-select w-full">
                  <option>2025/07</option>
                </select>
              </td>
              <td className="search-td text-right" colSpan={3}>
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

        <div className="tit_area flex items-center justify-between h-[37px]">
        {/* 왼쪽: 조회기준 라벨 + 콤보 */}
        <div className="flex items-center gap-2 whitespace-nowrap leading-none">
            <h3 className="mr-1">조회기준</h3>
            <select className="input-base input-select !w-[100px] h-[30px]">
            <option value="plan">계획</option>
            <option value="exec">실행</option>
            </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-base btn-excel">엑셀</button>
          <button className="btn-base btn-search">조회</button>
        </div>
      </div>

      {/* 📊 중간 그리드 */}
      <div className="gridbox-div flex-1 min-h-0 mb-4">
        <div className="ag-theme-alpine w-full h-full">
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            domLayout="autoHeight"
          />
        </div>
      </div>

      {/* 📊 하단 그리드 */}
      <div className="gridbox-div h-[240px]">
        <div className="ag-theme-alpine w-full h-full">
          <AgGridReact
            columnDefs={bottomColumnDefs}
            rowData={bottomData}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
}
