'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

export default function PRJ0050M00() {
  const rowData = [
    {
      type: '자사',
      item: '부탐정보시스템',
      level: '특급',
      position: '부장',
      name: '최인호',
      dept: '매출',
      role: 'PM',
      task: 'Amore Pacific CS 시스템',
      infra: 'N',
      from: '2025/01/01',
      to: '2025/12/31',
      effortSale: 12,
      effortNoSale: 0,
      comment: '',
    },
    {
      type: '자사',
      item: '부탐정보시스템',
      level: '중급',
      position: '대리',
      name: '서연희',
      dept: '매출',
      role: 'DP',
      task: 'Amore Pacific CS 시스템',
      infra: 'N',
      from: '2025/03/01',
      to: '2025/12/31',
      effortSale: 10,
      effortNoSale: 0,
      comment: '',
    },
    {
      type: '',
      item: '',
      level: '',
      position: '',
      name: '',
      dept: '',
      role: '',
      task: '',
      infra: '',
      from: '',
      to: '',
      effortSale: '22.00',
      effortNoSale: '0.00',
      comment: '',
      isSubtotal: true,
    },
    {
      type: '',
      item: '',
      level: '',
      position: '',
      name: '',
      dept: '',
      role: '',
      task: '',
      infra: '',
      from: '',
      to: '',
      effortSale: '22.00',
      effortNoSale: '0.00',
      comment: '',
      isTotal: true,
    },
  ];

  const columnDefs = useMemo(() => [
    { headerName: '구분', field: 'type' },
    { headerName: '품목', field: 'item' },
    { headerName: '기술등급', field: 'level' },
    { headerName: '직책', field: 'position' },
    { headerName: '이름', field: 'name', cellStyle: params => params.value === '소개' ? { color: 'red' } : {} },
    { headerName: '매출', field: 'dept' },
    { headerName: '역할', field: 'role' },
    { headerName: '담당업무', field: 'task' },
    { headerName: '인프라', field: 'infra' },
    { headerName: '투입기간 (From)', field: 'from' },
    { headerName: '투입기간 (To)', field: 'to' },
    {
      headerName: '공수(M/M)',
      children: [
        {
          headerName: '매출',
          field: 'effortSale',
          cellClass: params =>
            params.data?.isSubtotal || params.data?.isTotal ? 'text-red-600 font-bold text-right' : 'text-right',
        },
        {
          headerName: '비매출',
          field: 'effortNoSale',
          cellClass: params =>
            params.data?.isSubtotal || params.data?.isTotal ? 'text-blue-600 font-bold text-right' : 'text-right',
        },
      ],
    },
    { headerName: '비고', field: 'comment' },
  ], []);

  return (
    <div className="mdi flex flex-col h-full overflow-hidden">
      {/* 🔹 타이틀 */}
      <div className="tit_area">
        <h3>투입인력계획 목록</h3>
        <div className="ml-auto flex gap-1">
          <button className="btn-base btn-delete">삭제</button>
          <button className="btn-base btn-etc">신규</button>
          <button className="btn-base btn-etc">수정</button>
          <button className="btn-base btn-search">조회</button>
        </div>
      </div>

      {/* 🔸 그리드 */}
      <div className="gridbox-div ag-theme-alpine flex-1 min-h-0">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          headerHeight={35}
          rowHeight={32}
        />
      </div>
    </div>
  );
}
