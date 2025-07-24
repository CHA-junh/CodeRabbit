'use client';

import React from 'react';
import './common.css';

export default function BSN0550M00() {
  // 예시 더미 데이터 (선택사항)
  const rows = [
    {
      영업대표: '홍길동',
      구분1: 'SI',
      구분2: 'A사업군',
      합계: '12,345',
      월: ['1,000', '2,000', '1,500', '1,200', '1,300', '1,000', '1,200', '1,100', '1,000', '1,200', '845'],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 🔷 타이틀 + 엑셀버튼 */}
      <div className="tit_area flex justify-between items-center">
        <h3>담당자별 사업실적</h3>
        <button className="btn-base btn-excel">엑셀</button>
      </div>

      {/* 📊 그리드 테이블 */}
      <div className="gridbox-div overflow-auto flex-1">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th" rowSpan={2}>영업대표</th>
              <th className="grid-th" rowSpan={2}>구분1</th>
              <th className="grid-th" rowSpan={2}>구분2</th>
              <th className="grid-th" rowSpan={2}>합계</th>
              <th className="grid-th" colSpan={11}>2025년</th>
            </tr>
            <tr>
              {Array.from({ length: 11 }, (_, i) => (
                <th className="grid-th" key={i}>{i + 1}월</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr className="grid-tr" key={idx}>
                <td className="grid-td">{row.영업대표}</td>
                <td className="grid-td">{row.구분1}</td>
                <td className="grid-td">{row.구분2}</td>
                <td className="grid-td">{row.합계}</td>
                {row.월.map((월값, i) => (
                  <td className="grid-td" key={i}>{월값}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 안내문 및 단위 */}
      <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
        <div>※ 리스트를 더블클릭하면 담당자 사업별 실적 조회 화면으로 갑니다.</div>
        <div>(단위: 천원)</div>
      </div>
    </div>
  );
}
