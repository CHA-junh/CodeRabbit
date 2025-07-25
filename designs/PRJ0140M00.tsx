'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

export default function PRJ0140M00() {
  const columnDefs = useMemo(() => [
    { headerName: '구분', field: 'division', width: 80 },
    { headerName: '기술등급', field: 'techLevel', width: 100 },
    { headerName: '직급', field: 'position', width: 100 },
    { headerName: '성명', field: 'name', width: 100 },
    {
      headerName: '계획',
      children: [
        { headerName: '단가', field: 'planUnitPrice', width: 100 },
        { headerName: '공수', field: 'planManday', width: 100 },
      ],
    },
    {
      headerName: '실행',
      children: [
        { headerName: '단가', field: 'execUnitPrice', width: 100 },
        { headerName: '공수', field: 'execManday', width: 100 },
      ],
    },
  ], []);

  const rowData = [];

  return (
    <div className="mdi h-full flex flex-col">
      {/* 🔷 타이틀 + 안내문 + 버튼 */}
        <div className="tit_area">
        <h3>월별 프로젝트 비용 현황</h3>
        <div className="flex items-center gap-1">
            <span className="text-[12px] text-gray-500 mr-2 m-1">(단위: 천원 / VAT별도)</span>
            <button className="btn-base btn-excel">출력</button>
            <button className="btn-base btn-search">조회</button>
        </div>
        </div>
        {/* 🔍 입력 테이블 */}
        <table className="form-table mb-4">
        <tbody>
            <tr className="form-tr">
            <th className="form-th w-[100px]">사업번호</th>
            <td className="form-td w-[200px]">
                <input type="text" className="input-base w-full" />
            </td>
            <th className="form-th w-[100px]">사업명</th>
            <td className="form-td w-[200px]">
                <input type="text" className="input-base w-full" />
            </td>
            <th className="form-th w-[120px]">공수(계획/실행)</th>
            <td className="form-td">
                <span className="m-1">
                <input type="text" className="input-base !w-[80px]" disabled />
                </span>
                /
                <span className="m-1">
                <input type="text" className="input-base !w-[80px]" disabled />
                </span>
            </td>
            </tr>
            <tr className="form-tr">
            <th className="form-th">사업기간</th>
            <td className="form-td">
                <input type="text" className="input-base w-full" />
            </td>
            <th className="form-th">수주금액</th>
            <td className="form-td w-[30%]">
                <input type="text" className="input-base !w-[80%]" /> 원
            </td>
            <th className="form-th">비용(계획/실행)</th>
            <td className="form-td">
                <span className="m-1">
                <input type="text" className="input-base !w-[80px]" disabled />
                </span>
                /
                <span className="m-1">
                <input type="text" className="input-base !w-[80px]" disabled />
                </span>
                천원
            </td>
            </tr>
            <tr className="form-tr">
            <th className="form-th">영업대표</th>
            <td className="form-td">
                <input type="text" className="input-base w-full" />
            </td>
            <th className="form-th">PM</th>
            <td className="form-td">
                <input type="text" className="input-base w-full" />
            </td>
            <th className="form-th">프로젝트 손익</th>
            <td className="form-td">
                <input type="text" className="input-base !w-[178px]" disabled /> 천원
            </td>
            </tr>
        </tbody>
        </table>


      {/* 📊 ag-Grid 영역 */}
      <div className="gridbox-div ag-theme-alpine flex-1 min-h-0">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{ resizable: true }}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}
