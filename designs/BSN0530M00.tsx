'use client';

import React from 'react';
import './common.css';

export default function BSN0530M00() {
  const rows = [
    {
      구분1: '부가가치',
      구분2: '소계',
      합계_계획: '0.0',
      합계_실행: '7,325.4',
      '1월_실행': '1,231.4',
      '2월_실행': '567.1',
      '3월_실행': '1,647.5',
      '4월_실행': '2,835.9',
      '5월_실행': '922.0',
      '6월_실행': '0.0',
      '7월_실행': '0.0',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 🔷 타이틀 + 엑셀 버튼 */}
      <div className="tit_area flex justify-between items-center">
        <h3>2025년도 월별 계획대비 실적 (전체)</h3>
        <button className="btn-base btn-excel">엑셀</button>
      </div>

      {/* 📊 그리드 테이블 */}
      <div className="gridbox-div">
        <div className="grid-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th" rowSpan={2}>구분1</th>
                <th className="grid-th" rowSpan={2}>구분2</th>
                <th className="grid-th" colSpan={2}>합계</th>
                <th className="grid-th" colSpan={2}>1월</th>
                <th className="grid-th" colSpan={2}>2월</th>
                <th className="grid-th" colSpan={2}>3월</th>
                <th className="grid-th" colSpan={2}>4월</th>
                <th className="grid-th" colSpan={2}>5월</th>
                <th className="grid-th" colSpan={2}>6월</th>
                <th className="grid-th" colSpan={2}>7월</th>
              </tr>
              <tr>
                <th className="grid-th">계획</th><th className="grid-th">실행</th>
                <th className="grid-th">계획</th><th className="grid-th">실행</th>
                <th className="grid-th">계획</th><th className="grid-th">실행</th>
                <th className="grid-th">계획</th><th className="grid-th">실행</th>
                <th className="grid-th">계획</th><th className="grid-th">실행</th>
                <th className="grid-th">계획</th><th className="grid-th">실행</th>
                <th className="grid-th">계획</th><th className="grid-th">실행</th>
                <th className="grid-th">계획</th><th className="grid-th">실행</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="grid-tr">
                  <td className="grid-td">{row.구분1}</td>
                  <td className="grid-td">{row.구분2}</td>
                  <td className="grid-td text-blue-600">{row.합계_계획}</td>
                  <td className="grid-td text-red-600">{row.합계_실행}</td>
                  <td className="grid-td">0.0</td><td className="grid-td text-blue-600">{row['1월_실행']}</td>
                  <td className="grid-td">0.0</td><td className="grid-td">{row['2월_실행']}</td>
                  <td className="grid-td">0.0</td><td className="grid-td">{row['3월_실행']}</td>
                  <td className="grid-td">0.0</td><td className="grid-td">{row['4월_실행']}</td>
                  <td className="grid-td">0.0</td><td className="grid-td">{row['5월_실행']}</td>
                  <td className="grid-td">0.0</td><td className="grid-td">{row['6월_실행']}</td>
                  <td className="grid-td">0.0</td><td className="grid-td">{row['7월_실행']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
      <div className="text-right text-xs mt-1 text-gray-500">(단위: 백만원)</div>
    </div>
  );
}
