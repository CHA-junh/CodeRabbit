'use client';

import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

import BSN0720M00 from './BSN0720M00';
import BSN0730M00 from './BSN0730M00';

export default function BSN0710M00() {
  const [activeTab, setActiveTab] = useState('접수등록');

  const tabs = ['접수등록', '진행등록'];

  const columnDefs = useMemo(() => [
    { headerName: 'No', field: 'no', width: 60 },
    { headerName: '접수일자', field: 'received', width: 120 },
    { headerName: '업체', field: 'company', width: 120 },
    { headerName: '접수등급', field: 'grade', width: 100 },
    { headerName: '개발자', field: 'developer', width: 100 },
    { headerName: '경력', field: 'career', width: 100 },
    { headerName: '지원단가', field: 'price', width: 100 },
    { headerName: '지원프로젝트', field: 'project', width: 120 },
    { headerName: '단계', field: 'step', width: 80 },
    { headerName: '경과', field: 'progress', width: 100 },
    { headerName: '진행일자', field: 'progressDate', width: 120 },
    { headerName: '투입등급', field: 'level', width: 100 },
    { headerName: '비고 및 최종진행내용', field: 'note', flex: 1 },
  ], []);

  const rowData = []; // 초기 데이터 없음

  return (
    <div className="h-full flex flex-col overflow-hidden">
    {/* 🔍 조회 조건부 */}
    <div className="search-div mb-4">
        <table className="search-table">
        <tbody>
            <tr>
            <th className="search-th w-[90px]">접수일자</th>
            <td className="search-td w-[230px]">
                <div className="flex items-center gap-1">
                <input type="date" className="input-base input-calender" />
                <span className="mx-1">~</span>
                <input type="date" className="input-base input-calender" />
                </div>
            </td>
            <th className="search-th w-[90px]">외주업체</th>
            <td className="search-td !w-[150px]">
                <select className="combo-base w-full"><option>전체</option></select>
            </td>
            <th className="search-th w-[90px]">기술등급</th>
            <td className="search-td w-[150px]">
                <select className="combo-base w-full"><option>전체</option></select>
            </td>
            <th className="search-th w-[70px]">개발자</th>
            <td className="search-td w-[150px]">
                <input type="text" className="input-base input-default w-full" />
            </td>
            <td></td>
            </tr>
            <tr>
            <th className="search-th">최종단계</th>
            <td className="search-td">
                <select className="combo-base w-full"><option>전체</option></select>
            </td>
            <th className="search-th">최종투입일</th>
            <td className="search-td" colSpan={3}>
                <div className="flex items-center gap-1">
                <input type="date" className="input-base input-calender" />
                <span className="mx-1">~</span>
                <input type="date" className="input-base input-calender" />
                </div>
            </td>
            <td colSpan={3}></td>
            <td className="search-td w-[70px]">
                <button className="btn-base btn-search">조회</button>
            </td>
            </tr>
        </tbody>
        </table>
    </div>

    {/* 📘 타이틀 + 버튼 */}
    <div className="tit_area">
        <h3>외주인력 소싱현황</h3>
        <div className="ml-auto flex gap-2">
        <button className="btn-base btn-etc">외주계약</button>
        </div>
    </div>

    {/* 📊 고정 높이 그리드 */}
    <div className="gridbox-div ag-theme-alpine h-[220px] mb-4">
        <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        headerHeight={36}
        rowHeight={32}
        suppressMovableColumns
        />
    </div>

    {/* 🔀 서브탭 */}
    <div className="sub-tab-container flex-1 min-h-0 flex flex-col">
        <div className="sub-tab-list">
        {tabs.map((tab) => (
            <button
            key={tab}
            className={`sub-tab-button ${activeTab === tab ? 'sub-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
            >
            {tab}
            </button>
        ))}
        </div>

        <div className="sub-tab-panel flex-1 min-h-0 overflow-y-auto">
        {activeTab === '접수등록' && <BSN0720M00 />}
        {activeTab === '진행등록' && <BSN0730M00 />}
        </div>
    </div>
    </div>

  );
}
