'use client';

import React from 'react';
import './common.css';

export default function BSN0570M00() {
  return (
    <div className="flex flex-col h-full">
      {/* 🔍 조회 조건 - search-table 사용 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr>
              <th className="search-th w-[100px]">사업년도</th>
              <td className="search-td w-[150px]">
                <select className="input-base combo-base w-full">
                  <option>2025년</option>
                </select>
              </td>

              <th className="search-th w-[80px]">본부</th>
              <td className="search-td w-[150px]">
                <select className="input-base combo-base w-full">
                  <option>영업본부</option>
                </select>
              </td>

              <th className="search-th w-[80px]">부서</th>
              <td className="search-td w-[150px]">
                <select className="input-base combo-base w-full">
                  <option>전체</option>
                </select>
              </td>

              <td className="search-td text-right" colSpan={2}>
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        {/* 📊 사업계획 테이블 */}
        <div className="gridbox-div flex-1">
        <table className="grid-table">
            <thead>
            <tr>
                <th className="grid-th align-middle" rowSpan={3}>사업계획</th>
                <th className="grid-th align-middle" rowSpan={3}>구분</th>
                {Array.from({ length: 12 }, (_, i) => (
                <th key={i} className="grid-th">{i + 1}월</th>
                ))}
                <th className="grid-th">합계</th>
                <th className="grid-th">월평균</th>
            </tr>
            </thead>
            <tbody>
            {/* 서비스/개발 */}
            <tr>
                <th className="grid-th bg-[#f0f5fa]" rowSpan={8}>서비스/개발</th>
                <th className="grid-th" rowSpan={2}>SM부문</th>
                {Array(12).fill(<td className="grid-td">0.0</td>)}
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
            </tr>
            <tr>
                {Array(12).fill(<td className="grid-td">0.0</td>)}
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
            </tr>
            <tr>
                <th className="grid-th" rowSpan={2}>SI부문</th>
                {Array(12).fill(<td className="grid-td">0.0</td>)}
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
            </tr>
            <tr>
                {Array(12).fill(<td className="grid-td">0.0</td>)}
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
            </tr>
            <tr>
                <th className="grid-th" rowSpan={2}>SE부문</th>
                {Array(12).fill(<td className="grid-td">0.0</td>)}
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
            </tr>
            <tr>
                {Array(12).fill(<td className="grid-td">0.0</td>)}
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
            </tr>
            <tr className="bg-[#f8fafc] font-semibold">
                <th className="grid-th" rowSpan={2}>소계</th>
                {Array(12).fill(<td className="grid-td">0</td>)}
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
            </tr>
            <tr className="bg-[#f8fafc] font-semibold">
                {Array(12).fill(<td className="grid-td">0</td>)}
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
            </tr>

            {/* 아래에 인프라서비스, 영업, 종합계 등 같은 방식으로 추가 가능 */}
            </tbody>
        </table>
        </div>


      {/* 📌 업무추진비 한도 */}
      <div className="gridbox-div mt-4">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th w-[120px]">업무추진비 한도</th>
              {Array.from({ length: 12 }, (_, i) => (
                <th key={i} className="grid-th">{i + 1}월</th>
              ))}
              <th className="grid-th">합계</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="grid-td">부서A</td>
              {Array.from({ length: 12 }, (_, i) => (
                <td key={i} className="grid-td">0</td>
              ))}
              <td className="grid-td">0</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 하단 단위 표기 */}
      <div className="text-right text-[12px] text-gray-500 mt-1">(단위: 백만원)</div>
    </div>
  );
}
