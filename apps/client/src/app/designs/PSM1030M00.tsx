'use client';

import React from 'react';
import './common.css';

export default function PSM1030M00({ isTab }: { isTab?: boolean }) {
  return (
    <div className={`flex flex-col ${isTab ? 'flex-1 min-h-0' : 'h-full'} overflow-auto`}>
      {/* 조회 영역 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
            <tbody>
            <tr className="search-tr">
                <th className="search-th w-[80px]">업체명</th>
                <td className="search-td w-[160px]">
                <select className="combo-base w-full">
                    <option>부뜰정보시스템</option>
                </select>
                </td>

                <th className="search-th w-[80px]">사원번호</th>
                <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" defaultValue="10005" />
                </td>

                <th className="search-th w-[80px]">사원명</th>
                <td className="search-td w-[160px]">
                <input type="text" className="input-base input-default w-full" defaultValue="조병원" />
                </td>

                <th className="search-th w-[80px]">입사일자</th>
                <td className="search-td w-[160px]">
                <input type="date" className="input-base input-calender w-full" defaultValue="1998-01-10" />
                </td>

                <th className="search-th w-[80px]">퇴사일자</th>
                <td className="search-td w-[160px]">
                <input type="date" className="input-base input-calender w-full" />
                </td>
            </tr>

            <tr className="search-tr">
                <th className="search-th w-[80px]">본부</th>
                <td className="search-td w-[160px]">
                <select className="combo-base w-full">
                    <option>디지털영업본부(25)</option>
                </select>
                </td>

                <th className="search-th w-[80px]">부서</th>
                <td className="search-td w-[160px]">
                <select className="combo-base w-full">
                    <option>디지털영업본부(25)</option>
                </select>
                </td>

                <th className="search-th w-[80px]">직책</th>
                <td className="search-td w-[160px]">
                <select className="combo-base w-full">
                    <option>직책</option>
                </select>
                </td>

                <th className="search-th w-[80px]">근무상태</th>
                <td className="search-td ">
                <select className="combo-base !w-[150px]">
                    <option>재직</option>
                </select>
                </td>
            </tr>
            </tbody>
        </table>
        </div>


        <div className="flex gap-4">
                {/* 인사발령내역 */}
        <div className="w-1/2 flex flex-col">
          <div className="tit_area">
            <h3>인사발령내역</h3>
          </div>
          <div className="gridbox-div flex-1 grid-scroll">
            <table className="grid-table">
              <thead>
                <tr className="grid-tr">
                  <th className="grid-th">No</th>
                  <th className="grid-th">구분</th>
                  <th className="grid-th">발령일자</th>
                  <th className="grid-th">본부</th>
                  <th className="grid-th">부서</th>
                  <th className="grid-th">직책</th>
                  <th className="grid-th">비고</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5,6].map((i) => (
                  <tr className="grid-tr" key={i}>
                    <td className="grid-td">{i}</td>
                    <td className="grid-td">{i % 2 === 0 ? '이동' : '승진'}</td>
                    <td className="grid-td">2025/01/17</td>
                    <td className="grid-td">디지털영업본부</td>
                    <td className="grid-td">디지털영업본부</td>
                    <td className="grid-td">전무</td>
                    <td className="grid-td">비고 내용</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[#00509A] py-1">
            ※ 2010년 이전 발령건은 발령내용 등 포함여부 차이로 사실과 다릅니다.
          </p>
        </div>

        {/* 인사발령등록 */}
        <div className="w-1/2 flex flex-col">
            <div className="tit_area">
            <h3>인사발령등록</h3>
            </div>
            <div className="flex-1">
            <table className="form-table">
                <tbody>
                <tr className="form-tr">
                    <th className="form-th w-[100px]">발령구분</th>
                    <td className="form-td">
                    <select className="combo-base w-full">
                        <option>승진</option>
                    </select>
                    </td>
                    <th className="form-th w-[100px]">발령일자</th>
                    <td className="form-td">
                    <input type="date" className="input-base input-default w-full" />
                    </td>
                </tr>
                <tr className="form-tr">
                    <th className="form-th">발령본부</th>
                    <td className="form-td">
                    <select className="combo-base w-full">
                        <option>디지털영업본부</option>
                    </select>
                    </td>
                    <th className="form-th">발령부서</th>
                    <td className="form-td">
                    <select className="combo-base w-full">
                        <option>디지털영업본부</option>
                    </select>
                    </td>
                </tr>
                <tr className="form-tr">
                    <th className="form-th">발령직위</th>
                    <td className="form-td">
                    <select className="combo-base w-full">
                        <option>전무</option>
                    </select>
                    </td>
                    <th className="form-th align-top pt-2">비고</th>
                    <td className="form-td" rowSpan={2}>
                    <textarea className="textarea_def w-full min-h-[80px]" />
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="flex justify-end mt-2 gap-2">
                <button className="btn-base btn-etc">신규</button>
                <button className="btn-base btn-act">저장</button>
                <button className="btn-base btn-delete">삭제</button>
            </div>
            </div>
        </div>
        </div>

    </div>
  );
}