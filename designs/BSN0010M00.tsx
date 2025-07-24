'use client';

import React from 'react';
import './common.css';

export default function BSN0010M00() {
    const data = [
    {
      code: 'PRJ2025-001',
      client: '삼성전자',
      name: 'AI 자동화 플랫폼 구축',
      period: '2025-05-01 ~ 2025-11-30',
      manager: '김영희',
      dept: '플랫폼팀',
      sales: '박진수',
      execDept: '개발1팀',
      pm: '홍길동',
      effortPlan: 100,
      effortUsed: 60,
      effortRemain: 40,
      status: '진행중',
    },
    {
      code: 'PRJ2025-002',
      client: 'LG CNS',
      name: 'ERP 고도화 사업',
      period: '2025-03-15 ~ 2025-09-30',
      manager: '이철수',
      dept: '전략사업팀',
      sales: '정하늘',
      execDept: '개발2팀',
      pm: '최유진',
      effortPlan: 80,
      effortUsed: 80,
      effortRemain: 0,
      status: '완료',
    },
    {
      code: 'PRJ2025-003',
      client: '카카오엔터프라이즈',
      name: '클라우드 이관',
      period: '2025-07-01 ~ 2026-01-15',
      manager: '서정우',
      dept: '클라우드팀',
      sales: '김성민',
      execDept: 'DevOps팀',
      pm: '조은비',
      effortPlan: 120,
      effortUsed: 40,
      effortRemain: 80,
      status: '진행중',
    },
  ];

  return (
    <div className="mdi">
      {/* ✅ 타이틀 영역 */}
      <div className="tit_area mb-3">
        <h3>사업진행현황</h3>
        <div>
          <button type="button" className="btn-base btn-act">신규사업번호등록</button>
        </div>
      </div>

      {/* ✅ 조회부 */}
      <div className="search-div mb-4">
        <table className="search-table">
          <tbody>
            {/* 1행: 시작일, 사업번호, 사업구분 */}
            <tr className="search-tr">
              <th className="search-th w-[110px]">사업시작일</th>
              <td className="search-td w-[180px]">
                <input type="date" className="input-base input-calender w-full" />
              </td>
              <th className="search-th w-[100px]">사업번호</th>
              <td className="search-td w-[180px]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <th className="search-th w-[100px]">사업구분</th>
              <td className="search-td w-[180px]">
                <select className="combo-base w-full">
                  <option value="">전체</option>
                  <option>내부</option>
                  <option>외부</option>
                </select>
              </td>
            </tr>

            {/* 2행: 조회구분, 본부, 추진부서 */}
            <tr className="search-tr">
              <th className="search-th">조회구분</th>
              <td className="search-td">
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="searchType" value="전체" defaultChecked /> 전체
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="searchType" value="사업부서" /> 사업부서
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="searchType" value="실행부서" /> 실행부서
                  </label>
                </div>
              </td>
              <th className="search-th">본부</th>
              <td className="search-td">
                <select className="combo-base w-full">
                  <option value="">전체</option>
                  <option>전략본부</option>
                  <option>기획본부</option>
                </select>
              </td>
              <th className="search-th">추진부서</th>
              <td className="search-td">
                <select className="combo-base w-full">
                  <option value="">전체</option>
                  <option>SW개발팀</option>
                  <option>플랫폼팀</option>
                </select>
              </td>
              <th className="search-th w-[110px]">영업대표</th>
              <td className="search-td w-[180px]">
                <select className="combo-base w-full">
                  <option value="">전체</option>
                  <option>홍길동</option>
                  <option>김영희</option>
                </select>
              </td>
              <td className="search-td"></td>
            </tr>

            {/* 3행: 진행상태 */}
            <tr className="search-tr">

              <th className="search-th align-top">진행상태</th>
              <td className="search-td align-top" colSpan={7}>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> 모두선택
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> 신규
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> 영업진행
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> 수주확정
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> 계약
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> 완료
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> 수주실패
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" /> 취소
                  </label>
                </div>
              </td>

              <td  className="text-right pt-2">
                <button type="button" className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ✅ 사업목록 타이틀 */}
      <div className="tit_area mb-2">
        <h3>사업목록</h3>
        <div className="flex gap-2">
          <button type="button" className="btn-base btn-etc">품의서작성</button>
          <button type="button" className="btn-base btn-etc">기본정보수정</button>
          <button type="button" className="btn-base btn-excel">엑셀</button>
        </div> 
      </div> 

      {/* ✅ 그리드 영역 */}
  <div className="gridbox-div">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th" rowSpan={2}>사업번호</th>
              <th className="grid-th" rowSpan={2}>수주처</th>
              <th className="grid-th" rowSpan={2}>사업명</th>
              <th className="grid-th" rowSpan={2}>사업기간</th>
              <th className="grid-th" rowSpan={2}>담당자</th>
              <th className="grid-th" rowSpan={2}>사업부서</th>
              <th className="grid-th" rowSpan={2}>영업대표</th>
              <th className="grid-th" rowSpan={2}>실행부서</th>
              <th className="grid-th" rowSpan={2}>PM</th>
              <th className="grid-th" colSpan={3}>공수</th>
              <th className="grid-th" rowSpan={2}>진행상태</th>
            </tr>
            <tr>
              <th className="grid-th">계획</th>
              <th className="grid-th">투입</th>
              <th className="grid-th">잔여</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                <td className="grid-td">{item.code}</td>
                <td className="grid-td">{item.client}</td>
                <td className="grid-td">{item.name}</td>
                <td className="grid-td">{item.period}</td>
                <td className="grid-td">{item.manager}</td>
                <td className="grid-td">{item.dept}</td>
                <td className="grid-td">{item.sales}</td>
                <td className="grid-td">{item.execDept}</td>
                <td className="grid-td">{item.pm}</td>
                <td className="grid-td">{item.effortPlan}</td>
                <td className="grid-td">{item.effortUsed}</td>
                <td className="grid-td">{item.effortRemain}</td>
                <td className="grid-td">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 