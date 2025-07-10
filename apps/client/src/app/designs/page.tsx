'use client'

import React from 'react'

export default function DesignsPage() {
'use client';

import React from 'react';

export default function TopBar() {
  return (
    <header className="w-full h-16 bg-gray-700 border-b border-gray-600 px-4 flex items-center relative z-10">
      {/* 좌측: 로고 + 사용자 정보 */}
      <div className="flex items-center min-w-[220px]">
        {/* 아이콘 */}
        <div className="w-10 h-10 bg-gray-400 rounded-3xl flex flex-col justify-center items-center mr-3">
          <div className="w-3 h-3 bg-white mb-1" />
          <div className="w-6 h-1 bg-white" />
        </div>

        {/* 텍스트 */}
        <div className="text-white font-['NanumGothic']">
          <div className="text-xs text-gray-300 leading-tight">ADMIN</div>
          <div className="text-sm font-bold">SI 3팀 김부뜰 대리</div>
        </div>
      </div>

      {/* 중앙: 검색창 + 공지사항 */}
      <div className="flex-1 flex flex-col items-start justify-center px-6 hidden lg:flex">
        {/* 검색창 */}
        <div className="w-full max-w-sm h-8 flex items-center bg-white rounded px-2 mb-1">
          <svg
            className="w-4 h-4 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2m0 0A7.5 7.5 0 1010 17.5a7.5 7.5 0 005.8-1.7z" />
          </svg>
          <input
            className="flex-1 text-sm text-gray-700 outline-none"
            placeholder="검색어를 입력하세요"
          />
        </div>

        {/* 공지사항 */}
        <div className="text-white text-sm font-normal truncate">
          공지사항내용이 표시됩니다.
        </div>
      </div>

      {/* 우측: 버튼 + 알림 */}
      <div className="flex items-center gap-2 min-w-[300px] justify-end">
        <a
          href="#"
          className="hidden md:inline-block h-10 px-4 bg-gray-600 text-white text-sm rounded hover:bg-gray-500"
        >
          부뜰 홈페이지 바로가기
        </a>
        <a
          href="#"
          className="hidden md:inline-block h-10 px-4 bg-gray-600 text-white text-sm rounded hover:bg-gray-500"
        >
          그룹웨어로 바로가기
        </a>

        {/* 알림 아이콘 */}
        <div className="relative w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-yellow-500 rounded" />
        </div>
      </div>

      {/* 모바일 전용 공지 (아래쪽으로 따로 출력) */}
      <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-white text-sm block lg:hidden">
        공지사항내용이 표시됩니다.
      </div>
    </header>
  );
}



