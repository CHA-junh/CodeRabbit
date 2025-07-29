'use client';

import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface PersonData {
  no: number;
  division: string;
  position: string;
  name: string;
  status: string;
  projectNo: string;
  projectName: string;
  grade: string;
  startDate: string;
  endDate: string;
  type: string;
  days: number;
  role: string;
  task: string;
}

export default function BSN0682M00() {
  // AG-Grid ref
  const businessGridRef = useRef<AgGridReact<PersonData>>(null);

  // 샘플 데이터
  const [rowData] = useState<PersonData[]>([
    {
      no: 1,
      division: '본부1',
      position: '과장',
      name: '김철수',
      status: '재직',
      projectNo: 'BSN2025001',
      projectName: '고객관리시스템 구축',
      grade: '고급',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      type: '투입',
      days: 120,
      role: 'PM',
      task: '프로젝트 관리'
    },
    {
      no: 2,
      division: '본부2',
      position: '대리',
      name: '이영희',
      status: '재직',
      projectNo: 'BSN2025002',
      projectName: '웹사이트 리뉴얼',
      grade: '중급',
      startDate: '2025-02-01',
      endDate: '2025-05-31',
      type: '투입',
      days: 90,
      role: '개발자',
      task: '프론트엔드 개발'
    },
    {
      no: 3,
      division: '본부1',
      position: '사원',
      name: '박민수',
      status: '휴직',
      projectNo: 'BSN2025003',
      projectName: '데이터베이스 마이그레이션',
      grade: '초급',
      startDate: '2025-03-01',
      endDate: '2025-04-30',
      type: '철수',
      days: 60,
      role: '보조개발자',
      task: '데이터 정리'
    }
  ]);

  // AG-Grid 컬럼 정의
  const [businessColDefs] = useState<ColDef[]>([
    {
      headerName: 'No',
      field: 'no',
      width: 60,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'no',
    },
    {
      headerName: '사업본부',
      field: 'division',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'division',
    },
    {
      headerName: '직책',
      field: 'position',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'position',
    },
    {
      headerName: '성명',
      field: 'name',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'name',
    },
    {
      headerName: '근무상태',
      field: 'status',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'status',
    },
    {
      headerName: '사업번호',
      field: 'projectNo',
      width: 120,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'projectNo',
    },
    {
      headerName: '프로젝트명',
      field: 'projectName',
      width: 300,
      flex: 1,
      cellStyle: { textAlign: 'left' },
      headerClass: 'ag-center-header',
      tooltipField: 'projectName',
    },
    {
      headerName: '등급',
      field: 'grade',
      width: 80,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'grade',
    },
    {
      headerName: '투입일자',
      field: 'startDate',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'startDate',
    },
    {
      headerName: '철수일자',
      field: 'endDate',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'endDate',
    },
    {
      headerName: '구분',
      field: 'type',
      width: 80,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'type',
    },
    {
      headerName: '공수',
      field: 'days',
      width: 80,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'days',
    },
    {
      headerName: '역할',
      field: 'role',
      width: 100,
      flex: 0,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-center-header',
      tooltipField: 'role',
    },
    {
      headerName: '담당업무',
      field: 'task',
      width: 200,
      flex: 0,
      cellStyle: { textAlign: 'left' },
      headerClass: 'ag-center-header',
      tooltipField: 'task',
    },
  ]);

  // 더블클릭 핸들러
  const handleRowDoubleClick = (event: any) => {
    console.log('더블클릭된 인원:', event.data);
    // TODO: 개인별 프로젝트 투입현황 팝업 호출
  };

  // AG-Grid 선택 이벤트
  const onBusinessSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      console.log('선택된 인원:', selectedRows[0]);
    }
  };

  // AG-Grid 준비 완료 이벤트
  const onBusinessGridReady = (params: any) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 🔷 타이틀 + 엑셀 + 조회버튼 */}
      <div className="tit_area flex justify-between items-center mb-2">
        <h3>인원 리스트</h3>
        <div className="flex gap-2">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm">
            엑셀
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
            조회
          </button>
        </div>
      </div>

      {/* 📊 ag-Grid (COMZ040P00과 동일한 설정) */}
      <div className='ag-theme-alpine' style={{ height: 400, width: "100%" }}>
        <AgGridReact
          ref={businessGridRef}
          rowData={rowData}
          columnDefs={businessColDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
          }}
          rowSelection='single'
          onSelectionChanged={onBusinessSelectionChanged}
          onRowDoubleClicked={(event) => {
            handleRowDoubleClick(event);
          }}
          onGridReady={onBusinessGridReady}
          getRowStyle={(params) => {
            if (params.data?.status === '휴직') {
              return { color: 'red' };
            } else if (params.data?.status === '비매출') {
              return { color: 'blue' };
            }
            return { color: 'black' };
          }}
          components={{
            agColumnHeader: (props: any) => (
              <div style={{ textAlign: "center", width: "100%" }}>
                {props.displayName}
              </div>
            ),
          }}
        />
      </div>

      {/* 📌 안내문 */}
      <div className="text-[13px] text-left text-blue-500 mt-2">
        <p>※ 조회 현시점에서 투입 또는 철수 기간에 해당되는 인원 리스트를 조회하는 화면입니다. 리스트를 더블클릭하면 개인별 프로젝트 투입현황 화면이 팝업됩니다.</p>
        <p className="text-black mt-1">- 현재 휴직자이거나 퇴사자는 <span className="text-[13px] text-red-500">빨간색</span>으로 표시되고</p>
        <p className="text-black">비매출 투입자는 <span className="text-[13px] text-blue-500">파란색</span>으로 표시됩니다.</p>
      </div>
    </div>
  );
} 