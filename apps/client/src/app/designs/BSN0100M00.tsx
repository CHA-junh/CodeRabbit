'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BSN0110M00 from './BSN0110M00';
import BSN0120M00 from './BSN0120M00';
import BSN0130M00 from './BSN0130M00';
import BSN0140M00 from './BSN0140M00';
import BSN0150M00 from './BSN0150M00';
import PRJ0090M00 from './PRJ0090M00';

import './common.css';

// 사업예산 프레임

export default function BSN0100M00() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'BSN0120M00'; // 기본 탭 설정

  const tabs = [
    { label: '제품(재료비)', value: 'BSN0120M00' },
    { label: '직접인건비', value: 'BSN0130M00' },
    { label: '직접경비', value: 'BSN0140M00' },
    { label: '품의서이력조회', value: 'BSN0150M00' },
    { label: '월별투입비용조회', value: 'PRJ0090M00' },
  ];

  const handleTabChange = (value: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set('tab', value);
    router.push(`?${query.toString()}`);
  };

const renderTabContent = () => {
  switch (tab) {
    case 'BSN0120M00':
      return <BSN0120M00 />;
    case 'BSN0130M00':
      return <BSN0130M00 />;
    case 'BSN0140M00':
      return <BSN0140M00 />;
    case 'BSN0150M00':
      return <BSN0150M00 />;
    case 'PRJ0090M00':
      return <PRJ0090M00 />;
    default:
      return null;
  }
};

 return (
  <div className="mdi flex flex-col h-full">
    {/* 📌 상단 타이틀 영역 */}
<div className="shrink-0">
  <BSN0110M00 />
</div>

    {/* 🧩 탭 버튼 영역 */}
    <div className="tab-container shrink-0">
      {tabs.map(({ label, value }) => (
        <button
          key={value}
          className={`tab-button ${tab === value ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => handleTabChange(value)}
        >
          {label}
        </button>
      ))}
    </div>

    {/* 🧩 탭 콘텐츠 영역 */}
    <div className="tab-panel flex-1 overflow-auto">
      {renderTabContent()}
    </div>
  </div>
);

}
