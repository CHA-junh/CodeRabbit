'use client';

import React, { useState } from 'react';
import './common.css';
import PRJ0170M00 from './PRJ0170M00';
import PRJ0180M00 from './PRJ0180M00';

export default function PRJ0160M00() {
  const tabs = [
    { name: '사업확정품의서조회', component: <PRJ0170M00 /> },
    { name: '계획대비실적(원가)등록', component: <PRJ0180M00 /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="mdi h-full flex flex-col">
      {/* 🔷 메인탭 영역 */}
      <div className="tab-container">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`tab-button ${activeTab === tab.name ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 📄 탭 내용 */}
      <div className="tab-panel flex-1 min-h-0 overflow-auto">
        {tabs.find((tab) => tab.name === activeTab)?.component}
      </div>
    </div>
  );
}
