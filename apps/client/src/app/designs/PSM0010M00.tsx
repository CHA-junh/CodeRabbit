'use client';

import React from 'react';
import './common.css';

export default function PSM0010M00() {
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-auto">
      {/* 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[100px]">자사 외주 구분</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>자사</option>
                  <option>외주</option>
                </select>
              </td>
              <th className="search-th w-[80px]">업체명</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>부뜰정보시스템</option>
                </select>
              </td>
              <th className="search-th w-[80px]">사원번호</th>
              <td className="search-td w-[150px]">
                <input type="text" className="input-base input-default w-full" defaultValue="10756" />
              </td>
              <th className="search-th w-[60px]">본부</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>SI 사업본부 (25)</option>
                </select>
              </td>
              <th className="search-th w-[60px]">부서</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>SI 1팀 (25)</option>
                </select>
              </td>
              <th className="search-th w-[60px]">직책</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>대리</option>
                </select>
              </td>
              <td></td>
            </tr>
            <tr className="search-tr">
              <th className="search-th w-[80px]">근무상태</th>
              <td className="search-td w-[150px]">
                <select className="combo-base w-full">
                  <option>재직중</option>
                </select>
              </td>
              <th className="search-th w-[80px]">입사일자</th>
              <td className="search-td w-[150px]">
                <input type="date" className="input-base input-default w-full" defaultValue="2025-06-25" />
              </td>
              <th className="search-th w-[80px]">퇴사일자</th>
              <td className="search-td w-[150px]">
                <input type="date" className="input-base input-default w-full" defaultValue="2025-06-25" />
              </td>
              <th className="search-th w-[80px]">재직년수</th>
              <td className="search-td w-[180px]" colSpan={2}>
                <div className="flex items-center gap-2">
                  <input type="text" className="input-base input-default !w-[50px] text-right" placeholder="00" />
                  <span className="m-1">년</span>
                  <input type="text" className="input-base input-default !w-[50px] text-right" placeholder="00" />
                  <span className="m-1">월</span>
                </div>
              </td>
              <td className="search-td text-right" colSpan={4}>
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* 정보 입력 폼 */}
      <div className="flex gap-4">
        {/* 개인 정보 */}
        <div className="w-1/2">
          <div className="tit_area"><h3>개인 정보</h3></div>
          <div className="clearbox-div">
            <table className="clear-table">
              <tbody>
                <tr className="clear-tr">
                  <th className="clear-th">성명</th>
                  <td className="clear-td"><input className="input-base input-default w-full" defaultValue="김부뜰" /></td>
                  <th className="clear-th">최종학력</th>
                  <td className="clear-td">
                    <select className="combo-base w-full"><option>학사</option></select>
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">영문 성명</th>
                  <td className="clear-td"><input className="input-base input-default w-full" defaultValue="Kim buttle" /></td>
                  <th className="clear-th">학교</th>
                  <td className="clear-td"><input className="input-base input-default w-full" defaultValue="부뜰대학교" /></td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">성별</th>
                  <td className="clear-td">
                    <select className="combo-base w-full"><option>남자</option></select>
                  </td>
                  <th className="clear-th">전공</th>
                  <td className="clear-td"><input className="input-base input-default w-full" defaultValue="부뜰과" /></td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">국적</th>
                  <td className="clear-td">
                    <select className="combo-base w-full"><option>내국인</option></select>
                  </td>
                  <th className="clear-th">졸업일자</th>
                  <td className="clear-td"><input type="date" className="input-base input-calender" defaultValue="2025-06-25" /></td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">주민등록번호</th>
                  <td className="clear-td"><input className="input-base input-default w-full" defaultValue="000000-0000000" /></td>
                  <th className="clear-th">생년월일</th>
                  <td className="clear-td"><input type="date" className="input-base input-calender" defaultValue="2025-06-25" /></td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">휴대전화</th>
                  <td className="clear-td"><input className="input-base input-default w-full" defaultValue="010-1234-1234" /></td>
                  <th className="clear-th">자택전화</th>
                  <td className="clear-td"><input className="input-base input-default w-full" defaultValue="02-1234-1234" /></td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">E-Mail</th>
                  <td className="clear-td" colSpan={3}><input className="input-base input-default w-full" defaultValue="buttle@buttle.co.kr" /></td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">주소</th>
                  <td className="clear-td" colSpan={3}>
                    <div className="flex gap-1">
                      <input className="input-base input-default flex-1" defaultValue="서울시 부뜰구 부뜰로" disabled />
                      <input className="input-base input-default flex-1" defaultValue="부뜰아파트 101호" disabled />
                      <button className="btn-base btn-act">찾기</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 프로젝트 정보 */}
        <div className="w-1/2">
          <div className="tit_area"><h3>프로젝트 정보</h3></div>
          <div className="clearbox-div">
            <table className="clear-table">
              <tbody>
                <tr className="clear-tr">
                  <th className="clear-th">기준 정보</th>
                  <td className="clear-td" colSpan={3}>
                    <div className="flex gap-4">
                      <label><input type="radio" name="projType" /> 기술자격</label>
                      <label><input type="radio" name="projType" /> 학력정보</label>
                    </div>
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">자격증</th>
                  <td className="clear-td">
                    <select className="combo-base w-full"><option>정보처리기사</option></select>
                  </td>
                  <th className="clear-th">자격증 취득일자</th>
                  <td className="clear-td"><input type="date" className="input-base input-calender" defaultValue="2025-06-25" /></td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">최초 투입일자</th>
                  <td className="clear-td"><input type="date" className="input-base input-calender" defaultValue="2025-06-25" /></td>
                  <th className="clear-th">최종 철수일자</th>
                  <td className="clear-td"><input type="date" className="input-base input-calender" defaultValue="2025-06-25" /></td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">입사 전 경력</th>
                  <td className="clear-td">
                    <div className="flex gap-1">
                      <input className="input-base input-default !w-[50px] text-right" placeholder="00" />
                      <span>년</span>
                      <input className="input-base input-default !w-[50px] text-right" placeholder="00" />
                      <span>월</span>
                    </div>
                  </td>
                  <th className="clear-th">경력 개월 수</th>
                  <td className="clear-td">
                    <div className="flex gap-1">
                      <input className="input-base input-default !w-[50px] text-right" placeholder="00" />
                      <span>개월</span>
                    </div>
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th">계산 기준 일자</th>
                  <td className="clear-td"><input type="date" className="input-base input-calender" defaultValue="2025-06-25" /></td>
                  <th className="clear-th">기술등급</th>
                  <td className="clear-td">
                    <div className="flex gap-1">
                      <select className="combo-base w-full"><option>특급</option></select>
                      <button className="btn-base btn-act w-full">등급이력조회</button>
                    </div>
                  </td>
                </tr>
                <tr className="clear-tr">
                  <th className="clear-th align-top pt-2">비고</th>
                  <td className="clear-td" colSpan={3}><textarea className="textarea_def w-full" /></td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-[13px] text-[#00509A]">※ 조회만 가능합니다. 프로젝트 정보 수정은 경영지원본부 인사담당자만 가능합니다.</p>
              <div className="flex gap-2">
                <button className="btn-base btn-delete">삭제</button>
                <button className="btn-base btn-etc">신규</button>
                <button className="btn-base btn-act">저장</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
