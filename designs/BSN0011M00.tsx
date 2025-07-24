'use client';

import React from 'react';
import './common.css';

export default function BSN0011M00() {
  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">신규 사업번호 등록</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      {/* 본문 영역 */}
      <div className="popup-body">
        <table className="form-table">
          <tbody>
            {/* 1행 */}
            <tr className="form-tr">
              <th className="form-th w-[120px]">사업년도</th>
              <td className="form-td w-[200px]">
                <select className="combo-base w-full">
                  <option>2025년</option>
                </select>
              </td>
              <th className="form-th w-[100px]">구분</th>
              <td className="form-td">
                <div className="flex gap-2">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="type" defaultChecked /> 신규사업(SI)
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="type" /> SM 및 유지보수
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="type" /> 연구개발
                  </label>
                </div>
              </td>
            </tr>

            {/* 2행 */}
            <tr className="form-tr">
              <th className="form-th">부서</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>사내공통(25)</option>
                </select>
              </td>
              <th className="form-th">매출구분</th>
              <td className="form-td">
                <div className="flex gap-2">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="saleType" defaultChecked /> 상품
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="saleType" /> 용역
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="saleType" /> 상품+용역
                  </label>
                </div>
                
              </td>
            </tr>

            {/* 3행 */}
            <tr className="form-tr">
              <th className="form-th">사업번호</th>
              <td className="form-td" colSpan={3}>
                <div className="flex items-center gap-2">
                  <input type="text" className="input-base input-defaull !w-[50%]" />
                  <p className="text-[13px] text-red-500 whitespace-nowrap">
                    ※ 신규 등록이 정상적으로 처리되면 사업번호가 자동 부여됩니다.
                  </p>
                </div>
              </td>
            </tr>

            {/* 4행 */}
            <tr className="form-tr">
              <th className="form-th">사업명</th>
              <td className="form-td " colSpan={3}>
                <div className="flex gap-1">
                  <input type="text" className="input-base input-default w-[calc(100%-74px)]" />
                  <button type="button" className="btn-base btn-search">조회</button>
                </div>
              </td>
            </tr>

            {/* 5행 */}
            <tr className="form-tr">
              <th className="form-th">수주처</th>
              <td className="form-td">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <th className="form-th">수주액</th>
              <td className="form-td">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default w-full" />
                  <span className="m-1">원</span>
                </div>
              </td>
            </tr>

            {/* 6행 */}
            <tr className="form-tr">
              <th className="form-th">사업기간</th>
              <td className="form-td" colSpan={3}>
                <div className="flex items-center gap-2">
                  <input type="date" className="input-base input-calender" />
                  <span>~</span>
                  <input type="date" className="input-base input-calender" />
                </div>
              </td>
            </tr>

            {/* 6행 */}
            <tr className="form-tr">
              <th className="form-th">고객사</th>
              <td className="form-td" colSpan={3}>
                <input type="text" className="input-base input-default w-full" />
              </td>
            </tr>

            {/* 7행 */}
            <tr className="form-tr">
              <th className="form-th">사업주관부서</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>개발팀(25)</option>
                </select>
              </td>
              <th className="form-th">영업대표</th>
              <td className="form-td">
                <div className="flex gap-2 items-center">
                  <select className="combo-base w-full">
                    <option>홍길동</option>
                  </select>
                </div>
              </td>
            </tr>

            {/* 8행 */}
            <tr className="form-tr">
              <th className="form-th">사업실행부서</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>사내공통(25)</option>
                </select>
              </td>
              <th className="form-th">PM</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>홍길동</option>
                </select>
              </td>
            </tr>

            {/* 9행 */}
            <tr className="form-tr">
              <th className="form-th">비고</th>
              <td className="form-td" colSpan={3}>
                <textarea className="textarea_def w-full" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* 안내 텍스트 */}
        <p className="text-[13px] text-red-500 mt-3">
          ※ 등록하기 전에 사업명 존재여부를 확인하십시오. (사업명 옆 검색버튼 클릭)
        </p>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn-base btn-act">등록</button>
          <button type="button" className="btn-base btn-delete">종료</button>
        </div>
      </div>
    </div>
  );
}
