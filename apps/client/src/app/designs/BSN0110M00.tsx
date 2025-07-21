'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BSN0120M00 from './BSN0120M00';
import BSN0120D00 from './BSN0120D00';
import BSN0120E00 from './BSN0120E00';
import BSN0120F00 from './BSN0120F00';
import BSN0120G00 from './BSN0120G00';
import './common.css';

export default function BSN0110M00() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'BSN0120M00'; // 기본 탭 설정

  const tabs = [
    { label: '제품(재료비)', value: 'BSN0120M00' },
    { label: '직접인건비', value: 'BSN0120D00' },
    { label: '직접경비', value: 'BSN0120E00' },
    { label: '품의서이력조회', value: 'BSN0120F00' },
    { label: '월별투입비용조회', value: 'BSN0120G00' },
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
      case 'BSN0120D00':
        return <BSN0120D00 />;
      case 'BSN0120E00':
        return <BSN0120E00 />;
      case 'BSN0120F00':
        return <BSN0120F00 />;
      case 'BSN0120G00':
        return <BSN0120G00 />;
      default:
        return <BSN0120M00 />;
    }
  };

  return (
    <div className="mdi">
      {/* 🧩 탭 UI */}
      <div className="tab-container">
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

      <div className="tab-panel">
        {renderTabContent()}
      </div>
    </div>
  );
}
