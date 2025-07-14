'use client';

import React from 'react';
import './common.css';

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <header className="w-full h-16 bg-[#374151] px-4 flex items-center text-white text-sm min-w-[900px] whitespace-nowrap">
        {/* 로고 + 시스템명 */}
        <div className="flex items-center gap-2 pr-4 w-[230px] h-auto flex-shrink-0">
          <img src="/logo-top-wh.svg" alt="Logo" className="h-8" />
        </div>

        {/* 구분선 */}
        <div className="h-full w-px bg-gray-600 mx-3" />

        {/* 프로필 + 이름 */}
        <div className="flex items-center gap-2 pr-4 h-8">
        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <img src="/icon_user.svg" alt="notice" className="w-4 h-4" />
        </div>
        <div className="text-white text-sm leading-8">SI 3팀 김부뜰 대리</div>
        </div>

        {/* 구분선 */}
        <div className="h-full w-px bg-gray-600 mx-3" />

        {/* 알림 + 공지 */}
        <div className="flex items-center gap-2 flex-shrink-0 h-8">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
            <img src="/icon_notice.svg" alt="notice" className="w-4 h-4" />
        </div>

        <div className="whitespace-nowrap text-white leading-8">공지사항내용이 표시됩니다.</div>
        </div>


        {/* 구분선 */}
        <div className="h-full w-px bg-gray-600 mx-3" />

        {/* 검색창 */}
        <div className="flex items-center ml-auto bg-[#3f4a5a] rounded px-3 py-1 w-[240px]">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="flex-1 bg-transparent text-white placeholder:text-gray-300 text-sm outline-none"
          />
          <svg
            className="w-4 h-4 text-gray-300 ml-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.2-5.2m0 0A7.5 7.5 0 1010 17.5a7.5 7.5 0 005.8-1.7z"
            />
          </svg>
        </div>

        {/* 구분선 */}
        <div className="h-full w-px bg-gray-600 mx-3" />

        {/* 버튼 2개 */}
        <div className="flex items-center gap-2 ml-3">
          <button className="bg-[#4b5563] px-3 py-2 rounded text-sm">부뜰 홈페이지 바로가기</button>
          <button className="bg-[#4b5563] px-3 py-2 rounded text-sm">그룹웨어로 바로가기</button>
        </div>
      </header>
    </div>
  );
}

