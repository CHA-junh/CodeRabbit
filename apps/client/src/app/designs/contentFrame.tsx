'use client';

import React from 'react';
import './common.css';

export default function SearchSection() {


  return (
    <div className="mdi">
      {/* 조회부 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[120px]">그룹명/코드</th>
              <td className="search-td w-[20%]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <th className="search-th w-[100px]">사용여부</th>
              <td className="search-td w-[10%]">
                <select className="combo-base w-full min-w-[80px]">
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
      
     <div className="flex w-full h-[600px] gap-4">
  {/* 왼쪽: 프로그램 그룹 목록 */}
  <div className="w-1/2 overflow-hidden flex flex-col">
    <div className="tit_area px-2 py-1">프로그램 그룹 목록</div>
    <div className="flex-1 overflow-auto">
      <table className="grid-table w-full">
        <thead>
          <tr>
            <th className="grid-th">No</th>
            <th className="grid-th">그룹코드</th>
            <th className="grid-th">그룹명</th>
            <th className="grid-th">복사</th>
            <th className="grid-th">사용여부</th>
          </tr>
        </thead>
        <tbody>
          {/* map 출력 자리 */}
        </tbody>
      </table>
    </div>

    {/* 하단 입력 폼 */}
    <div className="box-wrap mt-2">
      <div className="tit_area">
        <h3>프로그램 그룹 정보</h3>
      </div>
      <table className="form-table w-full mb-4">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[130px]">*프로그램 그룹명</th>
            <td className="form-td">
              <input className="input-base input-default" />
            </td>
            <th className="form-th w-[130px]">*사용여부</th>
            <td className="form-td">
              <input className="input-base input-default" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="flex gap-2 justify-end">
      <button className="btn-base btn-etc">신규</button>
      <button className="btn-base btn-act">저장</button>
    </div>


  </div>

  {/* 오른쪽: 프로그램 목록 */}
  <div className="w-1/2 overflow-hidden flex flex-col">
    <div className="tit_area px-2 py-1">프로그램 목록</div>
    <div className="flex-1 overflow-auto">
      <table className="grid-table w-full">
        <thead>
          <tr>
            <th className="grid-th">No</th>
            <th className="grid-th"></th>
            <th className="grid-th">프로그램ID</th>
            <th className="grid-th">프로그램명</th>
            <th className="grid-th">업무</th>
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
    <div className="flex gap-2 justify-end">
      <button className="btn-base btn-delete">삭제</button>
      <button className="btn-base btn-etc">추가</button>
    </div>
    </div>
    </div>
    </div>
  );
}
