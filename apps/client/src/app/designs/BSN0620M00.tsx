'use client';

import React from 'react';
import './common.css';

export default function BSN0620M00() {
  return (
    <div className="mdi">
      {/* 타이틀 + 버튼 */}
      <div className="tit_area flex justify-between items-center">
        <h3>인원별 가동현황</h3>
        <div className="flex gap-2">
          <button type="button" className="btn-base btn-search">조회</button>
          <button type="button" className="btn-base btn-excel">엑셀</button>
        </div>
      </div>

      {/* 상단 그리드 */}
      <div className="gridbox-div mb-2">
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
                  <th className="grid-th" colSpan={2} key={`month-label-${i}`}>{i + 1}월</th>
                ))}
              </tr>
              <tr>
                <th className="grid-th">대상</th>
                <th className="grid-th">가동</th>
                {Array.from({ length: 10 }, (_, i) => (
                  <React.Fragment key={`month-detail-${i}`}>
                    <th className="grid-th">대상</th>
                    <th className="grid-th">가동</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="grid-tr">
                <td className="grid-td">1</td>
                <td className="grid-td">영업본부</td>
                <td className="grid-td">홍길동</td>
                <td className="grid-td">과장</td>
                <td className="grid-td">20</td>
                <td className="grid-td">18</td>
                {Array.from({ length: 10 }, (_, i) => (
                  <React.Fragment key={`row-${i}`}>
                    <td className="grid-td">2</td>
                    <td className="grid-td">2</td>
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 하단 통계 그리드 */}
      <div className="gridbox-div">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th" rowSpan={2}>자사</th>
              <th className="grid-th">2025년 합계</th>
              {Array.from({ length: 10 }, (_, i) => (
                <th className="grid-th" key={`stat-month-${i}`}>{i + 1}월</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['가동공수', '가동율(%)', '비매출가동', '연구개발', '총인원수', '계획인원수'].map((label, idx) => (
              <tr key={`stat-row-${idx}`} className="grid-tr">
                <td className="grid-td">{label}</td>
                <td className="grid-td">0</td>
                {Array.from({ length: 10 }, (_, i) => (
                  <td className="grid-td" key={`stat-${idx}-${i}`}>0</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
