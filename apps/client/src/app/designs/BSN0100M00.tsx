'use client';

import React, { useState } from 'react';
import './common.css';

import BSN0120M00 from './BSN0120M00';
import BSN0130M00 from './BSN0130M00';
// import BSN0120E00 from './BSN0120E00';
// import BSN0120F00 from './BSN0120F00';
// import BSN0120G00 from './BSN0120G00';

export default function BSN0100M00() {
  const tabs = [
    { label: '제품(재료비)', component: <BSN0120M00 /> },
    { label: '직접인건비', component: <BSN0130M00 /> },
    // { label: '직접경비', component: <BSN0120E00 /> },
    // { label: '품의서이력조회', component: <BSN0120F00 /> },
    // { label: '월별투입비용조회', component: <BSN0120G00 /> },
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className="mdi">
      {/* 🔷 타이틀 + 버튼 영역 */}
      <div className="tit_area mb-3">
        <h3>사업확정품의서 작성</h3>
        <div className="flex gap-2">
          <button className="btn-base btn-etc">품의서출력</button>
          <button className="btn-base btn-etc">확정매출파일등록</button>
          <button className="btn-base btn-etc">계약등록</button>
          <button className="btn-base btn-etc">사업정보수정</button>
        </div>
      </div>

      {/* 🔍 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[100px]">사업번호</th>
              <td className="search-td w-[200px]">
                <div className="flex gap-1 items-center">
                  <input className="input-base input-default w-full" />
                  <button className="icon_btn icon_search" />
                </div>
              </td>
              <th className="search-th w-[100px]">사업명</th>
              <td className="search-td">
                <div className="flex gap-1 items-center">
                  <input className="input-base input-default w-full" />
                  <button className="icon_btn icon_search" />
                </div>
              </td>
              <th className="search-th w-[100px]">사업기간</th>
              <td className="search-td">
                <div className="flex gap-2 items-center">
                  <input type="date" className="input-base input-calender" />
                  <span className="m-1">~</span>
                  <input type="date" className="input-base input-calender" />
                </div>
              </td>
            </tr>
            <tr className="search-tr">
              <th className="search-th">진행단계</th>
              <td className="search-td"><input className="input-base input-default w-full" /></td>
              <th className="search-th">사업부서</th>
              <td className="search-td"><input className="input-base input-default w-full" /></td>
              <th className="search-th">영업대표</th>
              <td className="search-td"><input className="input-base input-default w-full" /></td>
              <th className="search-th">실행부서 / PM</th>
              <td className="search-td">
                <div className="flex gap-1">
                  <input className="input-base input-default w-full" placeholder="실행부서" />
                  <input className="input-base input-default w-full" placeholder="PM" />
                </div>
              </td>
              <td className="search-td text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📋 수주금액 및 공수 입력 */}
      <table className="form-table mb-2">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[100px]">수주금액</th>
            <td className="form-td w-[250px]">
              <input className="input-base input-default w-full" />
            </td>
            <th className="form-th w-[130px]">공수(자사/외주)</th>
            <td className="form-td">
              <div className="flex gap-2">
                <input className="input-base input-default w-[60px]" placeholder="자사(M/M)" />
                <input className="input-base input-default w-[60px]" placeholder="외주(M/M)" />
                <input className="input-base input-default w-[60px]" placeholder="합계(M/M)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end gap-2 mb-4">
        <button className="btn-base btn-etc">재계약</button>
        <button className="btn-base btn-act">최종등록</button>
        <button className="btn-base btn-act">저장</button>
      </div>

      {/* 📊 원가 / 공급가 테이블 */}
      <div className="gridbox-div mb-2">
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
              <td className="grid-td text-right">27,000,000</td>
              <td className="grid-td text-right">187,700,000</td>
              <td className="grid-td text-right">0</td>
              <td className="grid-td text-right">187,700,000</td>
              <td className="grid-td text-right">5,048,500</td>
              <td className="grid-td text-right">219,748,500</td>
              <td className="grid-td text-right text-red-500">29,751,500<br /><span className="text-sm">(11.92%)</span></td>
              <td className="grid-td text-right text-red-500">222,500,000<br /><span className="text-sm">(89.18%)</span></td>
            </tr>
            <tr>
              <td className="grid-td font-semibold">공급가</td>
              <td className="grid-td text-right">28,500,000</td>
              <td className="grid-td text-right">221,000,000</td>
              <td className="grid-td text-right">0</td>
              <td className="grid-td text-right">221,000,000</td>
              <td className="grid-td"></td>
              <td className="grid-td"></td>
              <td className="grid-td"></td>
              <td className="grid-td"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[13px] text-red-500 mb-4">
        ※ B: 재료비 원가, C: 재료비 공급가, D: 자사인건비 원가, E: 자사인건비 공급가, F: 외주인건비 원가,
        G: 외주인건비 공급가, H: 인건비원가합계, I: 인건비공급가합계
      </p>

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
