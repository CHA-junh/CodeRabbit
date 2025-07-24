'use client';

import React from 'react';
import './common.css';

export default function BSN0630M00() {
  // 상단 더미 데이터
  const topGridData = [
    {
      no: 1,
      division: '전략기획본부',
      name: '홍길동',
      position: '부장',
      summary_target: 10,
      summary_active: 8,
      monthly: Array.from({ length: 10 }, (_, i) => ({
        target: i % 2 === 0 ? 1 : 0,
        active: 1,
      })),
    },
    // 추가 데이터...
  ];

  // 하단 통계 더미 데이터
  const bottomGridData = [
    { label: '가동공수', summary: 10, months: Array(10).fill(0) },
    { label: '가동율(%)', summary: 10, months: Array(10).fill(1) },
    { label: '비매출가동', summary: 10, months: Array(10).fill(0) },
    { label: '연구개발', summary: 10, months: Array(10).fill(0) },
    { label: '총인원수', summary: 10, months: Array(10).fill(0) },
    { label: '계획인원수', summary: 10, months: Array(10).fill(0) },
  ];

  return (
    <div className="mdi">
      {/* 타이틀 영역 */}
      <div className="tit_area flex justify-between items-center">
        <h3>직책별 가동현황</h3>
        <div className="flex gap-2">
          
          <button className="btn-base btn-excel">엑셀</button>
          <button className="btn-base btn-search">조회</button>
        </div>
      </div>

      {/* 상단 그리드 */}
      <div className="gridbox-div mb-4">
        <div className="grid-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th" rowSpan={2}>No</th>
                <th className="grid-th" rowSpan={2}>본부</th>
                <th className="grid-th" rowSpan={2}>성명</th>
                <th className="grid-th" rowSpan={2}>직책</th>
                <th className="grid-th" colSpan={2}>2025년 합계</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th className="grid-th" colSpan={2} key={`month-${i}`}>{i + 1}월</th>
                ))}
              </tr>
              <tr>
                <th className="grid-th">대상</th>
                <th className="grid-th">가동</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <React.Fragment key={`submonth-${i}`}>
                    <th className="grid-th">대상</th>
                    <th className="grid-th">가동</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {topGridData.map((item, i) => (
                <tr key={i} className="grid-tr">
                  <td className="grid-td">{item.no}</td>
                  <td className="grid-td">{item.division}</td>
                  <td className="grid-td">{item.name}</td>
                  <td className="grid-td">{item.position}</td>
                  <td className="grid-td">{item.summary_target}</td>
                  <td className="grid-td">{item.summary_active}</td>
                  {item.monthly.map((m, j) => (
                    <React.Fragment key={j}>
                      <td className="grid-td">{m.target}</td>
                      <td className="grid-td">{m.active}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 하단 통계 테이블 */}
      <div className="gridbox-div">
        <div className="grid-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th" rowSpan={2}>지표</th>
                <th className="grid-th">2025년 합계</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <th className="grid-th" key={`stat-head-${i}`}>{i + 1}월</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bottomGridData.map((row, i) => (
                <tr key={i} className="grid-tr">
                  <td className="grid-td">{row.label}</td>
                  <td className="grid-td">{row.summary}</td>
                  {row.months.map((val, j) => (
                    <td className="grid-td" key={`stat-${i}-${j}`}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
