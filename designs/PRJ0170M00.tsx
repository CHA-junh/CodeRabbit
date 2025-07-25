'use client';

import React, { useState } from 'react';
import './common.css';
import BSN0120M00 from './BSN/BSN0120M00';
import BSN0130M00 from './BSN/BSN0130M00';
import BSN0140M00 from './BSN/BSN0140M00';
      {/* 로컬작업이라 경로가 달라 경로 바꿔주어야합니다 */}

export default function PRJ0170M00() {
  const [activeTab, setActiveTab] = useState('제품(재료비)');
  const tabs = ['제품(재료비)', '직접인건비', '직접경비'];

  const renderTab = () => {
    switch (activeTab) {
      case '제품(재료비)': return <BSN0120M00 />;
      case '직접인건비': return <BSN0130M00 />;
      case '직접경비': return <BSN0140M00 />;
      default: return null;
    }
  };

  return (
    <div className="mdi flex flex-col h-full overflow-hidden">
      {/* 🔷 타이틀 */}
      <div className="tit_area flex items-center justify-between">
        <h3>사업확정품의서 조회</h3>
        <div className="flex gap-2">
            <button className="btn-base btn-excel">품의서출력</button>
        </div>
      </div>

      {/* 🔍 조회 영역 */}
      <div className="search-div">
        <table className="search-table w-full">
          <tbody>
            <tr>
              <th className="search-th w-[110px]">사업번호</th>
              <td className="search-td w-[20%]">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default w-full" />
                  <button className="icon_btn icon_search" />
                </div>
              </td>
              <th className="search-th w-[110px]">사업명</th>
              <td className="search-td w-[20%]">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default w-full" />
                  <button className="icon_btn icon_search" />
                </div>
              </td>
              <th className="search-th w-[110px]">사업기간</th>
              <td className="search-td w-[25%]">
                <div className="flex items-center gap-1">
                  <input type="date" className="input-base input-default w-full" />
                  <span>~</span>
                  <input type="date" className="input-base input-default w-full" />
                </div>
              </td>
            </tr>
            <tr>
              <th className="search-th">수주금액 (A)</th>
              <td className="search-td">
                <input type="text" className="input-base input-default !w-[90%]" /> 원
              </td>
              <th className="search-th">사업부서 / 영업대표</th>
              <td className="search-td">
                <input type="text" className="input-base input-default w-[90%]" />
              </td>
              <th className="search-th">실행부서 / PM</th>
              <td className="search-td">
                <input type="text" className="input-base input-default w-[90%]" />
              </td>
              <td className="search-td flex justify-end">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📄 form-table 첫 번째 */}
      <table className="form-table mt-4">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[120px]">수주금액(A)</th>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <th className="form-th w-[120px]">공수(자사/외주)</th>
            <td className="form-td" colSpan={3}>
              <div className="flex gap-1">
                <input type="text" className="input-base input-default w-[60px]" />
                <input type="text" className="input-base input-default w-[60px]" />
                <input type="text" className="input-base input-default w-[60px]" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        {/* 📄 form-table 두 번째 */}
        <table className="form-table mt-4">
        <thead>
            <tr>
            <th className="form-th w-[10%]" rowSpan={2}>구분</th>
            <th className="form-th w-[15%] !text-center" colSpan={2}>재료비<br />(B,C)</th>
            <th className="form-th w-[15%] !text-center" colSpan={2}>직접인건비</th>
            <th className="form-th w-[10%] !text-center" rowSpan={2}>직접경비<br />(J)</th>
            <th className="form-th w-[15%] !text-center" rowSpan={2}>총원가<br />(K=B+H+J)</th>
            <th className="form-th w-[10%] !text-center" rowSpan={2}>정상이익<br />(A-K)</th>
            <th className="form-th w-[10%] !text-center" rowSpan={2}>부가가치<br />(A-B-F)</th>
            </tr>
            <tr>
            <th className="form-th !text-center">자사(D,E)</th>
            <th className="form-th !text-center">외주(F,G)</th>
            <th className="form-th !text-center" colSpan={2}>합계(H,I)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <th className="form-th ">원가</th>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td" colSpan={2}><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            </tr>
            <tr>
            <th className="form-th">공급가</th>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td" colSpan={2}><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            </tr>
        </tbody>
        </table>

        {/* 안내문 텍스트 */}
        <p className="mt-2 text-sm text-gray-600 mb-4">
        ※ <span className="text-blue-500 text-base">B:재료비 원가</span>, C:재료비 공급가, D:자사인건비 원가, E:자사인건비 공급가, F:외주인건비 원가, G:외주인건비 공급가, H:인건비원가합계, I:인건비공급가합계
        </p>


      {/* 🧩 서브탭 */}
      <div className="sub-tab-container flex-1 min-h-0 mt-4 flex flex-col overflow-hidden">
        <div className="sub-tab-list">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`sub-tab-button ${activeTab === tab ? 'sub-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="sub-tab-panel flex-1 min-h-0 overflow-auto bg-white">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
