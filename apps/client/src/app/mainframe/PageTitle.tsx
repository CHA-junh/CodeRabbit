'use client';

import React from 'react';
import '../common/common.css';

interface PageTitleProps {
  programId: string;
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ programId, title }) => {
  return (
    <div className="flex justify-between items-center px-2 py-2">
      <div className="flex items-center gap-2">
        <img src="/icon_star.svg" alt="star" className="w-4 h-4" />
        <span className="text-xs text-gray-400 m-2 ml-auto">[{programId}]</span>
        <span className="text-sm font-bold text-gray-800 m-2 ml-auto">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="hover:opacity-70">
          <img src="/icon_bug.svg" alt="설정" className="w-4 h-4" />
        </button>
        <button className="hover:opacity-70">
          <img src="/icon_infor.svg" alt="새로고침" className="w-4 h-4" />
        </button>
        <button className="hover:opacity-70">
          <img src="/icon_close.svg" alt="닫기" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PageTitle; 