'use client';

import React from 'react';
import './common.css';

export default function EmployeeSearchPopupExtended() {
  return (
    <div className="popup-wrapper">
      {/* 팝업 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">직원 검색</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      {/* 팝업 본문 */}
      <div className="popup-body">
        {/* 검색 영역 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                <th className="search-th w-[80px]">직원명</th>
                <td className="search-td w-[200px]">
                  <input type="text" className="input-base input-default w-full" />
                </td>
                <td className="search-td" colSpan={6}>
                  <div className="flex items-center gap-4 text-sm">
                    <label><input type="radio" name="type" defaultChecked /> 자사</label>
                    <label><input type="radio" name="type" /> 외주</label>
                    <label><input type="radio" name="type" /> 자사+외주</label>
                    <label><input type="radio" name="type" /> 퇴사자포함</label>
                  </div>
                </td>
                <td className="search-td text-right">
                  <button className="btn-base btn-search">조회</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결과 그리드 */}
        <div className="gridbox-div mb-2">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th">구분</th>
                <th className="grid-th">직원명</th>
                <th className="grid-th">직책</th>
                <th className="grid-th">등급</th>
                <th className="grid-th">소속</th>
                <th className="grid-th">입사일</th>
                <th className="grid-th">투입일</th>
                <th className="grid-th">철수일</th>
                <th className="grid-th">상태</th>
                <th className="grid-th">투입중 프로젝트</th>
              </tr>
            </thead>
            <tbody>
              {/* 데이터 row들 map으로 대체 가능 */}
              <tr className="grid-tr">
                <td className="grid-td text-center">1</td>
                <td className="grid-td">자사</td>
                <td className="grid-td">성부뜰</td>
                <td className="grid-td">부장</td>
                <td className="grid-td">특급</td>
                <td className="grid-td">SI사업본부</td>
                <td className="grid-td">2024/07/01</td>
                <td className="grid-td">2024/08/01</td>
                <td className="grid-td">2025/01/01</td>
                <td className="grid-td">재직</td>
                <td className="grid-td">AICC 구축</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 하단 안내문구 */}
        <div className="text-xs text-blue-600 leading-snug whitespace-pre-wrap px-1 mb-3">
          ※ 외주 직원의 경우, 입사일은 부뜰 프로젝트 최초 투입일자이고 투입일과 철수일은 최종투입일과 철수일임.{"\n"}
          상태는 자사 직원일 경우 재직/퇴사/휴직으로 표시되고 외주일 경우에는 재직/철수로 표시됨.{"\n"}
          검색하고자 하는 직원이름을 모를 경우에는 마지막 입력에 <b>%</b> 붙여서 검색하면 됨.
        </div>

        {/* 종료 버튼 */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete">종료</button>
        </div>
      </div>
    </div>
  );
}
