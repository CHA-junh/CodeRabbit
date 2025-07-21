'use client';

import React from 'react';
import './common.css';

export default function BSN0120M00() {
  return (
    <div className="w-full">
      {/* 🔷 타이틀 + 버튼 */}
      <div className="tit_area">
        <h3>제품목록</h3>
      </div>

        {/* 📋 제품 테이블 */}
        <div className="gridbox-div">
        <table className="grid-table">
            <thead>
            <tr>
                <th className="grid-th">구분</th>
                <th className="grid-th">품목</th>
                <th className="grid-th">제조사</th>
                <th className="grid-th">제품 모델명</th>
                <th className="grid-th">제품설명(주요규격/라이선스)</th>
                <th className="grid-th">수량</th>
                <th className="grid-th">단위</th>
                <th className="grid-th">단가</th>
                <th className="grid-th">원가</th>
                <th className="grid-th">매출이익률(%)</th>
                <th className="grid-th">공급가</th>
                <th className="grid-th">매출이익</th>
                <th className="grid-th">비고</th>
            </tr>
            </thead>
            <tbody>
            {/* 🔹 데이터 행 */}
            <tr className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                <td className="grid-td">S/W</td>
                <td className="grid-td">챗팅솔루션</td>
                <td className="grid-td">운영인건비</td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td">3</td>
                <td className="grid-td">MM</td>
                <td className="grid-td">9,000,000</td>
                <td className="grid-td">27,000,000</td>
                <td className="grid-td">5.3</td>
                <td className="grid-td">28,500,000</td>
                <td className="grid-td">1,500,000</td>
                <td className="grid-td"></td>
            </tr>

            {/* 🔹 소계 행 */}
            <tr className="grid-tr font-bold even:bg-[#F9FCFF] hover:bg-blue-50">
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td text-red-600">소계</td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td text-red-600">27,000,000</td>
                <td className="grid-td text-red-600">5.3</td>
                <td className="grid-td text-red-600">28,500,000</td>
                <td className="grid-td text-red-600">1,500,000</td>
                <td className="grid-td"></td>
            </tr>

            {/* 🔹 합계 행 */}
            <tr className="grid-tr font-bold even:bg-[#F9FCFF] hover:bg-blue-50">
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td text-blue-600">합계</td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td"></td>
                <td className="grid-td text-blue-600">27,000,000</td>
                <td className="grid-td text-blue-600">5.3</td>
                <td className="grid-td text-blue-600">28,500,000</td>
                <td className="grid-td text-blue-600">1,500,000</td>
                <td className="grid-td"></td>
            </tr>
            </tbody>
        </table>
        </div>


        <div className="flex gap-2 mt-4 justify-end">
            <button className="btn-base btn-delete">삭제</button>
            <button className="btn-base btn-etc">신규</button>
            <button className="btn-base btn-act">수정</button>
        </div>
    </div>
  );
}
