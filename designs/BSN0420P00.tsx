'use client';

import React from 'react';
import './common.css';

export default function BSN0420P00() {
  return (
    <div className="popup-wrapper">
      {/* 🔷 팝업 상단 */}
      <div className="popup-header">
        <h3 className="popup-title">월별 발행완료 유무 등록</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      {/* 🔽 팝업 본문 */}
      <div className="popup-body">
        <table className="form-table">
          <tbody>
            {/* 매출금액 */}
            <tr className="form-tr">
              <th className="form-th whitespace-nowrap">매출금액(계획/실적)</th>
              <td className="form-td">
                <input
                  type="text"
                  className="input-base input-default !w-[40%] text-right"
                  defaultValue="0"
                />
                <span className="m-1">/</span>
                <input
                  type="text"
                  className="input-base input-default !w-[40%] text-right"
                  defaultValue="23,700,000"
                  readOnly
                /> 
                 원
              </td>
            </tr>

            {/* 매입금액 */}
            <tr className="form-tr">
              <th className="form-th whitespace-nowrap">매입금액(계획/실적)</th>
              <td className="form-td">
                <input
                  type="text"
                  className="input-base input-default !w-[40%] text-right"
                  defaultValue="0"
                />
                <span className="m-1">/</span>
                <input
                  type="text"
                  className="input-base input-default !w-[40%] text-right"
                  defaultValue="0"
                /> 
                 원
              </td>
            </tr>

            {/* 계산서 발행 여부 */}
            <tr className="form-tr">
              <th className="form-th">계산서 발행 완료</th>
              <td className="form-td" colSpan={3}>
                <label className="mr-4">
                  <input type="radio" name="status" className="mr-1" defaultChecked /> 완료(Y)
                </label>
                <label>
                  <input type="radio" name="status" className="mr-1" /> 진행중(N)
                </label>
              </td>
            </tr>

            {/* 비고 */}
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
          <p className="text-[#444CE7] text-sm">
            *해당월의 계산서 발행 완료 유무를 등록하는 화면입니다.
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
