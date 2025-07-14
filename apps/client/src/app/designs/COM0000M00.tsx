'use client';

import React, { useState } from 'react';
import MenuTree from './menu';
import COM0070M00 from './COM0070M00'; // 좌측 아이콘바
import COM0010M00 from './COM0010M00'; // 상단 헤더
import Maintab from './maintab';       // 탭 프레임
import ContentFrame from './SYS1000M00'; // 콘텐츠 프레임
import PageTitle from './PageTitle';    // ✅ 타이틀 컴포넌트 추가
import './common.css';


export default function MainLayout() {
  // ✅ 현재 선택된 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState({ title: '개인정보수정', programId: 'PSM0010M00' });

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* 상단 고정 헤더 */}
      <div className="h-16 bg-gray-700 border-b border-gray-700 shrink-0">
        <COM0010M00 />
      </div>

      {/* 하단 본문 영역 */}
      <div className="flex flex-1 min-h-0">
        {/* 좌측 아이콘바 */}
        <div className="w-20 bg-[#f4f7fa] shrink-0">
          <COM0070M00 />
        </div>

        {/* 메뉴트리 패널 */}
        <div className="w-[300px] bg-[#e5e5e5] shrink-0 overflow-y-auto border-r border-stone-300">
          <MenuTree onSelectTab={(title, programId) => setSelectedTab({ title, programId })} />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          {/* 탭 프레임 */}
          <div className="h-10 border-b border-slate-200 shrink-0">
            <Maintab selected={selectedTab.title} onSelectTab={(title, programId) => setSelectedTab({ title, programId })} />
          </div>

          {/* 페이지 타이틀 */}
          <div className="shrink-0">
            <PageTitle title={selectedTab.title} programId={selectedTab.programId} />
          </div>

          {/* 콘텐츠 프레임 */}
          <div className="flex-1 overflow-auto p-4">
            <ContentFrame selectedTab={selectedTab.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
