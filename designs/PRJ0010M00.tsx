'use client';

import React, { useMemo } from 'react';
import './common.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


export default function PRJ0010M00() {
const columnDefs = useMemo(() => [
  { headerName: 'No', field: 'no', width: 60 },
  { headerName: '프로젝트번호', field: 'projectCode', width: 120 },
  { headerName: '프로젝트 명', field: 'projectName', width: 200 },
  { headerName: '시작일자', field: 'startDate', width: 100 },
  { headerName: '종료일자', field: 'endDate', width: 100 },
  { headerName: '사업부서', field: 'businessDept', width: 120 },
  { headerName: '영업대표', field: 'salesRep', width: 100 },
  { headerName: '실행부서', field: 'execDept', width: 120 },
  { headerName: 'PM', field: 'pm', width: 80 },
  {
    headerName: '공수',
    children: [
      { headerName: '사업', field: 'work', width: 80 },
      { headerName: '계획', field: 'plan', width: 80 },
      { headerName: '실행', field: 'exec', width: 80 },
    ],
  },
  { headerName: '사업진행 상태', field: 'status', width: 120 },
  { headerName: '비고', field: 'note', width: 100 },
], []);

const rowData = useMemo(() => [
  {
    no: 1,
    projectCode: 'BTS23-25BB',
    projectName: '기아자동차 차세대 고객센터 구축 프로젝트',
    startDate: '2024/03/18',
    endDate: '2025/05/31',
    businessDept: '영업2팀(25)',
    salesRep: '주재용',
    execDept: '공통',
    pm: '정주원',
    work: 158,
    plan: 149.65,
    exec: 153.6,
    status: '수주확정',
    note: '',
  },
  {
    no: 2,
    projectCode: 'BTM25-011B',
    projectName: '[FY2025년] 아모레 고객센터 운영',
    startDate: '2025/01/01',
    endDate: '2025/12/31',
    businessDept: '디지털정보본부(24)',
    salesRep: '조형원',
    execDept: '공통',
    pm: '최민호',
    work: 22,
    plan: 22,
    exec: 22,
    status: '수주확정',
    note: '',
  },
], []);

  return (
    <div className="mdi h-full flex flex-col">
      {/* 🔹 타이틀 + 등록 버튼 */}
    <div className="tit_area">
        <h3>프로젝트 진행 현황</h3>
        <span className="text-sm text-blue-500 ml-2 m-1">
        ※ 프로젝트 개요 등이 등록된 사업만 조회 가능합니다. [프로젝트 등록] 버튼을 클릭하세요.
        </span>
        <div className="ml-auto">
            <button className="btn-base btn-act">프로젝트 등록</button>
        </div>
    </div>

    {/* 🔍 조회조건 영역 */}
    <div className="search-div mb-4">
    <table className="search-table">
        <tbody>
        <tr className="search-tr">
            <th className="search-th w-[160px]">
            <select className="combo-base">
                <option>사업시작일</option>
            </select>
            </th>
            <td className="search-td w-[310px]">
            <div className="flex items-center gap-1">
                <input type="date" className="input-base input-calender w-[150px]" />
                <span className="m-1">~</span>
                <input type="date" className="input-base input-calender w-[150px]" />
            </div>
            </td>

            <th className="search-th w-[150px]">
            <select className="combo-base">
                <option>사업번호</option>
            </select>
            </th>
            <td className="search-td min-w-[350px]" colSpan={3}>
            <input className="input-base input-default"/>
            </td>

            <th className="search-th w-[100px]">사업구분</th>
            <td className="search-td">
            <select className="combo-base w-[160px]">
                <option>전체</option>
            </select>
            </td>

            <td className="search-td w-[10%]"></td>
        </tr>

        <tr className="search-tr">
            <th className="search-th">조회구분</th>
            <td className="search-td">
            <label className="mr-4"><input type="radio" name="viewType" className="mr-1" /> 전체</label>
            <label className="mr-4"><input type="radio" name="viewType" className="mr-1" /> 사업부서</label>
            <label><input type="radio" name="viewType" className="mr-1" /> 실행부서</label>
            </td>

            <th className="search-th">본부</th>
            <td className="search-td">
            <select className="combo-base w-[150px]"><option>전체</option></select>
            </td>

            <th className="search-th !w-[80px]">추진부서</th>
            <td className="search-td">
            <select className="combo-base w-[150px]"><option>전체</option></select>
            </td>

            <th className="search-th">영업대표</th>
            <td className="search-td">
            <select className="combo-base w-[160px]"><option>전체</option></select>
            </td>
        </tr>

        <tr className="search-tr">
            <th className="search-th">사업진행</th>
            <td className="search-td">
            <div className="flex flex-wrap items-center gap-3">
                <label><input type="checkbox" className="mr-1" /> (모두선택)</label>
                <label><input type="checkbox" className="mr-1" /> 수주확정</label>
                <label><input type="checkbox" className="mr-1" /> 계약</label>
                <label><input type="checkbox" className="mr-1" /> 완료(종결)</label>
            </div>
            </td>

            <th className="search-th">업무구분</th>
            <td className="search-td">
            <select className="combo-base w-[160px]"><option>전체</option></select>
            </td>

            <th className="search-th">고객구분</th>
            <td className="search-td">
            <select className="combo-base"><option>전체</option></select>
            </td>
            <th className="search-th w-[100px]">개발자명</th>
            <td className="search-td">
            <input type="text" className="input-base input-default w-[160px]" />
            </td>
            <td className="search-td text-right" colSpan={3}>
                <button className="btn-base btn-search">조회</button>
            </td>
        </tr>
        </tbody>
    </table>
    </div>


      {/* 📌 타이틀 + 버튼 */}
      <div className="tit_area">
        <h3>프로젝트 목록         
        <span className="text-sm text-blue-500 ml-2 m-1">
        ※ 프로젝트 개요 등이 등록된 사업만 조회 가능합니다. [프로젝트 등록] 버튼을 클릭하세요.
        </span>
        </h3>

        <div className="flex gap-2">
          <button className="btn-base btn-etc">품의서작성</button>
          <button className="btn-base btn-excel">엑셀</button>
        </div>
      </div>

      {/* 🟦 안내문 */}


     <div className="flex-1">
        <div className="gridbox-div ag-theme-alpine h-full min-h-[200px]">
            <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            headerHeight={36}
            rowHeight={32}
            domLayout="normal"
            suppressMovableColumns
            />
        </div>
        </div>
    </div>
  );
}
