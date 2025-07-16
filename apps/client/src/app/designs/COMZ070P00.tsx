'use client';

import React from 'react';
import './common.css';

export default function EmployeeSearchPopup() {
  return (
    <div className="popup-wrapper">
      {/* 팝업 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">직원 검색</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      <div className="popup-body">
        {/* 검색 영역 */}
        <div className="search-div mb-4">
          <table className="search-table">
            <tbody>
              <tr>
                <th className="search-th w-[80px]">직원명</th>
                <td className="search-td w-[200px]">
                  <input type="text" className="input-base input-default w-full" defaultValue="성지훈" />
                </td>
                <td className="search-td text-right" colSpan={6}>
                  <button className="btn-base btn-search">조회</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결과 그리드 */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th">구분</th>
                <th className="grid-th">직원명</th>
                <th className="grid-th">직책</th>
                <th className="grid-th">등급</th>
                <th className="grid-th">소속</th>
                <th className="grid-th">최종프로젝트</th>
                <th className="grid-th">투입일</th>
                <th className="grid-th">철수일</th>
                <th className="grid-th">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr className="grid-tr">
                <td className="grid-td text-center">1</td>
                <td className="grid-td">자사</td>
                <td className="grid-td">성지훈</td>
                <td className="grid-td">사원</td>
                <td className="grid-td">초급</td>
                <td className="grid-td">ITO사업본부/DP</td>
                <td className="grid-td">현대해상 채널통합판매시스템 구축</td>
                <td className="grid-td">2012/05/16</td>
                <td className="grid-td">2012/06/22</td>
                <td className="grid-td"></td>
              </tr>
              <tr className="grid-tr">
                <td className="grid-td text-center">2</td>
                <td className="grid-td">자사</td>
                <td className="grid-td">성지훈</td>
                <td className="grid-td">과장</td>
                <td className="grid-td">중급</td>
                <td className="grid-td">서비스사업본부/</td>
                <td className="grid-td">KB캐피탈 자동차 TM시스템 구축</td>
                <td className="grid-td">2016/11/03</td>
                <td className="grid-td">2017/01/02</td>
                <td className="grid-td"></td>
              </tr>
              <tr className="grid-tr">
                <td className="grid-td text-center">3</td>
                <td className="grid-td">자사</td>
                <td className="grid-td">성지훈</td>
                <td className="grid-td">차장</td>
                <td className="grid-td">특급</td>
                <td className="grid-td">SI사업본부(25)/</td>
                <td className="grid-td">한화생명 AICC 구축</td>
                <td className="grid-td">2024/07/01</td>
                <td className="grid-td">2025/03/12</td>
                <td className="grid-td"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 종료 버튼 */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete">종료</button>
        </div>
      </div>
    </div>
  );
}
