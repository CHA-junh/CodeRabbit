'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './common.css';

export default function BSN0740M00() {
  const columnDefs = useMemo(() => [
    { headerName: 'No', field: 'no', width: 60 },
    { headerName: '업체', field: 'company', width: 120 },
    { headerName: '등급', field: 'level', width: 100 },
    { headerName: '개발자', field: 'developer', width: 100 },
    {
      headerName: '소싱진행결과',
      children: [
        { headerName: '배정프로젝트', field: 'assignProject', width: 120 },
        { headerName: '투입예정', field: 'planDate', width: 100 },
        { headerName: '협의단가', field: 'price', width: 100 },
        { headerName: '사업번호', field: 'businessNo', width: 120 },
      ],
    },
    {
      headerName: '투입현황',
      children: [
        { headerName: '프로젝트명', field: 'projectName', width: 120 },
        { headerName: '투입일자', field: 'startDate', width: 100 },
        { headerName: '철수일자', field: 'endDate', width: 100 },
      ],
    },
    {
      headerName: '계약현황',
      children: [
        { headerName: '계약일자', field: 'contractDate', width: 100 },
        { headerName: '구분', field: 'type', width: 80 },
        { headerName: '계약단가', field: 'contractPrice', width: 100 },
      ],
    },
  ], []);

  const rowData = [];

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      {/* 🔍 조회 조건 */}
      <div className="search-div mb-4">
        <table className="search-table">
          <tbody>
            <tr>
              <th className="search-th w-[80px]">투입일자</th>
              <td className="search-td w-[250px]">
                <div className="flex items-center gap-1">
                  <input type="date" className="input-base input-calender" />
                  <span>~</span>
                  <input type="date" className="input-base input-calender" />
                </div>
              </td>
              <th className="search-th w-[100px]">외주업체</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full"><option>전체</option></select>
              </td>
              <th className="search-th w-[90px]">기술등급</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full"><option>전체</option></select>
              </td>
              <td></td>
            </tr>
            <tr>
              <th className="search-th">계약구분</th>
              <td className="search-td">
                <label className="mr-4"><input type="radio" name="type" className="mr-1" /> 전체</label>
                <label className="mr-4"><input type="radio" name="type" className="mr-1" /> 미처리</label>
                <label><input type="radio" name="type" className="mr-1" /> 처리</label>
              </td>
              <th className="search-th w-[70px]">개발자</th>
              <td className="search-td w-[150px]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <td colSpan={3}></td>
              <td className="search-td w-[70px]">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📘 타이틀 */}
      <div className="tit_area">
        <h3>외주인력 투입 및 계약현황</h3>
        <div className="ml-auto flex gap-2">
          <button className="btn-base btn-excel">엑셀</button>
        </div>
      </div>

      {/* 📊 그리드 */}
      <div className="gridbox-div ag-theme-alpine h-[230px] mb-4">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          headerHeight={36}
          rowHeight={32}
          suppressMovableColumns
        />
      </div>

      {/* 하단 영역 전체 */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* 타이틀 */}
        <div className="tit_area">
          <h3>외주계약정보 조회 및 등록</h3>
          <div className="ml-auto flex gap-2">
            <button className="btn-base btn-etc">투입현황조회</button>
            <button className="btn-base btn-etc">외주사원정보수정</button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 gap-4 overflow-hidden">
          {/* 좌측: 외주계약정보 */}
          <div className="flex flex-col w-1/2 overflow-hidden">
            <div className="tit_area sub-title">
              <h3>타이틀</h3>
            </div>
            <table className="form-table mb-4">
              <tbody>
                <tr>
                  <th className="form-th w-[100px]">외주업체</th>
                  <td className="form-td"><input type="text" className="input-base w-full" /></td>
                  <th className="form-th w-[100px]">개발자명</th>
                  <td className="form-td"><input type="text" className="input-base w-full" /></td>
                  <th className="form-th w-[100px]">기술등급</th>
                  <td className="form-td w-[100px]"><input type="text" className="input-base w-full" /></td>
                </tr>
                <tr>
                  <th className="form-th">사업번호</th>
                  <td className="form-td"><input type="text" className="input-base w-full" /></td>
                  <th className="form-th">프로젝트명</th>
                  <td className="form-td" colSpan={3}><input type="text" className="input-base w-full" /></td>
                </tr>
                <tr>
                  <th className="form-th">투입일자</th>
                  <td className="form-td"><input type="date" className="input-base input-calender w-full" /></td>
                  <th className="form-th">철수일자</th>
                  <td className="form-td"><input type="date" className="input-base input-calender w-full" /></td>
                  <th className="form-th">투입공수</th>
                  <td className="form-td"><input type="text" className="input-base w-full" /></td>
                </tr>
              </tbody>
            </table>
            <div className="gridbox-div  flex-1 ag-theme-alpine">
              <AgGridReact
                columnDefs={[
                  { headerName: 'No', field: 'no', width: 50 },
                  { headerName: '계약일자', field: 'contractDate', width: 100 },
                  { headerName: '구분', field: 'type', width: 80 },
                  { headerName: '시작일자', field: 'startDate', width: 100 },
                  { headerName: '종료일자', field: 'endDate', width: 100 },
                  { headerName: '협단가', field: 'unitPrice', width: 100 },
                  { headerName: '지급일', field: 'payday', width: 100 },
                  { headerName: '비고', field: 'note', width: 150 },
                ]}
                rowData={[]}
                headerHeight={36}
                rowHeight={32}
                suppressMovableColumns
              />
            </div>
            <div className="flex justify-end gap-2 mt-2 h-[35px]">
            {/* <button className="btn-base btn-etc">신규</button>
            <button className="btn-base btn-act">저장</button>
            <button className="btn-base btn-delete">삭제</button> */}
            </div>
          </div>

          {/* 우측: 계약 상세조회 */}
            <div className="flex flex-col w-1/2 min-h-0 overflow-hidden">
            <div className="tit_area sub-title">
                <h3>계약 상세조회 및 등록</h3>
            </div>
            <table className="form-table">
              <tbody>
                <tr>
                  <th className="form-th w-[90px]">계약일자</th>
                  <td className="form-td w-[150px]"><input type="date" className="input-base input-calender" /></td>
                  <th className="form-th w-[90px]">계약구분</th>
                  <td className="form-td" colSpan={3}>
                    <label className="mr-4"><input type="radio" name="gubun" /> 신규</label>
                    <label className="mr-4"><input type="radio" name="gubun" /> 변경</label>
                    <label className="mr-4"><input type="radio" name="gubun" /> 추가</label>
                    <select className="combo-base ml-2 !w-[100px]"><option>미정(N/A)</option></select>
                  </td>
                </tr>
                <tr>
                  <th className="form-th">계약시작일</th>
                  <td className="form-td"><input type="date" className="input-base input-calender" /></td>
                  <th className="form-th">계약종료일</th>
                  <td className="form-td"><input type="date" className="input-base input-calender" /></td>
                  <th className="form-th w-[100px]">계약단가</th>
                  <td className="form-td"><input type="text" className="input-base !w-[calc(100%-20px)]" /> 원</td>
                </tr>
                <tr>
                  <th className="form-th">월지급일</th>
                  <td className="form-td"><input type="text" className="input-base !w-[calc(100%-20px)]" /> 일</td>
                  <th className="form-th">지급조건</th>
                  <td className="form-td" colSpan={3}><input type="text" className="input-base w-full" /></td>
                </tr>
                <tr>
                  <th className="form-th">변경사유</th>
                  <td className="form-td" colSpan={5}><input type="text" className="input-base w-full" /></td>
                </tr>
                <tr>
                  <th className="form-th align-top">비고</th>
                  <td className="form-td" colSpan={5}>
                    <textarea className="input-base resize-none min-h-[140px]"></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2 flex justify-end gap-2">
              <button className="btn-base btn-etc">신규</button>
              <button className="btn-base btn-act">저장</button>
              <button className="btn-base btn-delete">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
