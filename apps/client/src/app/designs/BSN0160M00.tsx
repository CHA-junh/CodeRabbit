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
        <div className="search-div mb-4">
        <table className="search-table">
            <tbody>
            <tr className="search-tr">
                <th className="search-th w-[100px]">조회년월</th>
                <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                    <option>2025-07</option>
                    <option>2025-06</option>
                </select>
                </td>
                <th className="search-th w-[120px]">자사/외주구분</th>
                <td className="search-td">
                    <label className="mr-2"><input type="radio" name="type" defaultChecked /> 전체</label>
                    <label className="mr-2"><input type="radio" name="type" /> 자사</label>
                    <label><input type="radio" name="type" /> 외주</label>
                </td>
                <td className="search-td text-right">
                <button type="button" className="btn-base btn-search">조회</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

      {/* 📘 타이틀 영역 */}
      <div className="tit_area">
        <h3>당월 실 투입 입력 현황 확인</h3>
      </div>

      {/* 📋 그리드 전체 */}
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
          <tbody>
            {data.map((row, idx) => (
              <tr className="grid-tr" key={idx}>
                <td className="grid-td">{row.type}</td>
                <td className="grid-td">{row.grade}</td>
                <td className="grid-td">{row.position}</td>
                <td className="grid-td">{row.name}</td>
                <td className="grid-td">{row.sales}</td>
                <td className="grid-td text-right">{row.unitPrice}</td>
                <td className="grid-td text-right">{row.mm}</td>
                <td className="grid-td text-right">{row.budget}</td>
                <td className="grid-td text-right">{row.execUnitPrice}</td>
                <td className="grid-td text-right">{row.planMM}</td>
                <td className="grid-td text-right">{row.planAmount}</td>
                <td className="grid-td text-right">{row.execMM}</td>
                <td className="grid-td text-right">{row.execAmount}</td>
                <td className="grid-td text-right">{row.totalPlanMM}</td>
                <td className="grid-td text-right">{row.totalPlanAmount}</td>
                <td className="grid-td text-right">{row.totalExecMM}</td>
                <td className="grid-td text-right">{row.totalExecAmount}</td>
                <td className="grid-td">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
