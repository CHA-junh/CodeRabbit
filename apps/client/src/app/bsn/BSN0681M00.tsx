'use client';

import React from 'react';

export default function BSN0681M00() {
  return (
    <div className="flex flex-col h-full">
      {/* 🔷 타이틀 + 조회버튼 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">월별 투입/철수 현황</h3>
        <div className="flex gap-2">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm">
            엑셀
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
            조회
          </button>
        </div>
      </div>

      {/* 📊 차트 영역 (임시) */}
      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-lg font-medium">월별 투입/철수 현황 차트</p>
            <p className="text-sm text-gray-400 mt-2">
              디자인 시안이 완료되면 차트 컴포넌트가 추가됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 📌 안내문 */}
      <div className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded-lg">
        <p>※ 월별 투입/철수 현황을 차트로 표시합니다. 특정 월을 더블클릭하면 해당 월의 상세 인원 리스트로 이동합니다.</p>
      </div>
    </div>
  );
} 