'use client';

import React from 'react';

export default function BSN0160M00() {
    
  const data = [
    {
      type: '자사',
      grade: '중급',
      position: 'PM',
      name: '김민수',
      sales: 'YES',
      unitPrice: '7,000,000',
      mm: '2.0',
      budget: '14,000,000',
      execUnitPrice: '6,800,000',
      planMM: '2.0',
      planAmount: '13,600,000',
      execMM: '1.8',
      execAmount: '12,240,000',
      totalPlanMM: '10.0',
      totalPlanAmount: '68,000,000',
      totalExecMM: '9.5',
      totalExecAmount: '64,600,000',
      note: '-',
    },
  ];

  return (
    <div>
      {/* 🔍 조회 조건 */}
      <div className="search-div flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="w-[100px]">조회년월</label>
          <select className="combo-base w-[150px]">
            <option>2025-07</option>
            <option>2025-06</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="w-[100px]">자사/외주구분</label>
          <label><input type="radio" name="type" defaultChecked /> 전체</label>
          <label><input type="radio" name="type" /> 자사</label>
          <label><input type="radio" name="type" /> 외주</label>
        </div>
        <div className="ml-auto">
          <button type="button" className="btn-base btn-search">조회</button>
        </div>
      </div>

      {/* 📘 타이틀 영역 */}
      <div className="tit_area">
        <h3>당월 실 투입 입력 현황 확인</h3>
      </div>

      {/* 📋 그리드 */}
      <div className="gridbox-div">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th" rowSpan={2}>구분</th>
              <th className="grid-th" rowSpan={2}>기술등급</th>
              <th className="grid-th" rowSpan={2}>직책</th>
              <th className="grid-th" rowSpan={2}>이름</th>
              <th className="grid-th" rowSpan={2}>매출</th>
              <th className="grid-th" colSpan={3}>계획(예산)</th>
              <th className="grid-th" rowSpan={2}>실행단가</th>
              <th className="grid-th" colSpan={2}>당월 계획</th>
              <th className="grid-th" colSpan={2}>당월 실행</th>
              <th className="grid-th" colSpan={2}>누계 계획</th>
              <th className="grid-th" colSpan={2}>누계 실행</th>
              <th className="grid-th" rowSpan={2}>비고</th>
            </tr>
            <tr>
              <th className="grid-th">단가</th>
              <th className="grid-th">공수</th>
              <th className="grid-th">예산비용</th>
              <th className="grid-th">공수</th>
              <th className="grid-th">금액</th>
              <th className="grid-th">공수</th>
              <th className="grid-th">금액</th>
              <th className="grid-th">공수</th>
              <th className="grid-th">금액</th>
              <th className="grid-th">공수</th>
              <th className="grid-th">금액</th>
            </tr>
          </thead>
        </table>

        {/* tbody는 div로 처리 */}
        <div className="grid-tbody">
          {data.map((row, idx) => (
            <div className="grid-tr" key={idx}>
              <div className="grid-td">{row.type}</div>
              <div className="grid-td">{row.grade}</div>
              <div className="grid-td">{row.position}</div>
              <div className="grid-td">{row.name}</div>
              <div className="grid-td">{row.sales}</div>
              <div className="grid-td text-right">{row.unitPrice}</div>
              <div className="grid-td text-right">{row.mm}</div>
              <div className="grid-td text-right">{row.budget}</div>
              <div className="grid-td text-right">{row.execUnitPrice}</div>
              <div className="grid-td text-right">{row.planMM}</div>
              <div className="grid-td text-right">{row.planAmount}</div>
              <div className="grid-td text-right">{row.execMM}</div>
              <div className="grid-td text-right">{row.execAmount}</div>
              <div className="grid-td text-right">{row.totalPlanMM}</div>
              <div className="grid-td text-right">{row.totalPlanAmount}</div>
              <div className="grid-td text-right">{row.totalExecMM}</div>
              <div className="grid-td text-right">{row.totalExecAmount}</div>
              <div className="grid-td">{row.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
