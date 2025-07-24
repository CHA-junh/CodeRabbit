'use client';

import React from 'react';
import './common.css';

export default function BSN0130M00() {
  
  return (
    <div className="">
      {/* 🔷 타이틀 + 버튼 영역 */}
      <div className="tit_area">
        <h3>직접인건비</h3>
        <div className="flex gap-2">
          <button className="btn-base btn-etc">리스트초기화</button>
        </div>
      </div>

      {/* 🔍 조회 조건 테이블 */}
      <table className="form-table">
        <thead>
            <tr className="form-tr">
            <th className="form-th w-[80px] !text-center">구분</th>
            <th className="form-th w-[150px] !text-center">업체명</th>
            <th className="form-th w-[80px] !text-center">등급</th>
            <th className="form-th w-[80px] !text-center">직책</th>
            <th className="form-th w-[100px] !text-center">이름</th>
            <th className="form-th w-[80px] !text-center">M/M</th>
            <th className="form-th w-[100px] !text-center">단가</th>
            <th className="form-th w-[120px] !text-center">직접인건비</th>
            <th className="form-th w-[80px] !text-center">매출(%)</th>
            <th className="form-th w-[100px] !text-center">공급단가</th>
            <th className="form-th w-[100px] !text-center">공급가</th>
            <th className="form-th w-[100px] !text-center">매출이익</th>
            <th className="form-th w-[80px] !text-center">Infra</th>
            <th className="form-th w-[100px] !text-center">비고</th>
            </tr>
        </thead>
        <tbody>
            <tr className="form-tr">
            <td className="form-td">
                <select className="combo-base w-full">
                <option>자사</option>
                <option>외주</option>
                </select>
            </td>
            <td className="form-td">
                <select className="combo-base w-full">
                <option>부뜰정보시스템</option>
                </select>
            </td>
            <td className="form-td">
                <select className="combo-base w-full">
                <option>초급</option>
                <option>중급</option>
                <option>고급</option>
                </select>
            </td>
            <td className="form-td">
                <select className="combo-base w-full">
                <option>사원</option>
                <option>대리</option>
                <option>과장</option>
                </select>
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full" />
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full text-right" />
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full text-right" defaultValue="5,300,000" />
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full text-right" readOnly />
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full text-right" readOnly />
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full text-right" readOnly />
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full text-right" readOnly />
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full text-right" readOnly />
            </td>
            <td className="form-td">
                <select className="combo-base w-full">
                <option>No</option>
                <option>Yes</option>
                </select>
            </td>
            <td className="form-td">
                <input className="input-base input-default w-full" />
            </td>
            </tr>
        </tbody>
    </table>

      {/* 📋 직접인건비 테이블 */}
      <div className="gridbox-div mt-4">
        <table className="grid-table text-center">
          <thead>
            <tr>
              <th className="grid-th">구분</th>
              <th className="grid-th">업체명</th>
              <th className="grid-th">등급</th>
              <th className="grid-th">직책</th>
              <th className="grid-th">이름</th>
              <th className="grid-th">M/M</th>
              <th className="grid-th">단가</th>
              <th className="grid-th">직접인건비</th>
              <th className="grid-th">매출이익(%)</th>
              <th className="grid-th">공급단가</th>
              <th className="grid-th">공급가</th>
              <th className="grid-th">매출이익</th>
              <th className="grid-th">Infra</th>
              <th className="grid-th">비고</th>
            </tr>
          </thead>
          <tbody>
            {/* 🔹 일반 데이터 */}
            <tr className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
              <td className="grid-td">자사</td>
              <td className="grid-td">부뜰정보시스템</td>
              <td className="grid-td">특급</td>
              <td className="grid-td">부장</td>
              <td className="grid-td">최인호</td>
              <td className="grid-td">12</td>
              <td className="grid-td">10,000,000</td>
              <td className="grid-td">120,000,000</td>
              <td className="grid-td">4.8</td>
              <td className="grid-td">10,500,000</td>
              <td className="grid-td">126,000,000</td>
              <td className="grid-td">6,000,000</td>
              <td className="grid-td">N</td>
              <td className="grid-td">CS VoiceNet 운영</td>
            </tr>
            <tr className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
              <td className="grid-td">자사</td>
              <td className="grid-td">부뜰정보시스템</td>
              <td className="grid-td">중급</td>
              <td className="grid-td">대리</td>
              <td className="grid-td">서연희</td>
              <td className="grid-td">10</td>
              <td className="grid-td">6,770,000</td>
              <td className="grid-td">67,700,000</td>
              <td className="grid-td">28.7</td>
              <td className="grid-td">9,500,000</td>
              <td className="grid-td">95,000,000</td>
              <td className="grid-td">27,300,000</td>
              <td className="grid-td">N</td>
              <td className="grid-td">CS VoiceNet 운영</td>
            </tr>

            {/* 🔹 소계1 */}
            <tr className="grid-tr font-bold even:bg-[#F9FCFF] hover:bg-blue-50">
              <td className="grid-td text-red-600">소계</td>
              <td className="grid-td" colSpan={5}></td>
              <td className="grid-td text-red-600">-</td>
              <td className="grid-td text-red-600">187,700,000</td>
              <td className="grid-td text-red-600">15.1</td>
              <td className="grid-td text-red-600">-</td>
              <td className="grid-td text-red-600">221,000,000</td>
              <td className="grid-td text-red-600">33,300,000</td>
              <td className="grid-td"></td>
              <td className="grid-td"></td>
            </tr>

            {/* 🔹 소계2 */}
            <tr className="grid-tr font-bold even:bg-[#F9FCFF] hover:bg-blue-50">
              <td className="grid-td text-red-600">소계</td>
              <td className="grid-td" colSpan={5}></td>
              <td className="grid-td text-red-600">0</td>
              <td className="grid-td text-red-600">0</td>
              <td className="grid-td text-red-600">0</td>
              <td className="grid-td text-red-600">0</td>
              <td className="grid-td text-red-600">0</td>
              <td className="grid-td text-red-600">0</td>
              <td className="grid-td"></td>
              <td className="grid-td"></td>
            </tr>

            {/* 🔹 합계 */}
            <tr className="grid-tr font-bold even:bg-[#F9FCFF] hover:bg-blue-50">
              <td className="grid-td text-blue-600">합계</td>
              <td className="grid-td" colSpan={5}></td>
              <td className="grid-td text-blue-600">22</td>
              <td className="grid-td text-blue-600">187,700,000</td>
              <td className="grid-td text-blue-600">15.1</td>
              <td className="grid-td text-blue-600">-</td>
              <td className="grid-td text-blue-600">221,000,000</td>
              <td className="grid-td text-blue-600">33,300,000</td>
              <td className="grid-td"></td>
              <td className="grid-td"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex gap-1 justify-end mt-2">
          <button className="btn-base btn-etc">신규</button>
          <button className="btn-base btn-etc">추가</button>
          <button className="btn-base btn-delete">행삭제</button>

      </div>


    </div>
  );
}
