'use client';

import React, { useState } from 'react';
import './common.css';

import BSN0120M00 from './BSN0120M00';
import BSN0130M00 from './BSN0130M00';
import BSN0140M00 from './BSN0140M00';
import BSN0150M00 from './BSN0150M00';

export default function BSN0110M00() {
  const tabs = [
    { label: '제품(재료비)', component: <BSN0120M00 /> },
    { label: '직접인건비', component: <BSN0130M00 /> },
    { label: '직접경비', component: <BSN0140M00 /> },
    { label: '품의서이력조회', component: <BSN0150M00 /> },
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className="mdi">
      {/* 🔷 타이틀 + 버튼 */}
      <div className="tit_area">
        <h3>
          사업예산품의서 작성
          <span className="ml-2 text-blue-500 text-[14px] font-normal">
            수주확정된 사업은 작성(수정) 불가능합니다.
          </span>
        </h3>
        <div className="flex gap-2 ml-auto">
          <button className="btn-base btn-etc">품의서출력</button>
          <button className="btn-base btn-etc">예상매출파일등록</button>
          <button className="btn-base btn-etc">예상공수등록</button>
          <button className="btn-base btn-etc">사업정보수정</button>
        </div>
      </div>

      {/* 🔍 조회 조건 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[100px]">사업번호</th>
              <td className="search-td w-[160px]">
                <div className="flex items-center gap-1">
                  <input className="input-base input-default w-full" />
                  <button className="icon_btn icon_search" />
                </div>
              </td>
              <th className="search-th w-[100px]">사업명</th>
              <td className="search-td w-[25%]" colSpan={3}>
                <input className="input-base input-default w-full" />
              </td>
              <th className="search-th w-[100px]">사업기간</th>
              <td className="search-td w-[250px]">
                <div className="flex items-center gap-2">
                  <input type="date" className="input-base input-calender" />
                  <span>~</span>
                  <input type="date" className="input-base input-calender" />
                </div>
              </td>
              <td className="search-td w-[80px]" />
            </tr>
            <tr className="search-tr">
              <th className="search-th">진행단계</th>
              <td className="search-td">
                <input className="input-base input-default w-full" />
              </td>
              <th className="search-th">사업부서 / 영업대표</th>
              <td className="search-td">
                <input className="input-base input-default w-full" />
              </td>
              <th className="search-th">실행부서 / PM</th>
              <td className="search-td">
                <input className="input-base input-default w-full" />
              </td>
              <td colSpan={2}></td>
              <td className="search-td text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 💰 수주금액 및 공수 입력 */}
      <table className="form-table mb-3">
        <tbody>
          <tr>
            <th className="form-th w-[120px]">수주금액(A)</th>
            <td className="form-td w-[180px]">
              <input className="input-base input-default w-full text-right" />
            </td>
            <td className="form-td w-[150px]">
              <input className="input-base input-default w-full text-right" />
            </td>
            <th className="form-th w-[160px]">공수(자사/외주)</th>
            <td className="form-td">
              <div className="flex gap-2 items-center">
                <input className="input-base input-default !w-[80px]" />
                <span className="m-1">M/M</span>
                <input className="input-base input-default !w-[80px]" />
                <span className="m-1">M/M</span>
                <input className="input-base input-default !w-[80px]" />
                <span className="m-1">M/M</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 📊 요약 테이블 */}
      <div className="gridbox-div mb-4">
        <table className="grid-table text-center">
          <thead>
            <tr>
              <th className="grid-th" rowSpan={2}>구분</th>
              <th className="grid-th" rowSpan={2}>재료비<br /><span className="text-xs">(B,C)</span></th>
              <th className="grid-th" colSpan={3}>직접인건비</th>
              <th className="grid-th" rowSpan={2}>직접경비<br /><span className="text-xs">(J)</span></th>
              <th className="grid-th" rowSpan={2}>총원가<br /><span className="text-xs">(K=B+H+J)</span></th>
              <th className="grid-th" rowSpan={2}>경상이익<br /><span className="text-xs">(A-K)</span></th>
              <th className="grid-th" rowSpan={2}>부가가치<br /><span className="text-xs">(A-B-F)</span></th>
            </tr>
            <tr>
              <th className="grid-th">자사(D,E)</th>
              <th className="grid-th">외주(F,G)</th>
              <th className="grid-th">합계(H,I)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="grid-td font-semibold">원가</td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
            </tr>
            <tr>
              <td className="grid-td font-semibold">공급가</td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td"><input className="input-base input-default text-right w-full" /></td>
              <td className="grid-td" colSpan={4}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🧩 탭 영역 */}
      <div className="tab-container">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`tab-button ${selectedTab.label === tab.label ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-panel">
        {selectedTab.component}
      </div>
    </div>
  );
}
