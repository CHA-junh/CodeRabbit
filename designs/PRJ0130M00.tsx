'use client';

import React, { useState } from 'react';
import './common.css';
import PRJ0140M00 from './PRJ0140M00';

export default function 월별비용현황() {
  const [formData, setFormData] = useState({
    projectNo: '',
    projectName: '',
    period: '',
    plan: '',
    dept: '',
    execDept: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mdi h-full flex flex-col overflow-hidden">
      {/* 제목 영역 */}
      <div className="tit_area">
        <h3>월별 보고서</h3>
      </div>

      {/* 검색 영역 */}
      <div className="mb-4">
        <table className="form-table">
          <tbody>
            <tr>
              <th className="form-th w-[100px]">사업번호</th>
              <td className="form-td min-w-[200px]">
                <div className="flex items-center gap-1">
                    <input type="text" className="input-base input-default w-full" />
                    <button type="button" className="icon_btn icon_search" />
                </div>
              </td>
              <th className="form-th w-[130px]">사업명</th>
              <td className="form-td min-w-[200px] w-[30%]">
                <div className="flex items-center gap-1">
                    <input type="text" className="input-base input-default w-full" />
                    <button type="button" className="icon_btn icon_search" />
                </div>
              </td>
              <th className="form-th w-[120px]">사업기간</th>
              <td className="form-td min-w-[200px]">
                <input
                  type="text"
                  name="period"
                  className="input-base input-default w-full"
                  value={formData.period}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th className="form-th">계획/실적</th>
              <td className="form-td">
                <input
                  type="text"
                  name="plan"
                  className="input-base input-default w-full"
                  value={formData.plan}
                  onChange={handleChange}
                />
              </td>
              <th className="form-th">사업부서/영업대표</th>
              <td className="form-td">
                <input
                  type="text"
                  name="dept"
                  className="input-base input-default w-full"
                  value={formData.dept}
                  onChange={handleChange}
                />
              </td>
              <th className="form-th">실행부서/PM</th>
              <td className="form-td">
                <input
                  type="text"
                  name="execDept"
                  className="input-base input-default w-full"
                  value={formData.execDept}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 서브탭 */}
        <div className="sub-tab-container flex-1 min-h-0 overflow-hidden mb-4">
        <div className="sub-tab-list">
            <div className="sub-tab-button sub-tab-active">월별비용현황</div>
        </div>
        <div className="sub-tab-panel flex-1 min-h-0 overflow-hidden">
            <PRJ0140M00 />
        </div>
        </div>

    </div>
  );
}
