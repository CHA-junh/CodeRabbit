'use client';

import React from 'react';
import './common.css';
import PageTitle from './PageTitle';

export default function SearchSection() {
  
  const data = [
    {
      no: 1,
      start: '2025/01',
      end: '2025/07',
      months: 6,
      project: '통신장비 재설정 리뉴얼',
      client: 'KB국민은행',
      role: '개발',
      env: 'java',
      code: '010-1234-1234',
      regDate: '2025/01',
      writer: '김부뜰',
      memo: '',
    },
    {
      no: 2,
      start: '2025/02',
      end: '2025/04',
      months: 2,
      project: '웹 고도화',
      client: '신한은행',
      role: '개발',
      env: 'java',
      code: '010-1234-1234',
      regDate: '2025/02',
      writer: '이부뜰',
      memo: '',
    },
  ];

  return (
    <div className="mdi">
      <PageTitle programId="PSM0050M00" title="프로파일관리" />
      {/* 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            {/* 1행 */}
            <tr className="search-tr">
              <th className="search-th">사원명</th>
              <td className="search-td" colSpan={3}>
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default !w-[80px]" defaultValue="김부뜰" />
                  <img src="/icon_search_bk.svg" alt="search" className="w-4 h-4" />
                  <input type="text" className="input-base input-default !w-[100px]" />
                  <input type="text" className="input-base input-default" />
                </div>
              </td>

              <th className="search-th">소속/본부/부서</th>
              <td className="search-td">
                <input type="text" className="input-base input-default w-full" defaultValue="개발 / SI 3팀" />
              </td>

              <th className="search-th">입사일자</th>
              <td className="search-td">
                <input type="date" className="input-base input-calender min-w-[140px]" defaultValue="2025-06-25" />
              </td>

              <th className="search-th">퇴사일자</th>
              <td className="search-td">
                <input type="date" className="input-base input-calender min-w-[140px]" defaultValue="2025-06-25" />
              </td>

              <td></td>
            </tr>

            {/* 2행 */}
            <tr className="search-tr">
              <th className="search-th">학력/전공</th>
              <td className="search-td">
                <input type="text" className="input-base input-default w-full" />
              </td>

              <th className="search-th">자격증/취득일</th>
              <td className="search-td">
                <input
                  type="text"
                  className="input-base input-default w-full"
                  defaultValue="정보처리기사 / 2025-07-09"
                />
              </td>

              <th className="search-th">재직년수</th>
              <td className="search-td">
                <div className="flex items-center gap-1">
                  <input type="text" className="input-base input-default !w-[50px] text-right" placeholder="00" />
                  <span className="m-0">년</span>
                  <input type="text" className="input-base input-default !w-[50px] text-right" placeholder="00" />
                  <span className="m-0">월</span>
                </div>
              </td>

              <th className="search-th">등급</th>
              <td className="search-td !w-[60px]">
                <input type="text" className="input-base input-default flex-1" />
              </td>

              <td colSpan={2}></td>

              <td className="text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 타이틀 영역 */}
      <div className="tit_area">
        <h3>개발 프로필 내역</h3>
        <div>
          <button type="button" className="btn-base btn-excel">엑셀</button>
        </div>
      </div>

      {/* 그리드 영역 */}
      <div className="gridbox-div mb-4">
        <div className="grid-scroll-wrap ">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th" rowSpan={2}>NO</th>
                <th className="grid-th" colSpan={3}>개발기간</th>
                <th className="grid-th" rowSpan={2}>프로젝트명</th>
                <th className="grid-th" rowSpan={2}>고객사</th>
                <th className="grid-th" rowSpan={2}>담당업무</th>
                <th className="grid-th" rowSpan={2}>개발환경/DBMS/언어</th>
                <th className="grid-th" rowSpan={2}>사업번호</th>
                <th className="grid-th" colSpan={2}>최종작성</th>
                <th className="grid-th" rowSpan={2}>비고</th>
              </tr>
              <tr>
                <th className="grid-th">시작년월</th>
                <th className="grid-th">종료년월</th>
                <th className="grid-th">개월수</th>
                <th className="grid-th">등록일</th>
                <th className="grid-th">등록자</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                  <td className="grid-td">{item.no}</td>
                  <td className="grid-td">{item.start}</td>
                  <td className="grid-td">{item.end}</td>
                  <td className="grid-td">{item.months}</td>
                  <td className="grid-td">{item.project}</td>
                  <td className="grid-td">{item.client}</td>
                  <td className="grid-td">{item.role}</td>
                  <td className="grid-td">{item.env}</td>
                  <td className="grid-td">{item.code}</td>
                  <td className="grid-td">{item.regDate}</td>
                  <td className="grid-td">{item.writer}</td>
                  <td className="grid-td">{item.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      

      {/* 테이블 영역 */}
      <div className="box-wrap ">
          <div classNAme="tit_area">
            <h3>프로필 경력</h3>
          </div>
      {/* 테이블 */}
      <table className="form-table w-full mb-4">
        <tbody>
          {/* 1행: 학력 기준 */}
          <tr className="form-tr">
            <th className="form-th w-[130px]">학력기준</th>
            <td className="form-td w-[250px]">
              입사 전 경력
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />년
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />월
            </td>
            <td className="form-td w-[250px]">
              입사 후 경력
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />년
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />월
            </td>
            <td className="form-td">
              합계
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />년
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />월
            </td>
          </tr>
          {/* 2행: 기술자격 기준 */}
          <tr className="form-tr">
            <th className="form-th w-[130px]">기술자격기준</th>
            <td className="form-td">
              입사 전 경력
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />년
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />월
            </td>
            <td className="form-td">
              입사 후 경력
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />년
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />월
            </td>
            <td className="form-td">
              합계
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />년
              <input type="text" className="input-base input-default !w-[50px] text-center mx-1" />월
            </td>
          </tr>
        </tbody>
      </table>



      <div className="tit_area">
        <h3>프로필 작성</h3>
        <div>
          <button className="btn-base btn-act">투입내역 불러오기</button>
        </div>
      </div>

     {/* 그리드 영역 */}
      <div className="gridbox-div mb-4">
        <div className="grid-scroll-wrap">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th" >시작일자</th>
                <th className="grid-th" >종료일자</th>
                <th className="grid-th" >프로젝트명</th>
                <th className="grid-th" >고객사</th>
                <th className="grid-th" >담당업무</th>
                <th className="grid-th" >개발환경/DBMS/언어</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                  <td className="grid-td">{item.start}</td>
                  <td className="grid-td">{item.end}</td>
                  <td className="grid-td">{item.project}</td>
                  <td className="grid-td">{item.client}</td>
                  <td className="grid-td">{item.role}</td>
                  <td className="grid-td">{item.env}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2 mt-2">
        <button className="btn-base btn-delete">삭제</button>
        <button className="btn-base btn-etc">신규</button>
        <button className="btn-base btn-act">저장</button>
      </div>

      </div>
    </div>
  );
}
