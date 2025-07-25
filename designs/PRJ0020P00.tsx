'use client';

import React from 'react';
import './common.css';

export default function PRJ0020P00() {
  return (
    <div className="popup-wrapper !min-w-[850px]">
      {/* 🔷 팝업 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">프로젝트 기본정보 등록</h3>
        <button className="popup-close">×</button>
      </div>

      <div className="popup-body">
        {/* 🔍 기본 정보 입력 */}
        <table className="form-table">
          <tbody>
            <tr>
              <th className="form-th w-[120px]">사업번호</th>
              <td className="form-td w-[330px]">
                <div className="flex w-full gap-1">
                    <input type="text" className="input-base input-default w-[calc(100%-34px)]" />
                    <button className="icon_btn icon_search w-[30px] min-w-[30px]" />
                </div>
                </td>
              <th className="form-th w-[80px]">사업명</th>
              <td className="form-td min-w-[150px]">
                <div className="flex w-full gap-1">
                    <input type="text" className="input-base input-default flex-1" />
                    <button className="icon_btn icon_search w-[30px] min-w-[30px]" />
                </div>
                </td>
              <th className="form-th w-[80px]">진행단계</th>
              <td className="form-td">
                <input type="text" className="input-base input-default w-full bg-gray-100" readOnly />
              </td>
            </tr>
            <tr>
              <th className="form-th">기간</th>
              <td className="form-td">
                <div className="flex items-center gap-1">
                  <input type="date" className="input-base input-calender w-[130px]" />
                  <span className="mx-1">~</span>
                  <input type="date" className="input-base input-calender w-[130px]" />
                </div>
              </td>
              <th className="form-th">사업실행부서</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>사내공통(25)</option>
                </select>
              </td>
              <th className="form-th">PM</th>
              <td className="form-td">
                <input type="text" className="input-base input-default w-full bg-gray-100" readOnly />
              </td>
            </tr>
          </tbody>
        </table>

        {/* 📌 프로젝트 개요 */}
        <div className="tit_area mt-4">
          <h3>프로젝트 개요</h3>
        </div>

        <table className="form-table">
          <tbody>
            <tr>
              <th className="form-th w-[120px]">개요</th>
              <td className="form-td !h-[50px]" colSpan={5}>
                <textarea className="input-base input-default w-full !h-full mt-[3px]" />
              </td>
            </tr>
            <tr>
              <th className="form-th">업무구분</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>선택</option>
                </select>
              </td>
              <th className="form-th w-[120px]">고객구분</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>선택</option>
                </select>
              </td>
              <th className="form-th w-[120px]">솔루션</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>선택</option>
                </select>
              </td>
            </tr>
            <tr>
              <th className="form-th">개발범위</th>
              <td className="form-td h-[50px]" colSpan={5}>
                <textarea className="input-base input-default w-full !h-full mt-[3px]" />
              </td>
            </tr>
            <tr>
              <th className="form-th">개발환경</th>
              <td className="form-td h-[100px]" colSpan={5}>
                <textarea className="input-base input-default w-full !h-[80px]" />
                <p className="mt-1 text-sm text-blue-600 underline cursor-pointer">
                  ※ 여기를(개발환경 작성 예시) 클릭하면 개발환경 작성 화면이 팝업됩니다.
                </p>
              </td>
            </tr>
            <tr>
              <th className="form-th">비고</th>
              <td className="form-td h-[40px]" colSpan={5}>
                <textarea className="input-base input-default w-full !h-full mt-[3px]" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ✅ 버튼 */}
        <div className="mt-2 flex justify-end gap-2">
          <button className="btn-base btn-etc">종료</button>
          <button className="btn-base btn-delete">삭제</button>
          <button className="btn-base btn-act">등록</button>
        </div>
      </div>
    </div>
  );
}
