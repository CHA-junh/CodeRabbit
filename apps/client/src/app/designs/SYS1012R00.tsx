'use client';

import React, { useState } from 'react';
import PageTitle from './PageTitle';
import MenuTree from './menu'; // 실제 컴포넌트 경로에 맞게 수정 필요
import './common.css';

export default function RoleManagementPage() {

  const [selectedTab, setSelectedTab] = useState({ title: '', programId: '' });

  return (
    <div className="popup-wrapper">
      
            <div className="popup-header">
        <span className="popup-title">팝업 타이틀</span>
        <button className="popup-close" type="button">×</button>
      </div>

      <div className="popup-body">
              {/* 🔹 메뉴트리 패널 */}
      <div className="w-[300px] bg-[#e5e5e5] shrink-0 overflow-y-auto border-r border-stone-300">
        <MenuTree onSelectTab={(title, programId) => setSelectedTab({ title, programId })} />
      </div>
      </div>
    </div>
  );
}
