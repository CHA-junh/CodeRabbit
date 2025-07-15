'use client';

import React from 'react';
import './common.css';
import PageTitle from './PageTitle';

export default function SearchSection() {
  <PageTitle programId="SYS1000M00" title="프로그램관리" />
  const data = [
    {
      id: 'USR_0001',
      name: '사용자 관리',
      type: '화면',
      category: '기본정보',
      useYn: '사용',
      popupWidth: '800',
      popupHeight: '600',
      popupTop: '100',
      popupLeft: '100',
    },
    // 필요 시 추가
  ];

  return (
    <div className="mdi">
      {/* 조회부 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[131px]">프로그램ID/명</th>
              <td className="search-td w-[20%]">
                <input type="text" className="input-base input-default w-full" />
              </td>

              <th className="search-th w-[126px]">프로그램구분</th>
              <td className="search-td w-[10%]">
                <select className="combo-base w-full min-w-[100px]">
                  <option>전체</option>
                  <option>화면</option>
                  <option>팝업</option>
                </select>
              </td>

              <th className="search-th w-[100px]">사용여부</th>
              <td className="search-td w-[10%]">
                <select className="combo-base w-full min-w-[80px]">
                  <option>사용</option>
                  <option>미사용</option>
                </select>
              </td>

              <th className="search-th w-[100px]">업무구분</th>
              <td className="search-td w-[10%]">
                <select className="combo-base w-full min-w-[100px]">
                  <option>전체</option>
                </select>
              </td>

              <td className="search-td text-right" colSpan={1}>
                <button type="button" className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="tit_area">
        <h3>프로그램목록</h3>
      </div>
      {/* 그리드 영역 */}
      <div className="gridbox-div mb-4 ">
        <div className="grid-scroll-wrap max-h-[450px]">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th" rowSpan={2}>No</th>
                <th className="grid-th" rowSpan={2}>프로그램ID</th>
                <th className="grid-th" rowSpan={2}>프로그램명</th>
                <th className="grid-th" rowSpan={2}>프로그램구분</th>
                <th className="grid-th" rowSpan={2}>업무구분</th>
                <th className="grid-th" rowSpan={2}>사용여부</th>
                <th className="grid-th" colSpan={2}>팝업크기</th>
                <th className="grid-th" colSpan={2}>팝업위치</th>
              </tr>
              <tr>
                <th className="grid-th">width</th>
                <th className="grid-th">height</th>
                <th className="grid-th">top</th>
                <th className="grid-th">left</th>
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
                  <td className="grid-td">{item.useYn}</td>
                  <td className="grid-td">{item.popupWidth}</td>
                  <td className="grid-td">{item.popupHeight}</td>
                  <td className="grid-td">{item.popupTop}</td>
                  <td className="grid-td">{item.popupLeft}</td>
                </tr>
                
                
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tit_area">
        <h3>프로그램 정보</h3>
      </div>
      <table className="form-table mb-4">
        <tbody>
          {/* 1행 */}
          <tr className="form-tr">
            <th className="form-th required">프로그램ID</th>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <th className="form-th required">프로그램명</th>
            <td className="form-td"><input type="text" className="input-base input-default w-full" /></td>
            <th className="form-th required">프로그램구분</th>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>선택</option>
              </select>
            </td>
            <th className="form-th">업무구분</th>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>선택</option>
              </select>
            </td>
          </tr>

          {/* 2행 */}
          <tr className="form-tr">
            <th className="form-th required">파일경로</th>
            <td className="form-td" colSpan={5}>
              <input type="text" className="input-base input-default w-full" />
            </td>
            <th className="form-th required">사용여부</th>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>선택</option>
              </select>
            </td>
          </tr>

          {/* 3행 */}
          <tr className="form-tr">
            <th className="form-th">팝업넓이(width)</th>
            <td className="form-td">
              <input type="text" className="input-base input-default w-full" />
            </td>
            <th className="form-th">팝업높이(height)</th>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>선택</option>
              </select>
            </td>
            <th className="form-th">팝업위치(top)</th>
            <td className="form-td">
              <input type="text" className="input-base input-default w-full" />
            </td>
            <th className="form-th">팝업위치(left)</th>
            <td className="form-td">
              <input type="text" className="input-base input-default w-full" />
            </td>
          </tr>

          {/* 4행 */}
          <tr className="form-tr">
            <th className="form-th">대상 MDI</th>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>선택</option>
              </select>
            </td>
            <th className="form-th">크기조절 사용</th>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>선택</option>
              </select>
            </td>
            <th className="form-th">팝업전환 사용</th>
            <td className="form-td">
              <select className="combo-base w-full">
                <option>선택</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex gap-2 justify-end">
        <button className="btn-base btn-etc">미리보기</button>
        <button className="btn-base btn-etc">신규</button>
        <button className="btn-base btn-act">저장</button>
      </div>








    </div>
  );
}
