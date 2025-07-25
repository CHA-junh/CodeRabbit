'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

export default function BSN0080M00() {
  const columnDefs = useMemo(() => [
    { headerName: '역할', field: 'role', width: 80 },
    { headerName: '소속사', field: 'company', width: 120 },
    { headerName: '기술등급', field: 'techGrade', width: 100 },
    { headerName: '직급', field: 'position', width: 80 },
    { headerName: '성명', field: 'name', width: 100 },
    { headerName: '투입기간', field: 'period', width: 180 },
    {
      headerName: '투입공수(M/M)',
      children: [
        { headerName: '매출', field: 'workMonthSales', width: 80, cellClass: 'text-right' },
        { headerName: '비매출', field: 'workMonthNonSales', width: 80, cellClass: 'text-right' },
      ],
    },
    {
      headerName: '월투입공수(M/M)',
      children: [
        { headerName: '매출', field: 'monthlySales', width: 80, cellClass: 'text-right' },
        { headerName: '비매출', field: 'monthlyNonSales', width: 80, cellClass: 'text-right' },
      ],
    },
    { headerName: '비고', field: 'note', flex: 1 },
  ], []);

  const rowData = [
    {
      role: 'PM',
      company: '부툴정보시스템',
      techGrade: '특급',
      position: '부장',
      name: '최인호',
      period: '2025/01/01 ~ 2025/12/31',
      workMonthSales: 12,
      workMonthNonSales: 0,
      monthlySales: 1,
      monthlyNonSales: 0,
      note: '',
    },
    {
      role: 'DP',
      company: '부툴정보시스템',
      techGrade: '중급',
      position: '대리',
      name: '서연희',
      period: '2025/03/01 ~ 2025/12/31',
      workMonthSales: 10,
      workMonthNonSales: 0,
      monthlySales: 1,
      monthlyNonSales: 0,
      note: '',
    },
  ];

  return (
    <div className="mdi flex flex-col h-full overflow-hidden">
      {/* 🔍 조회 조건 영역 */}
      <div className="search-div mb-4">
        <table className="search-table">
          <tbody>
            <tr>
              <th className="search-th w-[100px]">조회년월</th>
              <td className="search-td w-[80px]">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="checkbox-base" />
                    전체
                  </label>
                </div>
              </td>
              <td className="search-td w-[150px]">
                <select className="input-base input-select w-[120px]">
                  <option>2025/07</option>
                </select>
              </td>
              <td className="search-td text-right" colSpan={2}>
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📌 타이틀 + 엑셀버튼 */}
      <div className="tit_area">
        <h3>
          인력 투입 내역 <span className="text-[13px] font-normal ml-1">(2025/07)</span>
        </h3>
        <div className="ml-auto">
          <button className="btn-base btn-excel">엑셀</button>
        </div>
      </div>

      {/* 📊 그리드 영역 */}
      <div className="gridbox-div mt-2 flex-1 min-h-0">
        <div className="ag-theme-alpine w-full h-full">
          <AgGridReact columnDefs={columnDefs} rowData={rowData} domLayout="autoHeight" />
        </div>
      </div>
    </div>
  );
}
