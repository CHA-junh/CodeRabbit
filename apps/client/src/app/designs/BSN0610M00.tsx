'use client';

import React, { useState } from 'react';
import './common.css';

import BSN0620M00 from './BSN0620M00';
import BSN0630M00 from './BSN0630M00';
import BSN0640M00 from './BSN0640M00';

export default function BSN0610M00() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['인원별 조회', '직책별 조회', '등급별 조회'];

  return (
    <div className="mdi flex flex-col h-full">
      {/* 🔍 조회 조건부 */}
      <div className="search-div mb-0">
        <table className="search-table">
          <tbody>
            <tr>
              <th className="search-th w-[110px]">조회기준년월</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>2025/07</option>
                </select>
              </td>

              <th className="search-th w-[80px]">구분1</th>
              <td className="search-td w-[120px]">
                <div className="flex gap-2">
                  <label className="radio-base"><input type="radio" name="gubun1" defaultChecked /> 자사</label>
                  <label className="radio-base"><input type="radio" name="gubun1" /> 외주</label>
                  <label className="radio-base"><input type="radio" name="gubun1" /> 자사+외주</label>
                </div>
              </td>

              <th className="search-th w-[80px]">구분2</th>
              <td className="search-td w-[120px]">
                <div className="flex gap-2">
                  <label className="radio-base"><input type="radio" name="gubun2" defaultChecked /> 개발인원만</label>
                  <label className="radio-base"><input type="radio" name="gubun2" /> 전체</label>
                </div>
              </td>

              <th className="search-th w-[80px]">본부</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>전체</option>
                </select>
              </td>
                <td></td>
              <td className="search-td w-[80px] text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🧷 탭 영역 - sub-tab-container 기반 */}
      <div className="sub-tab-container mt-4">
        <div className="sub-tab-list">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={`sub-tab-button ${activeTab === i ? 'sub-tab-active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="sub-tab-panel">
          {activeTab === 0 && <BSN0620M00 />}
          {activeTab === 1 && <BSN0630M00 />}
          {activeTab === 2 && <BSN0640M00 />}
        </div>
      </div>
    </div>
  );
}
