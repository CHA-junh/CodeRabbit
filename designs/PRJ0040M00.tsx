'use client';

import React, { useState } from 'react';
import './common.css';

import PRJ0100M00 from './PRJ0100M00';
import PRJ0050M00 from './PRJ0050M00';
import PRJ0070M00 from './PRJ0070M00';
import PRJ0080M00 from './PRJ0080M00';

export default function PRJ0040M00() {
  const [activeTab, setActiveTab] = useState('인력현황');
  const tabs = ['투입인력계획등록', '월별인력운영계획출력','실투입인력등록','투입확인서출력','월별투입비용조회'];

  return (
    <div className="mdi flex flex-col h-full overflow-hidden">
      {/* 🔹 타이틀 */}
      <div className="tit_area">
        <h3>투입인력관리</h3>
      </div>

      {/* 🔍 조회 조건 */}
      <div className="search-div mb-4 relative">
        <table className="search-table">
          <tbody>
            <tr>
              <th className="search-th w-[100px]">사업번호</th>
              <td className="search-td w-[280px]">
                <div className="flex gap-1">
                  <input type="text" className="input-base input-default flex-1" />
                  <button className="icon_btn icon_search w-[30px] min-w-[30px]" />
                </div>
              </td>
              <th className="search-th w-[80px]">사업명</th>
              <td className="search-td w-[400px]">
                <div className="flex gap-1">
                  <input type="text" className="input-base input-default flex-1" />
                  <button className="icon_btn icon_search w-[30px] min-w-[30px]" />
                </div>
              </td>
              <th className="search-th w-[80px]">사업기간</th>
              <td className="search-td w-[320px]">
                <div className="flex items-center gap-1">
                  <input type="date" className="input-base input-calender w-[130px]" />
                  <span className="m-1">~</span>
                  <input type="date" className="input-base input-calender w-[130px]" />
                </div>
              </td>
              <td></td>
            </tr>
            <tr>
              <th className="search-th">계획/실적</th>
              <td className="search-td">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default w-[80px]" />
                  <span className="m-1">/</span>
                  <input type="text" className="input-base input-default w-[80px]" />
                  <span className="m-1">M/M</span>
                </div>
              </td>
              <th className="search-th">사업부서/영업대표</th>
              <td className="search-td">
                <div className="flex gap-1">
                  <input type="text" className="input-base input-default w-[150px]" />
                  <input type="text" className="input-base input-default w-[100px]" />
                </div>
              </td>
              <th className="search-th">실행부서/PM</th>
              <td className="search-td">
                <div className="flex gap-1">
                  <input type="text" className="input-base input-default w-[150px]" />
                  <input type="text" className="input-base input-default w-[100px]" />
                </div>
              </td>
              <td>
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🔸 서브 탭 영역 */}
      <div className="sub-tab-container flex-1 min-h-0 flex flex-col">
        <div className="sub-tab-list">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sub-tab-button ${activeTab === tab ? 'sub-tab-active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="sub-tab-panel flex-1 min-h-0 overflow-y-auto">
          {activeTab === '투입인력계획등록' && (
            <PRJ0050M00 />
          )}
          {activeTab === '월별인력운영계획출력' && (
            <PRJ0100M00 />
          )}
          {activeTab === '실투입인력등록' && (
            <PRJ0070M00 />
          )}
          {activeTab === '투입확인서출력' && (
            <PRJ0080M00 />
          )}
          {activeTab === '월별투입비용조회' && (
            <div>콘텐츠</div>
          )}
        </div>
      </div>
    </div>
  );
}
