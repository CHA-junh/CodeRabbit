'use client';

import React from 'react';
import './common.css';

export default function BSN0640M00() {
  const months = Array.from({ length: 10 }, (_, i) => i + 1); // 1~10월
  const stats = ['가동공수', '가동율(%)', '비매출가동', '연구개발', '총인원수', '계획인원수'];

  return (
    <div className="mdi">
      {/* 타이틀 및 버튼 */}
      <div className="tit_area flex justify-between items-center">
        <h3>기술등급별 가동현황</h3>
        <div className="flex gap-2">
          <button className="btn-base btn-search">조회</button>
          {/* <button className="btn-base btn-excel">엑셀</button> */}
        </div>
      </div>

      {/* 상단 테이블 */}
      <div className="gridbox-div mb-2">
        <table className="grid-table">
          <thead>
            <tr>
              <th rowSpan={2} className="grid-th">No</th>
              <th rowSpan={2} className="grid-th">구분</th>
              <th rowSpan={2} className="grid-th">등급</th>
              <th colSpan={2} className="grid-th">2025년 합계</th>
              {months.map((m) => (
                <th key={`month-${m}`} colSpan={2} className={`grid-th ${m === 7 ? 'text-red-500' : ''}`}>{m}월</th>
              ))}
            </tr>
            <tr>
              <th className="grid-th">대상</th>
              <th className="grid-th">가동</th>
              {months.map((m) => (
                <React.Fragment key={`month-detail-${m}`}>
                  <th className={`grid-th ${m === 7 ? 'text-red-500' : ''}`}>대상</th>
                  <th className={`grid-th ${m === 7 ? 'text-red-500' : ''}`}>가동</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* TODO: 더미 데이터 or 실제 데이터 삽입 */}
            {[1, 2, 3].map((row, i) => (
              <tr key={i} className="grid-tr">
                <td className="grid-td">{i + 1}</td>
                <td className="grid-td">개발</td>
                <td className="grid-td">초급</td>
                <td className="grid-td">2</td>
                <td className="grid-td">1</td>
                {months.map((m) => (
                  <React.Fragment key={`row-${i}-month-${m}`}>
                    <td className={`grid-td ${m === 7 ? 'text-red-500' : ''}`}>1</td>
                    <td className={`grid-td ${m === 7 ? 'text-red-500' : ''}`}>1</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 안내문 */}
      <p className="text-green-600 text-xs mb-6">※리스트를 더블클릭하면 가동인원조회 화면으로 갑니다.</p>

      {/* 하단 통계 테이블 */}
      <div className="gridbox-div">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th" rowSpan={2}>지표</th>
              <th className="grid-th">2025년 합계</th>
              {months.map((m) => (
                <th key={`stat-header-${m}`} className={`grid-th ${m === 7 ? 'text-red-500' : ''}`}>{m}월</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((label, idx) => (
              <tr key={idx} className="grid-tr">
                <td className="grid-td">{label}</td>
                <td className="grid-td text-blue-600">0</td>
                {months.map((m) => (
                  <td
                    key={`stat-${idx}-${m}`}
                    className={`grid-td ${m === 7 ? 'text-red-500' : 'text-[#003366]'}`}
                  >
                    0
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
