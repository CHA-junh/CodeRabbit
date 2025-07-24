'use client';

import React from 'react';
import './common.css';

export default function PSM1051D00() {
  return (
    <div className="mt-4">
      <div className="tit_area flex justify-between items-center">
        <h3>
          프로필경력
        </h3>
        <div className="flex items-center gap-2">
          <span className="">기준일</span>
          <input
            type="date"
            className="input-base input-calender w-[150px]"
            defaultValue="2025-07-31"
          />
        </div>
      </div>

      <table className="form-table mt-2">
        <thead>
          <tr>
            <th className="form-th w-[160px]"></th>
            <th className="form-th text-center">입사전 경력</th>
            <th className="form-th text-center">입사후 경력</th>
            <th className="form-th text-center">합계</th>
            <th className="form-th text-center">기술등급</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="form-th text-left">학력기준</th>
            <td className="form-td">
              <input className="input-base !w-[50px]" defaultValue="0" /> 년{' '}
              <input className="input-base !w-[50px]" defaultValue="0" /> 개월
            </td>
            <td className="form-td">
              <input className="input-base !w-[50px]" defaultValue="12" /> 년{' '}
              <input className="input-base !w-[50px]" defaultValue="5" /> 개월
            </td>
            <td className="form-td">
              <input className="input-base !w-[50px]" defaultValue="12" /> 년{' '}
              <input className="input-base !w-[50px]" defaultValue="5" /> 개월
            </td>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>특급</option>
              </select>
            </td>
          </tr>
          <tr>
            <th className="form-th text-left">기술자격기준</th>
            <td className="form-td">
              <input className="input-base !w-[50px]" defaultValue="0" /> 년{' '}
              <input className="input-base !w-[50px]" defaultValue="0" /> 개월
            </td>
            <td className="form-td">
              <input className="input-base !w-[50px]" defaultValue="12" /> 년{' '}
              <input className="input-base !w-[50px]" defaultValue="5" /> 개월
            </td>
            <td className="form-td">
              <input className="input-base !w-[50px]" defaultValue="12" /> 년{' '}
              <input className="input-base !w-[50px]" defaultValue="5" /> 개월
            </td>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>특급</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-3">
        <p className="text-[13px] text-[#00509A] py-1">
          ※ 입사전 경력은 프로필의 입사전 경력보다 클 수 없습니다. 프로필 작성 내용을 확인해 주십시요.
        </p>
        {/* <div className="flex gap-2">
          <button className="btn-base btn-act">경력저장</button>
          <button className="btn-base btn-delete">취소</button>
        </div> */}
      </div>
    </div>
  );
}
