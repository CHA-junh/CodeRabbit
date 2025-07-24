'use client';

import React from 'react';
import './common.css';

export default function BSN0560M00() {
  // 예시 더미 데이터 (필요 시 제거 가능)
  const rows = [
    {
      구분: 'SI',
      사업명: 'A시스템 구축',
      구분1: '소계',
      합계: '9,800',
      월: ['1,000', '900', '1,200', '1,300', '1,400', '1,200', '1,000', '900', '900'],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 🔷 타이틀 + 엑셀 버튼 */}
      <div className="tit_area flex justify-between items-center">
        <h3>담당자 사업별 실적</h3>
        <div className="flex gap-2">
            <button className="btn-base btn-excel">담당자/사업별추정실적</button>
            <button className="btn-base btn-excel">엑셀</button>
        </div>
      </div>

      {/* 📊 그리드 테이블 */}
      <div className="gridbox-div overflow-auto flex-1">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th" rowSpan={2}>구분</th>
              <th className="grid-th" rowSpan={2}>사업명</th>
              <th className="grid-th" rowSpan={2}>구분1</th>
              <th className="grid-th" rowSpan={2}>합계</th>
              <th className="grid-th" colSpan={9}>2025년</th>
            </tr>
            <tr>
              {Array.from({ length: 9 }, (_, i) => (
                <th className="grid-th" key={i}>{i + 1}월</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={13} className="grid-td text-center text-gray-400 py-10">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="grid-td">{row.구분}</td>
                  <td className="grid-td">{row.사업명}</td>
                  <td className="grid-td">{row.구분1}</td>
                  <td className="grid-td">{row.합계}</td>
                  {row.월.map((월값, i) => (
                    <td className="grid-td" key={i}>{월값}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 하단 단위 표기 */}
      <div className="text-right text-[12px] mt-1 text-gray-500">
        (단위: 천원)
      </div>
    </div>
  );
}
