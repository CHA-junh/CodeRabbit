'use client';

import React, { useState } from 'react';
import './common.css';

import BSN0510M00 from './BSN0510M00';     // 사업실적조회
import BSN0520M00 from './BSN0520M00';     // 담당자별사업실적조회
import BSN0570M00 from './BSN0570M00';     // 사업계획등록

export default function BSN0500M00() {
  const tabs = [
    { label: '사업실적조회', component: <BSN0510M00 /> },
    { label: '담당자별사업실적조회', component: <BSN0520M00 /> },
    { label: '사업계획등록', component: <BSN0570M00 /> },
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mdi">
      {/* 🔷 페이지 제목 */}
      <div className="tit_area mb-3">
        <h3>사업 실적 및 계획 관리</h3>
      </div>

      {/* 🧩 탭 영역 */}
      <div className="tab-container">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`tab-button ${activeTab === idx ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📦 탭별 콘텐츠 */}
      <div className="tab-panel">
        {tabs[activeTab].component}
      </div>
    </div>
  );
}
