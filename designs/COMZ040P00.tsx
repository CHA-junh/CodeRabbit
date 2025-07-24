'use client';

import React from 'react';
import '@/app/common/common.css';

export default function ProjectSearchPopup() {
  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">사업번호검색</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      <div className="popup-body">
        {/* 검색 영역 */}
        <div className="search-div">
          <table className="search-table">
            <tbody>
              {/* 1행 */}
              <tr className="search-tr">
                <th className="search-th w-[110px]">조회구분</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input type="radio" name="searchType" defaultChecked /> 전체
                  </label>
                  <label className="mr-2">
                    <input type="radio" name="searchType" /> 사업부서
                  </label>
                  <label>
                    <input type="radio" name="searchType" /> 실행부서
                  </label>
                </td>
              </tr>

              {/* 2행 */}
              <tr className="search-tr">
                <th className="search-th">본부</th>
                <td className="search-td !w-[150px]">
                  <select className="combo-base">
                    <option>전체</option>
                  </select>
                </td>
                <th className="search-th w-[110px]">추진부서</th>
                <td className="search-td !w-[150px]">
                  <select className="combo-base ">
                    <option>전체</option>
                  </select>
                </td>
                <th className="search-th w-[110px]">영업대표</th>
                <td className="search-td !w-[150px]">
                  <input type="text" className="input-base input-default w-[100px]" />
                </td>
                <td className="search-td" colSpan={4}></td>
              </tr>

              {/* 3행 */}
              <tr className="search-tr">
                <th className="search-th">진행상태</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input type="checkbox" defaultChecked /> (모두선택)
                  </label>
                  <label className="mr-2">
                    <input type="checkbox" defaultChecked /> 신규
                  </label>
                  <label className="mr-2">
                    <input type="checkbox" defaultChecked /> 영업진행
                  </label>
                  <label className="mr-2">
                    <input type="checkbox" /> 수주확정
                  </label>
                  <label className="mr-2">
                    <input type="checkbox" /> 계약
                  </label>
                  <label className="mr-2">
                    <input type="checkbox" /> 완료(종결)
                  </label>
                  <label className="mr-2">
                    <input type="checkbox" /> 수주실패
                  </label>
                  <label>
                    <input type="checkbox" /> 취소(삭제)
                  </label>
                </td>
              </tr>

              {/* 4행 */}
              <tr className="search-tr">
                <th className="search-th">사업년도</th>
                <td className="search-td">
                  <select className="combo-base w-[120px]">
                    <option>2025년</option>
                  </select>
                </td>
                <th className="search-th">사업번호</th>
                <td className="search-td">
                  <input type="text" className="input-base input-default w-[120px]" />
                </td>
                <td className="search-td text-right" colSpan={4}>
                  <button className="btn-base btn-search">조회</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 그리드 영역 */}
        <div className="gridbox-div mt-4">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th">No</th>
                <th className="grid-th">사업번호</th>
                <th className="grid-th">사업명</th>
                <th className="grid-th">시작일자</th>
                <th className="grid-th">종료일자</th>
                <th className="grid-th">영업부서</th>
                <th className="grid-th">영업대표</th>
                <th className="grid-th">실행부서</th>
                <th className="grid-th">PM</th>
                <th className="grid-th">진행상태</th>
              </tr>
            </thead>
            <tbody>
              <tr className="grid-tr">
                <td className="grid-td">1</td>
                <td className="grid-td">BTS25-091A</td>
                <td className="grid-td">제주특별자치도개발공사 RPA</td>
                <td className="grid-td">2025/09/01</td>
                <td className="grid-td">2025/09/10</td>
                <td className="grid-td">영업1팀(25)</td>
                <td className="grid-td">최정기</td>
                <td className="grid-td">RPA실(24)</td>
                <td className="grid-td">미정</td>
                <td className="grid-td">신규</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 종료 버튼 */}
        <div className="flex justify-end mt-4">
          <button className="btn-base btn-delete">종료</button>
        </div>
      </div>
    </div>
  );
}
