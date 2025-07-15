'use client';

import React from 'react';
import './common.css';

export default function RoleManagementPage() {
  <PageTitle programId="SYS1010D00" title="프로그램 찾기" />
  // ✅ 더미 데이터 선언
  const data = [
    {
      id: 'PGM001',
      name: '회원관리',
      type: '화면',
      category: '업무',
      useYn: '사용',
      popupWidth: '800',
      popupHeight: '600',
      popupTop: '100',
      popupLeft: '200',
    },
    {
      id: 'PGM002',
      name: '로그관리',
      type: '팝업',
      category: '시스템',
      useYn: '미사용',
      popupWidth: '600',
      popupHeight: '400',
      popupTop: '150',
      popupLeft: '300',
    },
  ];

  return (
    <div className="mdi">
      
      {/* 🔍 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[130px]">프로그램 ID명</th>
              <td className="search-td w-[20%]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <th className="search-th w-[100px]">구분</th>
              <td className="search-td w-[10%]">
                <select className="combo-base w-full min-w-[80px]">
                  <option>선택</option>
                  <option>123</option>
                  <option>123</option>
                </select>
              </td>
              <th className="search-th w-[100px]">업무</th>
              <td className="search-td w-[10%]">
                <select className="combo-base w-full min-w-[80px]">
                  <option>선택</option>
                  <option>123</option>
                  <option>123</option>
                </select>
              </td>
              <td className="search-td text-right" colSpan={1}>
                <button type="button" className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📋 타이틀 */}
      <div className="tit_area">
        <h3>프로그램목록</h3>
      </div>

      {/* 📊 그리드 영역 */}
      <div className="gridbox-div mb-4 ">
        <div className="grid-scroll-wrap max-h-[450px]">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[40px]" >No</th>
                <th className="grid-th" >프로그램ID</th>
                <th className="grid-th" >프로그램명</th>
                <th className="grid-th" >프로그램구분</th>
                <th className="grid-th" >업무구분</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                  <td className="grid-td">{i + 1}</td>
                  <td className="grid-td">{item.id}</td>
                  <td className="grid-td">{item.name}</td>
                  <td className="grid-td">{item.type}</td>
                  <td className="grid-td">{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⬇ 하단 버튼 */}
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" className="btn-base btn-act">추가</button>
      </div>
    </div>
  );
}
