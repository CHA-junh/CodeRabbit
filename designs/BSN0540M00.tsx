'use client';

import React, { useState } from 'react';
import './common.css';
import BSN0550M00 from './BSN0550M00';
import BSN0560M00 from './BSN0560M00';

export default function BSN0540M00() {
  const tabs = [
    { label: '담당자별 사업실적조회', component: <BSN0550M00 /> },
    { label: '담당자별 사업구분별 실적조회', component: <BSN0560M00 /> },
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
              <th className="search-th w-[110px]">조회기준년월</th>
              <td className="search-td w-[130px]">
                <input type="month" className="input-base input-calender w-full" defaultValue="2025-07" />
              </td>

              <td className="search-td w-[110px]">
                <label className="flex items-center gap-1">
                  <input type="checkbox" disabled />
                  1월추정
                </label>
              </td>

              <th className="search-th w-[80px]">사업구분</th>
              <td className="search-td w-[250px]">
                <div className="flex gap-2 items-center">
                  <label><input type="radio" name="bizType" defaultChecked /> 전체</label>
                  <label><input type="radio" name="bizType" /> SI</label>
                  <label><input type="radio" name="bizType" /> SM</label>
                </div>
              </td>

              <th className="search-th w-[60px]">본부</th>
              <td className="search-td w-[140px]">
                <select className="input-base combo-base w-full">
                  <option>영업본부</option>
                </select>
              </td>

              <th className="search-th w-[60px]">부서</th>
              <td className="search-td w-[140px]">
                <select className="input-base combo-base w-full">
                  <option>선택</option>
                </select>
              </td>

              <th className="search-th w-[60px]">담당자</th>
              <td className="search-td w-[120px]">
                <input type="text" className="input-base input-default w-full" placeholder="담당자" />
              </td>

              <td className="search-td w-[100px] text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🧩 서브탭 영역 */}
      <div className="sub-tab-container flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* 서브탭 버튼 */}
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
