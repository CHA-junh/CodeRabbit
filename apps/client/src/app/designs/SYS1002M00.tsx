'use client';

import React, { useState } from 'react';
import './common.css';
import PageTitle from './PageTitle';

export default function SearchSection() {
  <PageTitle programId="SYS1002M00" title="메뉴관리" />
  // 메뉴 리스트 더미 데이터
  const menuListData = [
    { no: 1, menuId: 'MNU001', menuName: '업무등록', useYn: '사용', userCount: 23, modifier: 'admin', modifiedAt: '2025-07-15 14:32' },
    { no: 2, menuId: 'MNU002', menuName: '업무조회', useYn: '미사용', userCount: 0, modifier: 'system', modifiedAt: '2025-07-14 09:15' },
    { no: 3, menuId: 'MNU003', menuName: '업무변경', useYn: '사용', userCount: 45, modifier: 'kimyh', modifiedAt: '2025-07-12 17:02' },
    { no: 4, menuId: 'MNU004', menuName: '사원관리', useYn: '사용', userCount: 12, modifier: 'leejae', modifiedAt: '2025-07-10 11:20' },
    { no: 5, menuId: 'MNU005', menuName: '개인정보수정', useYn: '미사용', userCount: 3, modifier: 'parkjh', modifiedAt: '2025-07-05 08:50' },
  ];

  // 메뉴 트리 데이터
  const menuTreeData = [
    { title: '업무관리', children: ['업무등록', '업무조회', '업무변경'] },
    { title: '프로젝트관리', children: ['프로젝트등록', '프로젝트현황'] },
    { title: '인사관리', children: ['사원관리', '개인정보수정', '프로파일관리'] },
    { title: '시스템관리', children: ['프로그램관리', '사용자관리', '메뉴관리'] },
  ];

  // 트리 오픈 상태
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleMenu = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="mdi">
      {/* 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[110px]">메뉴ID명</th>
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

      {/* 메뉴 목록 그리드 */}
      <div className="gridbox-div mb-4">
        <div className="grid-scroll-wrap max-h-[450px]">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th">No</th>
                <th className="grid-th">메뉴ID</th>
                <th className="grid-th">메뉴명</th>
                <th className="grid-th">사용여부</th>
                <th className="grid-th">사용자수</th>
                <th className="grid-th">변경자</th>
                <th className="grid-th">변경일시</th>
              </tr>
            </thead>
            <tbody>
              {menuListData.map((item) => (
                <tr key={item.menuId} className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                  <td className="grid-td">{item.no}</td>
                  <td className="grid-td">{item.menuId}</td>
                  <td className="grid-td">{item.menuName}</td>
                  <td className="grid-td">{item.useYn}</td>
                  <td className="grid-td text-right">{item.userCount}</td>
                  <td className="grid-td">{item.modifier}</td>
                  <td className="grid-td">{item.modifiedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 상세 입력 폼 */}
      <table className="form-table w-full mb-4">
        <tbody>
          <tr className="form-tr">
            <th className="form-th w-[130px] required">메뉴명</th>
            <td className="form-td w-[250px]">
              <input type="text" className="input-base input-default w-full" />
            </td>
            <th className="form-th w-[130px] required">사용여부</th>
            <td className="form-td w-[10%]">
              <select className="combo-base w-full min-w-[60px]">
                <option>전체</option>
                <option>사용</option>
                <option>미사용</option>
              </select>
            </td>
            <td className="form-td"></td>
          </tr>
        </tbody>
      </table>

      {/* 버튼 셋 */}
      <div className="flex gap-2 justify-end mb-4">
        <button type="button" className="btn-base btn-delete">메뉴삭제</button>
        <button type="button" className="btn-base btn-etc">복사저장</button>
        <button type="button" className="btn-base btn-etc">신규</button>
        <button type="button" className="btn-base btn-act">저장</button>
      </div>

      {/* 메뉴 트리 + 프로그램 정보 */}
      <div className="flex w-full h-[300px] gap-4 mt-4">
        {/* 좌측: 메뉴 트리 */}
        <div className="w-1/3 h-[300px]">
          <div className="tit_area flex justify-between items-center">
            <h3>메뉴 목록</h3>
            <div className="flex gap-1">
              <button type="button" className="text-xl text-gray-500">＋</button>
              <button type="button" className="text-xl text-gray-400">－</button>
            </div>
          </div>
          <div className="menu-tree-wrap">
            <ul className="menu-tree">
              {menuTreeData.map((menu, idx) => (
                <li key={idx}>
                  <div className="menu-title flex items-center gap-1 cursor-pointer" onClick={() => toggleMenu(idx)}>
                    <span>{openIndexes.includes(idx) ? '▼' : '▶'}</span>
                    {menu.title}
                  </div>
                  {openIndexes.includes(idx) && (
                    <ul className="menu-children pl-4">
                      {menu.children.map((child, cIdx) => (
                        <li key={cIdx} className="menu-child">{child}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 우측: 메뉴별 프로그램 */}
        <div className="w-2/3 flex flex-col">
          <div className="tit_area flex justify-between items-center">
            <h3>메뉴 별 프로그램</h3>
            <button type="button" className="btn-base btn-etc text-xs px-2 py-1">메뉴미리보기</button>
          </div>

          <div className="gridbox-div flex-1 overflow-auto">
            <table className="grid-table w-full">
              <thead>
                <tr>
                  <th className="grid-th">No</th>
                  <th className="grid-th"><input type="checkbox" /></th>
                  <th className="grid-th">구분</th>
                  <th className="grid-th">표시명</th>
                  <th className="grid-th">프로그램</th>
                  <th className="grid-th">찾기</th>
                  <th className="grid-th">사용여부</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="grid-td text-center" colSpan={7}>조회된 정보가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="btn-base btn-etc">찾기</button>
            <button type="button" className="btn-base btn-etc">추가</button>
            <button type="button" className="btn-base btn-delete">삭제</button>
            <button type="button" className="btn-base btn-act">저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
