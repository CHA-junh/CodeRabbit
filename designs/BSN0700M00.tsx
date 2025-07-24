'use client';

import React, { useState } from 'react';
import './common.css';
import BSN0710M00 from './BSN0710M00';
import BSN0740M00 from './BSN0740M00';

export default function BSN0700M00() {
  const tabs = ['외주인력소싱', '외주투입(계약)'];
  const [activeTab, setActiveTab] = useState('외주인력소싱');

  return (
    <div className="mdi flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* ✅ 탭 영역 */}
      <div className="tab-container shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${
              activeTab === tab ? 'tab-active' : 'tab-inactive'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ✅ 탭 콘텐츠 */}
      <div className="tab-panel flex-1 min-h-0 overflow-hidden">
        {activeTab === '외주인력소싱' && <BSN0710M00 />}
        {activeTab === '외주투입(계약)' && <BSN0740M00 />}
      </div>
    </div>
  );
}
