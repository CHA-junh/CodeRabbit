'use client';

import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import './common.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function BSN0670M00() {
  const columnDefs = useMemo(
    () => [
      { headerName: 'No', field: 'no', width: 60 },
      { headerName: '사업본부', field: 'division' },
      { headerName: '직책', field: 'position' },
      { headerName: '성명', field: 'name' },
      { headerName: '등급', field: 'grade' },
      { headerName: '근무상태', field: 'status' },
      { headerName: '가동구분', field: 'workType' },
      { headerName: '월가동공수', field: 'manhour' },
      {
        headerName: '최종프로젝트 투입내역',
        children: [
          { headerName: '사업번호', field: 'projectNo' },
          { headerName: '프로젝트명', field: 'projectName' },
          { headerName: '투입일자', field: 'startDate' },
          { headerName: '철수일자', field: 'endDate' },
          { headerName: '역할', field: 'role' },
          { headerName: '담당업무', field: 'task' },
        ],
      },
    ],
    []
  );

  const rowData = []; // 이후 데이터 바인딩

  return (
    <div className="mdi flex flex-col h-full">
      {/* 🔍 조회영역 */}
      <div className="search-div mb-4">
        <table className="search-table">
          <tbody>
            {/* 1행 */}
            <tr>
              <th className="search-th w-[110px]">조회기준년월</th>
              <td className="search-td w-[170px]">
                <select className="input-base !w-[150px]">
                  <option>2025/07</option>
                </select>
              </td>
              <th className="search-th w-[100px]">자사/외주구분</th>
              <td className="search-td w-[150px]">
                <label className="mr-2"><input type="radio" name="type" /> 자사</label>
                <label className="mr-2"><input type="radio" name="type" /> 외주</label>
              </td>
              <th className="search-th w-[100px]">가동구분</th>
              <td className="search-td w-[300px]">
                <label className="mr-3"><input type="checkbox" /> 가동</label>
                <label className="mr-3"><input type="checkbox" /> 연구개발</label>
                <label className="mr-3"><input type="checkbox" /> 비매출</label>
                <label className="mr-3"><input type="checkbox" /> 비가동</label>
              </td>
            </tr>
            {/* 2행 */}
            <tr>
              <th className="search-th">구분</th>
              <td className="search-td">
                <label className="mr-2"><input type="radio" name="dev" /> 개발인원만</label>
                <label className="mr-2"><input type="radio" name="dev" /> 전체</label>
              </td>
              <th className="search-th">본부</th>
              <td className="search-td">
                <select className="input-base w-full">
                  <option>전체</option>
                </select>
              </td>
              <th className="search-th">직책</th>
              <td className="search-td">
                <select className="input-base !w-[150px]">
                  <option>전체</option>
                </select>
              </td>
              <th className="search-th w-[80px]">등급</th>
              <td className="search-td">
                <select className="input-base w-[100px]">
                  <option>전체</option>
                </select>
              </td>
              <td></td>
              <td className="search-td flex justify-end">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📄 타이틀 + 엑셀 */}
      <div className="tit_area flex justify-between items-center">
        <h3>가동인원 리스트</h3>
        <button className="btn-base btn-excel">엑셀</button>
      </div>

      {/* 📊 ag-Grid 적용 */}
      <div className="ag-theme-alpine flex-1 min-w-[1200px] mt-2" style={{ height: '400px' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          domLayout="autoHeight"
        />
      </div>

      {/* 안내문 */}
      <div className="text-[12px] text-left text-blue-500 mt-3">
        <p>※ 리스트를 더블클릭하면 개인별 프로젝트 투입현황 화면이 팝업됩니다.</p>
        <p className="mt-1">*. 조회기준년월에 해당되는 가동 또는 비가동 인원 리스트를 조회하는 화면입니다.</p>
        <p>*. 가동구분의 ‘가동’에는 비매출 투입과 연구개발 프로젝트가 제외되고 연구개발, 비매출 또는 비가동 각각의 인원도 조회할 수 있습니다.</p>
        <p>*. 조회기준년월에 휴직자이거나 이후 퇴사자는 파란색으로, 철수예정자는 빨간색으로 표시됩니다.</p>
      </div>
    </div>
  );
}
