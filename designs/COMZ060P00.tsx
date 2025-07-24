'use client';

import React from 'react';
import './common.css';

export default function DeptNumberSearchPopup() {
  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">부서번호 검색</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      <div className="popup-body">
        {/* 조회영역 */}
        <div className="search-div mb-4">
          <table className="search-table">
            <tbody>
              <tr className="search-tr">
                <th className="search-th w-[70px]">년도</th>
                <td className="search-td w-[120px]">
                  <select className="combo-base w-full">
                    <option>2025년</option>
                  </select>
                </td>
                <th className="search-th w-[92px]">부서번호</th>
                <td className="search-td w-[180px]">
                  <input type="text" className="input-base input-default w-full" />
                </td>
                <td className="search-td text-right" colSpan={4}>
                  <button className="btn-base btn-search mr-2">조회</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 그리드 영역 */}
        <div className="gridbox-div mb-4">
          <div className="grid-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th">부서번호</th>
                <th className="grid-th">부서명</th>
                <th className="grid-th">시작일자</th>
                <th className="grid-th">종료일자</th>
                <th className="grid-th">본부구분</th>
                <th className="grid-th">부서구분</th>
              </tr>
            </thead>
            <tbody>
              {/* 샘플 데이터 */}
              <tr className="grid-tr">
                <td className="grid-td">BTS25-0000</td>
                <td className="grid-td">사내 공통 (25)</td>
                <td className="grid-td">2025/01/01</td>
                <td className="grid-td">2025/03/31</td>
                <td className="grid-td">사내공통 (24)</td>
                <td className="grid-td">사내공통 (24)</td>
              </tr>
              <tr className="grid-tr">
                <td className="grid-td">BTS25-0100</td>
                <td className="grid-td">컨택센터연구소(25)</td>
                <td className="grid-td">2025/01/01</td>
                <td className="grid-td">2025/03/31</td>
                <td className="grid-td">컨택센터연구소(24)</td>
                <td className="grid-td">컨택센터연구소(24)</td>
              </tr>
              {/* ... 추가 row map 가능 */}
            </tbody>
          </table>
          </div>
        </div>

        {/* 종료 버튼 (우측 정렬) */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete">종료</button>
        </div>
      </div>
    </div>
  );
}
