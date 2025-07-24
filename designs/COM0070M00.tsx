'use client';

import React from 'react';
import './common.css';

export default function Page() {
  const menuItems = [
    { label: '메뉴', icon: '/icon_menu.svg' },
    { label: '사업관리', icon: '/icon_business.svg' },
    { label: '프로젝트', icon: '/icon_project.svg' },
    { label: '추진비', icon: '/icon_cost.svg' },
    { label: '인사관리', icon: '/icon_hr.svg' },
    { label: '시스템', icon: '/icon_system.svg' },
  ];

  return (
    <div className="w-20 h-full flex flex-col bg-[#EFF8FF] border-r border-slate-200">
      {/* 상단 메뉴들 */}
      <div className="flex flex-col items-center gap-6 pt-6">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82C4] rounded-sm"
          >
            <img
              src={item.icon}
              alt={`${item.label} 아이콘`}
              className="w-6 h-6 transition-transform duration-200 transform group-hover:scale-110 group-focus:scale-110"
            />
            <span className="text-[11px] font-nanum text-[#3B82C4] text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* 하단 로그아웃 */}
      <div className="mt-auto flex flex-col items-center gap-1 pb-6">
        <button className="flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82C4] rounded-sm">
          <img
            src="/icon_logout.svg"
            alt="로그아웃 아이콘"
            className="w-6 h-6 transition-transform duration-200 transform group-hover:scale-110 group-focus:scale-110"
          />
          <span className="text-[11px] font-nanum text-[#3B82C4] text-center">
            로그아웃
          </span>
        </button>
      </div>
    </div>
  );
}
