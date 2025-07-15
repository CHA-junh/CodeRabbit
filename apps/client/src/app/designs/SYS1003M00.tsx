'use client';

import React from 'react';
import './common.css';

export default function RoleManagementPage() {
  <PageTitle programId="SYS1003M00" title="사용자역할관리" />
  return (
    <div className="mdi">
      
      {/* 🔍 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[130px]">사용자역할코드명</th>
              <td className="search-td w-[20%]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <th className="search-th w-[100px]">사용여부</th>
              <td className="search-td w-[10%]">
                <select className="combo-base w-full min-w-[80px]">
                  <option>전체</option>
                  <option>사용</option>
                  <option>미사용</option>
                </select>
              </td>
              <td className="search-td text-right" colSpan={1}>
                <button type="button" className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📋 좌우 2단 */}
      <div className="flex gap-4 flex-1 overflow-auto">
        {/* ◀ 좌측 */}
        <div className="w-1/2 flex flex-col">
          <div className="tit_area mb-2">
            <h3>사용자역할 목록</h3>
          </div>
          <div className="gridbox-div flex-1 overflow-auto">
            <table className="grid-table w-full">
              <thead>
                <tr>
                  <th className="grid-th w-[50px]">No</th>
                  <th className="grid-th">사용자역할코드</th>
                  <th className="grid-th">사용자역할명</th>
                  <th className="grid-th">메뉴</th>
                  <th className="grid-th">사용여부</th>
                  <th className="grid-th">사용자수</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="grid-td text-center" colSpan={6}>
                    조회된 정보가 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ▶ 우측 */}
        <div className="w-1/2 flex flex-col">
          {/* 사용자역할 정보 */}
          <div className="tit_area mb-2">
            <h3>사용자역할 정보</h3>
          </div>
          <table className="form-table mb-2">
            <tbody>
              <tr className="form-tr">
                <th className="form-th required w-[120px]">사용자역할명</th>
                <td className="form-td">
                  <input type="text" className="input-base input-default w-full" />
                </td>
                <th className="form-th required w-[100px]">사용여부</th>
                <td className="form-td">
                  <select className="combo-base w-full">
                    <option>사용</option>
                    <option>미사용</option>
                  </select>
                </td>
                <th className="form-th w-[80px]">등급</th>
                <td className="form-td">
                  <select className="combo-base w-full">
                    <option>선택</option>
                  </select>
                </td>
              </tr>
              <tr className="form-tr">
                <th className="form-th">조직조회범위</th>
                <td className="form-td">
                  <select className="combo-base w-full">
                    <option>선택</option>
                  </select>
                </td>
                <th className="form-th required">메뉴</th>
                <td className="form-td">
                  <select className="combo-base w-full">
                    <option>선택</option>
                  </select>
                </td>
                <th className="form-th">기본출력화면</th>
                <td className="form-td">
                  <input type="text" className="input-base input-default w-full" />
                </td>
              </tr>
            </tbody>
          </table>

          {/* ➕ 버튼 영역 */}
          <div className="flex justify-between items-center mb-2 px-1">
            <div></div>
            <div className="flex gap-1">
              <button type="button" className="btn-base btn-etc text-xs px-3 py-1">+ 추가</button>
              <button type="button" className="text-xl text-gray-400 px-2">×</button>
            </div>
          </div>

          {/* 프로그램 그룹 목록 */}
          <div className="tit_area mb-2">
            <h3>사용자역할 프로그램그룹 목록</h3>
          </div>
          <div className="gridbox-div flex-1 overflow-auto">
            <table className="grid-table w-full">
              <thead>
                <tr>
                  <th className="grid-th w-[50px]">No</th>
                  <th className="grid-th">프로그램그룹 코드</th>
                  <th className="grid-th">프로그램그룹명</th>
                  <th className="grid-th">사용여부</th>
                  <th className="grid-th">사용자수</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="grid-td text-center" colSpan={5}>
                    조회된 정보가 없습니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ⬇ 하단 버튼 */}
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" className="btn-base btn-etc">역할복사</button>
        <button type="button" className="btn-base btn-etc">신규</button>
        <button type="button" className="btn-base btn-act">저장</button>
      </div>
    </div>
  );
}
