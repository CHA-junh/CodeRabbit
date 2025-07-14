'use client';

import React from 'react';
import MenuTree from './menu';
import COM0070M00 from './COM0070M00'; // 좌측 아이콘바
import COM0010M00 from './COM0010M00'; // 상단 헤더
import './common.css';

export default function MainLayout() {
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
          <MenuTree />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 bg-white overflow-y-auto p-4">
          {/* 여기에 콘텐츠 렌더링 */}
          <div className="text-gray-400 text-center mt-20">여기에 콘텐츠 삽입</div>
        </div>
      </div>
    </div>
  );
}
