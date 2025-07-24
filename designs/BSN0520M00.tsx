'use client';

import React from 'react';
import './common.css';

export default function BSN0520M00() {
  return (
    <div className="flex flex-col h-full">
      {/* 타이틀 + 엑셀 버튼 */}
      <div className="tit_area flex items-center justify-between">
        <h3>2025/07 실적보고 (전체)</h3>
        <div className="flex gap-2">
          <button className="btn-base btn-excel">실적보고서</button>
          <button className="btn-base btn-excel">사업별추정실적</button>
          <button className="btn-base btn-excel">사업별사업실적</button>
          <button className="btn-base btn-excel">가동실적</button>
        </div>
      </div>

      {/* 그리드 테이블 */}
      <div className="gridbox-div">
        <div className="grid-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th" rowSpan={2}>구분</th>
                <th className="grid-th" colSpan={3}>07월</th>
                <th className="grid-th" colSpan={3}>누계</th>
                <th className="grid-th" colSpan={3}>년간</th>
                <th className="grid-th" colSpan={2}>익월예상</th>
                <th className="grid-th" rowSpan={2}>비고</th>
              </tr>
              <tr>
                <th className="grid-th">계획</th>
                <th className="grid-th">실적</th>
                <th className="grid-th">달성률</th>
                <th className="grid-th">계획</th>
                <th className="grid-th">실적</th>
                <th className="grid-th">달성률</th>
                <th className="grid-th">계획</th>
                <th className="grid-th">실적</th>
                <th className="grid-th">달성률</th>
                <th className="grid-th">계획</th>
                <th className="grid-th">예상</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['수주', '0.0', '0.0', '0', '0.0', '0.0', '0', '0.0', '0.0', '0', '0.0', '0.0', '0.0'],
                ['매 출', '0.0', '0.0', '0.0', '0.0', '11,331.5', '0.0', '0.0', '0.0', '0.0', '0.0', '59.7', ''],
                ['재료/외주비', '0.0', '0.0', '0.0', '0.0', '4,103.3', '0.0', '0.0', '0.0', '0.0', '0.0', '30.8', ''],
                ['부 가 가 치', '0.0', '0.0', '0.0', '0.0', '7,228.2', '0.0', '0.0', '0.0', '0.0', '0.0', '28.9', ''],
                ['인 원', '0.0', '164.0', '0.0', '0.0', '1,176.0', '0.0', '0.0', '0.0', '0.0', '0.0', '163.0', ''],
                ['인당부가가치', '0.0', '0.0', '0.0', '0.0', '6.1', '0.0', '0.0', '0.0', '0.0', '0.0', '0.2', ''],
              ].map((row, idx) => (
                <tr key={idx} className="grid-tr">
                  {row.map((cell, i) => (
                    <td key={i} className={`grid-td ${row[0] === '매 출' || row[0] === '부 가 가 치' ? 'text-red-600 font-bold' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
      <div className="mt-1 text-right text-xs text-gray-500">(단위: 백만원, %)</div>
    </div>
  );
}
