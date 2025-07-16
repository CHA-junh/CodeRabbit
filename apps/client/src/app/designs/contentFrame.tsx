'use client';

import React, { useState } from 'react';
import './common.css';
import PSM0010M00 from './PSM0010M00';
import PSM1030M00 from './PSM1030M00';
import PSM1040M00 from './PSM1040M00';
import PSM1050M00 from './PSM1050M00';

export default function EmployeeMainPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['사원정보등록 및 수정', '인사발령내역(건별)', '인사발령일괄등록', '프로필내역조회'];

  return (
    <div className="mdi flex flex-col h-[calc(100vh-200px)] overflow-hidden min-w-[1400px]">
      {/* 검색 영역 */}
      <div className="search-div mb-4 shrink-0">
        <table className="search-table w-full">
          <tbody>
            <tr>
              <th className="search-th w-[100px]">자사 외주 구분</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>자사</option>
                  <option>외주</option>
                </select>
              </td>
              <th className="search-th w-[80px]">사원성명</th>
              <td className="search-td w-[150px]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <th className="search-th w-[60px]">본부</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full"><option>SI 사업본부</option></select>
              </td>
              <th className="search-th w-[60px]">부서</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full"><option>SI 1팀</option></select>
              </td>
              <th className="search-th w-[60px]">직책</th>
              <td className="search-td w-[130px]">
                <select className="combo-base w-full"><option>대리</option></select>
              </td>
              <th className="search-th w-[80px]">근무상태</th>
              <td className="search-td w-[130px]">
                <select className="combo-base w-full"><option>재직중</option></select>
              </td>
              <td className="search-td text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 리스트 타이틀 */}
      <div className="tit_area shrink-0">
        <h3>사원/외주 리스트</h3>
        <div>
          <button className="btn-base btn-etc">투입현황조회</button>
        </div>
      </div>

      {/* 그리드 */}
      <div className="gridbox-div mb-4 shrink-0">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th w-[40px]">NO</th>
              <th className="grid-th">사원번호</th>
              <th className="grid-th">구분</th>
              <th className="grid-th">성명</th>
              <th className="grid-th">직책</th>
              <th className="grid-th">본부</th>
              <th className="grid-th">부서</th>
              <th className="grid-th">입사일자</th>
              <th className="grid-th">근무상태</th>
              <th className="grid-th">등급</th>
              <th className="grid-th">경력</th>
              <th className="grid-th">자격증</th>
              <th className="grid-th">연락처</th>
              <th className="grid-th">퇴사일자</th>
              <th className="grid-th">비고</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr className="grid-tr" key={i}>
                <td className="grid-td text-center">{i + 1}</td>
                <td className="grid-td">EMP00{i + 1}</td>
                <td className="grid-td">자사</td>
                <td className="grid-td">김버틀</td>
                <td className="grid-td">이사</td>
                <td className="grid-td">SM사업단</td>
                <td className="grid-td">ITO사업</td>
                <td className="grid-td">1998/01/10</td>
                <td className="grid-td">재직</td>
                <td className="grid-td">특급</td>
                <td className="grid-td">27년 7개월</td>
                <td className="grid-td">정보처리기사</td>
                <td className="grid-td">010-1234-1234</td>
                <td className="grid-td" />
                <td className="grid-td" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 탭 전체 영역 */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* 탭 버튼 */}
        <div className="tab-container shrink-0">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`tab-button ${activeTab === idx ? 'tab-active' : 'tab-inactive'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="tab-panel flex-1 min-h-0 overflow-auto">
          {activeTab === 0 && <PSM0010M00 />}
          {activeTab === 1 && <PSM1030M00 />}
          {activeTab === 2 && <PSM1040M00 />}
          {activeTab === 3 && <PSM1050M00 />}
        </div>
      </div>
    </div>
  );
}
