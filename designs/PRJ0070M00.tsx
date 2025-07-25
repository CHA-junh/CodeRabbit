'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

export default function PRJ0070M00() {
  const rowData = [
    {
      type: '자사',
      company: '부탐정보시스템',
      level: '특급',
      position: '부장',
      name: '최인호',
      dept: '매출',
      role: 'PM',
      task: 'Amore Pacific CS 시스템',
      infra: 'N',
      planStart: '2025/01/01',
      planEnd: '2025/12/31',
      planEffortSale: 12,
      planEffortNoSale: 0,
      execStart: '2025/01/01',
      execEnd: '2025/12/31',
      execEffortSale: 12,
      execEffortNoSale: 0,
    },
    {
      type: '자사',
      company: '부탐정보시스템',
      level: '중급',
      position: '대리',
      name: '서연희',
      dept: '매출',
      role: 'DP',
      task: 'Amore Pacific CS 시스템',
      infra: 'N',
      planStart: '2025/03/01',
      planEnd: '2025/12/31',
      planEffortSale: 10,
      planEffortNoSale: 0,
      execStart: '2025/03/01',
      execEnd: '2025/12/31',
      execEffortSale: 10,
      execEffortNoSale: 0,
    },
    {
      name: '소계',
      planEffortSale: '22.00',
      planEffortNoSale: '0.00',
      execEffortSale: '22.00',
      execEffortNoSale: '0.00',
      isSubtotal: true,
    },
    {
      name: '합계',
      planEffortSale: '22.00',
      planEffortNoSale: '0.00',
      execEffortSale: '22.00',
      execEffortNoSale: '0.00',
      isTotal: true,
    },
  ];

  const columnDefs = useMemo(() => [
    { headerName: '구분', field: 'type' },
    { headerName: '소속사', field: 'company' },
    { headerName: '기술등급', field: 'level' },
    { headerName: '직책', field: 'position' },
    { headerName: '이름', field: 'name', cellStyle: params => {
      if (params.value === '소계') return { color: 'red', fontWeight: 'bold' };
      if (params.value === '합계') return { color: 'blue', fontWeight: 'bold' };
      return {};
    }},
    { headerName: '매출', field: 'dept' },
    { headerName: '역할', field: 'role' },
    { headerName: '담당업무', field: 'task' },
    { headerName: '인프라', field: 'infra' },
    {
      headerName: '계획 투입기간',
      children: [
        { headerName: '시작', field: 'planStart' },
        { headerName: '종료', field: 'planEnd' },
      ],
    },
    {
      headerName: '계획공수',
      children: [
        {
          headerName: '매출',
          field: 'planEffortSale',
          cellClass: params => (params.data?.isSubtotal || params.data?.isTotal) ? 'text-red-600 font-bold text-right' : 'text-right',
        },
        {
          headerName: '비매출',
          field: 'planEffortNoSale',
          cellClass: params => (params.data?.isSubtotal || params.data?.isTotal) ? 'text-red-600 font-bold text-right' : 'text-right',
        },
      ],
    },
    {
      headerName: '실 투입기간',
      children: [
        { headerName: '시작', field: 'execStart' },
        { headerName: '종료', field: 'execEnd' },
      ],
    },
    {
      headerName: '실공수',
      children: [
        {
          headerName: '매출',
          field: 'execEffortSale',
          cellClass: params => (params.data?.isSubtotal || params.data?.isTotal) ? 'text-blue-600 font-bold text-right' : 'text-right',
        },
        {
          headerName: '비매출',
          field: 'execEffortNoSale',
          cellClass: params => (params.data?.isSubtotal || params.data?.isTotal) ? 'text-blue-600 font-bold text-right' : 'text-right',
        },
      ],
    },
  ], []);

  return (
    <div className="mdi flex flex-col h-full overflow-hidden">
      {/* 🔷 타이틀 */}
      <div className="tit_area">
        <h3>실 투입 인력 목록</h3>
        <div className="ml-auto flex gap-1">
            <button className="btn-base btn-delete">삭제</button>
            <button className="btn-base btn-etc">신규</button>
            <button className="btn-base btn-etc">수정</button>
        </div>
    </div>

      {/* 🔶 그리드 */}
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
