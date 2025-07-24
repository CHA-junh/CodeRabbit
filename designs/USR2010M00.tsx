'use client';

import React from 'react';
import './common.css';

export default function UserRoleManagementPage() {
  return (
    <div className="mdi">
      {/* 상단 검색 영역 */}
      <div className="search-div mb-4">
        <table className="search-table">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[70px]">본부</th>
              <td className="search-td w-[180px]">
                <select className="combo-base">
                  <option>전체</option>
                </select>
              </td>
              <th className="search-th w-[70px]">부서</th>
              <td className="search-td w-[180px]">
                <select className="combo-base">
                  <option>전체</option>
                </select>
              </td>
              <th className="search-th w-[90px]">사용자명</th>
              <td className="search-td w-[180px]">
                <input type="text" className="input-base input-default" />
              </td>
              <td className="search-td text-right" colSpan={2}>
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 사용자 목록 그리드 */}
      <div className="gridbox-div mb-4">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th">사번</th>
              <th className="grid-th">성명</th>
              <th className="grid-th">본부명</th>
              <th className="grid-th">부서명</th>
              <th className="grid-th">직급명</th>
              <th className="grid-th">직책구분</th>
              <th className="grid-th">사용자 권한</th>
              <th className="grid-th">승인결재자</th>
              <th className="grid-th">사업</th>
              <th className="grid-th">추진비</th>
              <th className="grid-th">인사/복리</th>
            </tr>
          </thead>
          <tbody>
            <tr className="grid-tr">
              <td className="grid-td">10001</td>
              <td className="grid-td">김철수</td>
              <td className="grid-td">전략기획실(25)</td>
              <td className="grid-td">전략기획</td>
              <td className="grid-td">전무</td>
              <td className="grid-td">본부장</td>
              <td className="grid-td">본부장이상</td>
              <td className="grid-td">신승재</td>
              <td className="grid-td"><input type="checkbox" checked readOnly /></td>
              <td className="grid-td"><input type="checkbox" checked readOnly /></td>
              <td className="grid-td"><input type="checkbox" checked readOnly /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 하단: 등록/수정 영역과 업무권한 테이블을 가로 배치 */}
      <div className="flex gap-4 items-start">
        {/* 왼쪽: 업무권한 타이틀 + 테이블 */}
        <div className="w-[30%]">
          <div className="tit_area">
            <h2>업무별 사용권한</h2>
          </div>
          <div className="gridbox-div">
            <table className="grid-table">
              <thead>
                <tr>
                  <th className="grid-th">업무구분</th>
                  <th className="grid-th w-[70px]">사용권한</th>
                  <th className="grid-th">비고</th>
                </tr>
              </thead>
              <tbody>
                {[
                  '사업관리',
                  '프로젝트관리',
                  '업무추진비관리',
                  '인사관리',
                  '시스템관리',
                ].map((task, idx) => (
                  <tr className="grid-tr" key={idx}>
                    <td className="grid-td">{task}</td>
                    <td className="grid-td text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="grid-td"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 오른쪽: 사용자 등록 및 수정 */}
        <div className="flex-1">
          <div className="tit_area">
            <h2>사용자 등록 및 수정</h2>
          </div>
          <table className="form-table">
            <tbody>
              <tr className="form-tr">
                <th className="form-th w-[80px]">사번</th>
                <td className="form-td w-[200px]">
                  <input type="text" className="input-base input-default" />
                </td>
                <th className="form-th w-[80px]">성명</th>
                <td className="form-td !w-[150px]">
                  <input type="text" className="input-base input-default" />
                </td>
              </tr>
              <tr className="form-tr">
                <th className="form-th">직급</th>
                <td className="form-td">
                  <input type="text" className="input-base input-default" />
                </td>
                <th className="form-th">직책구분</th>
                <td className="form-td">
                  <select className="combo-base">
                    <option>본부장</option>
                    <option>부서장</option>
                  </select>
                </td>
              </tr>
              <tr className="form-tr">
                <th className="form-th">사용자권한</th>
                <td className="form-td">
                  <select className="combo-base">
                    <option>부서장</option>
                    <option>프로젝트PM</option>
                  </select>
                </td>
                <th className="form-th">승인결재자</th>
                <td className="form-td">
                  <select className="combo-base">
                    <option>이민재</option>
                    <option>허유범</option>
                  </select>
                </td>
              </tr>
              <tr className="form-tr">
                <th className="form-th">업무권한</th>
                <td className="form-td" colSpan={3}>
                  <div className="flex items-center gap-2 text-sm leading-none">
                    <select className="combo-base !w-[200px]">
                      <option>사업관리</option>
                      <option>프로젝트관리</option>
                      <option>업무추진비관리</option>
                      <option>인사관리</option>
                      <option>시스템관리</option>
                    </select>
                    <label className="ml-4 whitespace-nowrap">
                      <input type="radio" name="useYn" defaultChecked /> 부여
                    </label>
                    <label className="ml-2 whitespace-nowrap">
                      <input type="radio" name="useYn" /> 해제
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 하단 버튼 영역 */}
          <div className="flex justify-end mt-4">
            <button className="btn-base btn-etc mr-2">비밀번호 초기화</button>
            <button className="btn-base btn-act">저장</button>
          </div>
        </div>

      </div>
    </div>
  );
}
