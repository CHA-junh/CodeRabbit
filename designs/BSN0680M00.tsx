'use client';

import React, { useState } from 'react';
import './common.css';
import BSN0681M00 from './BSN0681M00';
import BSN0682M00 from './BSN0682M00';

export default function BSN0680M00() {
  const [activeTab, setActiveTab] = useState('월별 투입/철수 현황');
  const tabs = ['월별 투입/철수 현황', '투입/철수 인원 리스트'];

  return (
    <div className="mdi flex flex-col h-full overflow-hidden">
      {/* 🔍 조회 조건 */}
      <div className="search-div mb-4">
        <table className="search-table">
          <tbody>
            {/* ▶ 1행 */}
            <tr>
              <th className="search-th w-[120px]">자사/외주구분</th>
              <td className="search-td w-[350px]">
                <label className="mr-2"><input type="radio" name="type" /> 자사</label>
                <label className="mr-2"><input type="radio" name="type" /> 외주</label>
                <label className="mr-2"><input type="radio" name="type" /> 전체</label>
              </td>

              <th className="search-th w-[100px]">조회구분</th>
              <td className="search-td w-[150px]">
                <select className="input-base w-full">
                  <option>본부</option>
                </select>
              </td>

              <th className="search-th w-[100px]">사업구분</th>
              <td className="search-td w-[250px]" colSpan={3}>
                <label className="mr-2"><input type="radio" name="biz" /> 전체</label>
                <label className="mr-2"><input type="radio" name="biz" /> SI</label>
                <label className="mr-2"><input type="radio" name="biz" /> SM/유지보수</label>
                <label className="mr-2"><input type="radio" name="biz" /> 연구개발</label>
              </td>
            </tr>

            {/* ▶ 2행 */}
            <tr>
              <th className="search-th">투입일자</th>
              <td className="search-td">
                <input type="date" className="input-base input-calender mr-1" defaultValue="2025-01-01" />
                ~
                <input type="date" className="input-base input-calender ml-1" defaultValue="2025-12-31" />
              </td>

              <th className="search-th">본부</th>
              <td className="search-td">
                <select className="input-base w-full">
                  <option>전체</option>
                </select>
              </td>

              <th className="search-th">직책</th>
              <td className="search-td  w-[150px]">
                <select className="input-base w-full">
                  <option>전체</option>
                </select>
              </td>

              <th className="search-th  w-[80px]">등급</th>
              <td className="search-td  w-[150px]">
                <select className="input-base w-full">
                  <option>전체</option>
                </select>
              </td>
              <td></td>
              {/* ▶ 조회 버튼 (우측 정렬) */}
              <td className="search-td text-right" >
                {/* <button className="btn-base btn-search">조회</button> */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>




      {/* 📑 서브 탭 */}
      <div className="sub-tab-container flex-1 flex flex-col min-h-0">
        {/* 탭 버튼 */}
        <div className="sub-tab-list">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`sub-tab-button ${activeTab === tab ? 'sub-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="sub-tab-panel">
          {activeTab === '월별 투입/철수 현황' && <BSN0681M00 />}
          {activeTab === '투입/철수 인원 리스트' && <BSN0682M00 />}
        </div>
      </div>
    </div>
  );
}
