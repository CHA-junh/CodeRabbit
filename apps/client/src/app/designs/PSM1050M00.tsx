'use client';

import React from 'react';
import './common.css';

export default function PSM1050M00() {
  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">경력개월수 계산</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      {/* 본문 영역 */}
      <div className="popup-body">
        {/* 조회부 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr className="search-tr">
                <th className="search-th w-[80px]">구분</th>
                <td className="search-td w-[150px]">
                  <select className="combo-base w-full">
                    <option>자사</option>
                  </select>
                </td>
                <th className="search-th w-[80px]">성명</th>
                <td className="search-td w-[150px]">
                  <input type="text" className="input-base input-default w-full" defaultValue="권소연" />
                </td>
                <th className="search-th w-[80px]">입사일자</th>
                <td className="search-td w-[150px]">
                  <input type="date" className="input-base input-calender w-full" defaultValue="2013-03-04" />
                </td>
                <th className="search-th w-[80px]">최종학력</th>
                <td className="search-td w-[150px]">
                  <select className="combo-base w-full">
                    <option>학사</option>
                  </select>
                </td>
              </tr>
              <tr className="search-tr">
                <th className="search-th">자격증</th>
                <td className="search-td">
                  <select className="combo-base w-full">
                    <option>정보처리기사</option>
                  </select>
                </td>
                <th className="search-th">자격취득일</th>
                <td className="search-td">
                  <input type="date" className="input-base input-calender w-full" defaultValue="2012-11-23" />
                </td>
                <th className="search-th">최초투입일자</th>
                <td className="search-td">
                  <input type="date" className="input-base input-calender w-full" defaultValue="2013-03-04" />
                </td>
                <th className="search-th">최종철수일자</th>
                <td className="search-td">
                  <input type="date" className="input-base input-calender w-full" />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end mt-2">
            <button className="btn-base btn-act">계산</button>
          </div>
        </div>

        {/* 경력 테이블 */}
        <div className="mt-4">
          <div className="tit_area">
            <h3>
              경력 <span className="text-[13px] font-normal gap-2">(최초투입일에서 기준일(최종철수일자)까지의 개월수)</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="">기준일</div>
              <input type="date" className="input-base input-calender w-[150px]" defaultValue="2025-07-31" />
            </div>
          </div>

          <table className="form-table mt-2">
            <thead>
              <tr>
                <th className="form-th w-[160px]"></th>
                <th className="form-th !text-center">입사전 경력</th>
                <th className="form-th !text-center">입사후 경력</th>
                <th className="form-th !text-center">합계</th>
                <th className="form-th !text-center">기술등급</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="form-th text-left">학력기준</th>
                <td className="form-td">
                  <input className="input-base !w-[50px]" defaultValue="0" /> 년{' '}
                  <input className="input-base !w-[50px]" defaultValue="0" /> 개월
                </td>
                <td className="form-td">
                  <input className="input-base !w-[50px]" defaultValue="12" /> 년{' '}
                  <input className="input-base !w-[50px]" defaultValue="5" /> 개월
                </td>
                <td className="form-td">
                  <input className="input-base !w-[50px]" defaultValue="12" /> 년{' '}
                  <input className="input-base !w-[50px]" defaultValue="5" /> 개월
                </td>
                <td className="form-td">
                  <select className="combo-base w-full">
                    <option>특급</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th className="form-th text-left">기술자격기준</th>
                <td className="form-td">
                  <input className="input-base !w-[50px]" defaultValue="0" /> 년{' '}
                  <input className="input-base !w-[50px]" defaultValue="0" /> 개월
                </td>
                <td className="form-td">
                  <input className="input-base !w-[50px]" defaultValue="12" /> 년{' '}
                  <input className="input-base !w-[50px]" defaultValue="5" /> 개월
                </td>
                <td className="form-td">
                  <input className="input-base !w-[50px]" defaultValue="12" /> 년{' '}
                  <input className="input-base !w-[50px]" defaultValue="5" /> 개월
                </td>
                <td className="form-td">
                  <select className="combo-base w-full">
                    <option>특급</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>


          <div className="flex justify-between items-center mt-3">
            <p className="text-[13px] text-[#00509A] py-1">
              ※ [경력저장]버튼을 클릭하면 프로젝트 경력사항만 저장됩니다.
            </p>
            <div className="flex gap-2">
              <button className="btn-base btn-act">경력저장</button>
              <button className="btn-base btn-delete">취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}