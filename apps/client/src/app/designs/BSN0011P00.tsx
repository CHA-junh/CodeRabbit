'use client';

import React from 'react';
import './common.css';

export default function ProjectEditPopup() {
  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">사업 기본정보 수정</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      {/* 본문 */}
      <div className="popup-body">
        <table className="form-table">
          <tbody>
            {/* 1행 */}
            <tr className="form-tr">
              <th className="form-th w-[130px]">사업년도</th>
              <td className="form-td">
                <input type="text" className="input-base input-default w-full" defaultValue="2024" />
              </td>
              <th className="form-th w-[130px]">구분</th>
              <td className="form-td">
                <div className="flex gap-2">
                  <label><input type="radio" name="type" defaultChecked /> 신규사업(SI)</label>
                  <label><input type="radio" name="type" /> SM 및 유지보수</label>
                  <label><input type="radio" name="type" /> 연구개발</label>
                </div>
              </td>
            </tr>

            {/* 2행 */}
            <tr className="form-tr">
		<th className="form-th">text</th>
		<td className="form-td"><input type="text" className="input-base input-default w-full" defaultValue=""  /></td>

              <th className="form-th">매출구분</th>
              <td className="form-td" colSpan={3}>
                <div className="flex gap-4">
                  <label><input type="radio" name="sales" defaultChecked /> 상품</label>
                  <label><input type="radio" name="sales" /> 용역</label>
                  <label><input type="radio" name="sales" /> 상품+용역</label>
                </div>
              </td>
            </tr>

            {/* 3행 */}
            <tr className="form-tr">
              <th className="form-th">사업번호</th>
              <td className="form-td" colSpan={3}>
                <input type="text" className="input-base input-default w-full bg-gray-200" defaultValue="BTM24-225B" disabled />
              </td>
            </tr>

            {/* 4행 */}
            <tr className="form-tr">
              <th className="form-th">사업명</th>
              <td className="form-td" colSpan={3}>
                <input type="text" className="input-base input-default w-full" defaultValue="(운영)2025년 NH농협손해보험 애플리케이션 위탁 운영" />
              </td>
            </tr>

            {/* 5행 */}
            <tr className="form-tr">
              <th className="form-th">수주처</th>
              <td className="form-td">
                <input type="text" className="input-base input-default w-full" defaultValue="타이호인포스트" />
              </td>
              <th className="form-th">수주액</th>
              <td className="form-td">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default w-full" defaultValue="133,200,000" />
                  <span className="m-1">원</span>
                </div>
              </td>
            </tr>

            {/* 6행 */}
            <tr className="form-tr">
              <th className="form-th">사업기간</th>
              <td className="form-td" colSpan={3}>
                <div className="flex items-center gap-2">
                  <input type="date" className="input-base input-calender" defaultValue="2025-01-01" />
                  <span className="m-1">~</span>
                  <input type="date" className="input-base input-calender" defaultValue="2025-12-31" />
                </div>
              </td>
            </tr>

            {/* 7행 */}
            <tr className="form-tr">
              <th className="form-th">고객사</th>
              <td className="form-td" colSpan={3}>
                <input type="text" className="input-base input-default w-full" defaultValue="NH농협손해보험" />
              </td>
            </tr>

            {/* 8행 */}
            <tr className="form-tr">
              <th className="form-th">사업주관부서</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>영업팀(25)</option>
                </select>
              </td>
              <th className="form-th">영업대표</th>
              <td className="form-td">
                <input className="input-base input-default " />
              </td>
            </tr>

            {/* 9행 */}
            <tr className="form-tr">
              <th className="form-th">사업실행부서</th>
              <td className="form-td">
                <select className="combo-base w-full">
                  <option>기술팀</option>
                </select>
              </td>
              <th className="form-th">PM</th>
              <td className="form-td">
                <input className="input-base input-default " />
              </td>
            </tr>

            {/* 10행 */}
            <tr className="form-tr">
              <th className="form-th">비고</th>
              <td className="form-td" colSpan={3}>
                <textarea className="textarea_def w-full" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* ✅ 하단 6열 테이블 구조 (진행상태 등) */}
        <table className="form-table mt-4">
          <tbody>
            <tr className="form-tr">
              <th className="form-th w-[130px]">사업진행상태</th>
              <td className="form-td col-span-5" colSpan={5}>
                <div className="flex flex-wrap gap-3">
                  <label><input type="radio" name="progress" /> 신규</label>
                  <label><input type="radio" name="progress" /> 영업진행</label>
                  <label><input type="radio" name="progress" /> 수주확정</label>
                  <label><input type="radio" name="progress" /> 계약</label>
                  <label><input type="radio" name="progress" /> 완료(종결)</label>
                  <label><input type="radio" name="progress" /> 수주실패</label>
                  <label><input type="radio" name="progress" /> 취소(삭제)</label>
                </div>
              </td>
            </tr>
            <tr className="form-tr">
              <th className="form-th">수주확정일</th>
              <td className="form-td">
                <input type="date" className="input-base input-calender w-full" defaultValue="2025-01-16" />
              </td>
              <th className="form-th w-[130px]">계약일자</th>
              <td className="form-td">
                <input type="date" className="input-base input-calender w-full" />
              </td>
              <th className="form-th">완료일자</th>
              <td className="form-td">
                <input type="date" className="input-base input-calender w-full" />
              </td>
            </tr>
            <tr className="form-tr">
              <th className="form-th">취소(삭제)일자</th>
              <td className="form-td">
                <input type="date" className="input-base input-calender w-full" />
              </td>
              <th className="form-th">취소(삭제)사유</th>
              <td className="form-td" colSpan={3}>
                <input type="text" className="input-base input-default w-full" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* 안내 문구 */}
        <p className="text-[13px] text-red-600 mt-3">
          ※ 사업번호를 등록한 영업대표만이 사업 기본정보를 수정할 수 있습니다.
        </p>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn-base btn-act">수정</button>
          <button type="button" className="btn-base btn-delete">종료</button>
        </div>
      </div>
    </div>
  );
}