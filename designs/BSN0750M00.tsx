'use client';

import React from 'react';
import './common.css';

export default function BSN0750M00() {
  return (
    <div className="popup-wrapper !min-w-[740px]">
      {/* 🔷 팝업 상단 */}
      <div className="popup-header">
        <h3 className="popup-title">외주 투입 인력 계약 등록</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      {/* 🔽 팝업 본문 */}
      <div className="popup-body">
        <table className="form-table">
          <tbody>
            <tr className="form-tr">
              <th className="form-th !w-[120px]">사업명</th>
              <td className="form-td" colSpan={3}>
                <input type="text" className="input-base input-default w-full" />
              </td>
            </tr>
            <tr className="form-tr">
              <th className="form-th">투입자명</th>
              <td className="form-td !w-[325px]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <th className="form-th !w-[120px]">직무</th>
              <td className="form-td">
                <input type="text" className="input-base input-default w-full" />
              </td>
            </tr>
            <tr className="form-tr">
              <th className="form-th">계약기간</th>
              <td className="form-td">
                <div className="flex gap-1 items-center">
                  <input type="date" className="input-base input-calender" />
                  <span className="m-1">~</span>
                  <input type="date" className="input-base input-calender" />
                </div>
              </td>
              <th className="form-th">계약금액</th>
              <td className="form-td">
                <input type="text" className="input-base input-default text-right !w-[85%]" /> 원
              </td>
            </tr>
            <tr className="form-tr">
              <th className="form-th">비고</th>
              <td className="form-td" colSpan={3}>
                <textarea className="input-base input-default w-full h-[80px]" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* 안내문 + 버튼 */}
        <div className="flex justify-between items-center mt-2">
          <p className="text-blue-500 text-sm">
            * 외주 인력에 대한 계약 정보를 입력하세요.
          </p>
          <div className="flex gap-2">
            <button className="btn-base btn-delete">종료</button>
            <button className="btn-base btn-act">저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
