'use client';

import React, { useState } from 'react';
import './common.css';
import BSN0520M00 from './BSN0520M00';
import BSN0530M00 from './BSN0530M00';

export default function BSN0510M00() {
  const tabs = [
    { label: '사업(추정)실적보고', component: <BSN0520M00 /> },
    { label: '월별계획대비실적', component: <BSN0530M00 /> },
  ];

  const [tabIndex, setTabIndex] = useState(0);
  const selectedTab = tabs[tabIndex] ?? null;

  return (
    <div className="mdi flex flex-col h-full">
      {/* 🔍 조회 조건 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr>
              <th className="search-th w-[120px]">조회기준년월</th>
              <td className="search-td w-[160px]">
                <input type="month" className="input-base input-calender w-full" defaultValue="2025-07" />
              </td>

              <th className="search-th w-[80px]">구분</th>
              <td className="search-td w-[150px]">
                <label className="mr-2">
                  <input type="radio" name="gubun" defaultChecked /> 총괄집계
                </label>
                <label>
                  <input type="radio" name="gubun" /> 부서별
                </label>
              </td>

              <th className="search-th w-[80px]">본부</th>
              <td className="search-td w-[150px]">
                <div className="flex gap-1">
                  <select className="input-base combo-base w-[120px]">
                    <option>영업본부</option>
                  </select>
                </div>
              </td>

              <th className="search-th w-[80px]">부서</th>
              <td className="search-td w-[150px]">
                <div className="flex gap-1">
                  <select className="input-base combo-base w-[120px]">
                    <option>선택</option>
                  </select>
                </div>
              </td>

              <td className="search-td">
                <label className="flex items-center gap-1">
                  <input type="checkbox" />
                  1월추정
                </label>
              </td>

              <td className="search-td text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🔽 서브탭 영역 */}
      <div className="sub-tab-container flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* 서브탭 리스트 */}
        <div className="sub-tab-list">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`sub-tab-button ${tabIndex === idx ? 'sub-tab-active' : ''}`}
              onClick={() => setTabIndex(idx)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 서브탭 콘텐츠 */}
        <div className="sub-tab-panel flex-1 overflow-auto">
          {selectedTab && selectedTab.component}
        </div>
      </div>
    </div>
  );
}
