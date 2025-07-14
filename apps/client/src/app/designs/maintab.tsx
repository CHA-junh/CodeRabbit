'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  title: string;
}

export default function TabFrame() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: '사원관리' },
    { id: '2', title: '개인정보수정' },
    { id: '3', title: '프로파일관리' },
  ]);
  const [activeTab, setActiveTab] = useState<string>('2');

  const closeTab = (id: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (id === activeTab && tabs.length > 1) {
      const nextTab = tabs.find((t) => t.id !== id);
      setActiveTab(nextTab?.id || '');
    }
  };

  return (
    <div className="flex items-center h-10 px-2 overflow-x-auto bg-white scrollbar-thin scrollbar-thumb-[#cbd5e1] scrollbar-track-transparent">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <div
            key={tab.id}
            className={`flex items-center px-3 h-8 mx-1 rounded-md cursor-pointer shrink-0
              ${isActive ? 'bg-[#0057B8]' : 'bg-[#F0F7FF]'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span
              className={`text-sm font-nanum m-2 ${
                isActive ? 'text-white' : 'text-[#798EA2]'
              }`}
            >
              {tab.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className={`ml-1 w-5 h-5 flex items-center justify-center text-lg
                ${isActive ? 'text-white hover:text-slate-100' : 'text-[#798EA2] hover:text-[#4B6A88]'}`}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
