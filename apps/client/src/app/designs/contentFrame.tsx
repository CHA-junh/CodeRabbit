'use client';

import React, { useState } from 'react';
import PageTitle from './PageTitle';
import MenuTree from './menu'; // 실제 컴포넌트 경로에 맞게 수정 필요
import './common.css';

export default function RoleManagementPage() {
        {/* 🔹 페이지 타이틀 */}
  <PageTitle programId="SYS1012R00" title="메뉴미리보기" />
  const [selectedTab, setSelectedTab] = useState({ title: '', programId: '' });
    // 더미 등급 이력 데이터  
  const gradeHistory = [
    { level: '초급', start: '1996/03/01', isReference: false },
    { level: '중급', start: '2002/01/01', isReference: false },
    { level: '고급', start: '2005/01/01', isReference: false },
    { level: '특급', start: '2008/01/01', isReference: true },
    
  ];
  return (
    <div className="popup-wrapper">

      
      <div className="popup-header">
        <h3 className="popup-title">팝업 타이틀</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      <div className="popup-body">

      {/* 상단 정보 영역 */}
    <div className="clearbox-div mb-4">
      <table className="clear-table">
        <tbody>
          <tr className="clear-tr">
            <th className="clear-th w-[130px]">구분</th>
            <td className="clear-td">
              <input type="text" value="자사" className="input-base input-default" disabled />
            </td>
            <th className="clear-th w-[60px]">성명</th>
            <td className="clear-td">
              <input type="text" value="최창균" className="input-base input-default" disabled />
            </td>
            <th className="clear-th w-[60px]">최종학력</th>
            <td className="clear-td">
              <input type="text" value="한사" className="input-base input-default" disabled />
            </td>
            <th className="clear-th w-[60px]">입사일자</th>
            <td className="clear-td">
              <input type="text" value="1999/08/18" className="input-base input-default" disabled />
            </td>
          </tr>

          <tr className="clear-tr">
            <th className="clear-th">자격증</th>
            <td className="clear-td">
              <input type="text" className="input-base input-default" disabled />
            </td>
            <th className="clear-th">자격취득일</th>
            <td className="clear-td">
              <input type="text" className="input-base input-default" disabled />
            </td>
            <th className="clear-th" colSpan={1}>학력경력개월</th>
            <td className="clear-td" colSpan={3}>
              <div className="flex items-center gap-1">
                <input type="text" value="29" className="input-base input-default w-[50px]" disabled />
                <span>년</span>
                <input type="text" value="7" className="input-base input-default w-[50px]" disabled />
                <span>개월</span>
              </div>
            </td>
          </tr>

          <tr className="clear-tr">
            <th className="clear-th">기술자격경력</th>
            <td className="clear-td" colSpan={3}>
              <div className="flex items-center gap-1">
                <input type="text" value="0" className="input-base input-default w-[50px]" disabled />
                <span>년</span>
                <input type="text" value="0" className="input-base input-default w-[50px]" disabled />
                <span>개월</span>
              </div>
            </td>
            <th className="clear-th">경력계산기준</th>
            <td className="clear-td">
              <input type="text" value="2025/07/31" className="input-base input-default" disabled />
            </td>
            <th className="clear-th">기술등급(현)</th>
            <td className="clear-td">
              <input type="text" value="특급" className="input-base input-default text-red-500 font-bold" disabled />
            </td>
          </tr>

          <tr className="clear-tr">
            <th className="clear-th">경력기준</th>
            <td className="clear-td" colSpan={7}>
              <div className="flex items-center gap-4">
                <label><input type="radio" name="calcType" defaultChecked /> 학력</label>
                <label><input type="radio" name="calcType" /> 기술자격</label>
              </div>
            </td>
          </tr>

          <tr className="clear-tr">
            <td className="clear-td text-right" colSpan={8}>
              <button type="button" className="btn-base btn-search w-[72px]">조회</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


      {/* 등급 이력 테이블 */}
      <div className="mb-2 font-bold">개발 기술등급 이력</div>
      <div className="gridbox-div mb-2">
        <table className="grid-table w-full">
          <thead>
            <tr>
              <th className="grid-th">기술등급</th>
              <th className="grid-th">시작일자</th>
              <th className="grid-th">비고</th>
            </tr>
          </thead>
          <tbody>
            {gradeHistory.map((item, i) => (
              <tr key={i} className="grid-tr">
                <td className={`grid-td ${item.isReference ? 'text-red-500 font-bold' : ''}`}>
                  {item.level}
                </td>
                <td className={`grid-td ${item.isReference ? 'text-red-500 font-bold' : ''}`}>
                  {item.start}
                </td>
                <td className="grid-td"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 안내 문구 + 종료 버튼 */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-blue-700">
          * 시작일자는 등급이 시작되는 년월일을 말함. 리스트의 <span className="text-red-500">붉은색</span>은 경력계산기준일의 등급임.
        </div>
        <button type="button" className="btn-base btn-delete px-4">종료</button>
      </div>
    </div>

  </div>
  );
}
