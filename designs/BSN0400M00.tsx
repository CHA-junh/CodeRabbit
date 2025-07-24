'use client';

import React from 'react';
import './common.css';

export default function BSN0400M00() {
  return (
    <div className="mdi">
      {/* 🔷 타이틀 */}
      <div className="tit_area mb-3">
        <h3>실적관리</h3>
      </div>

      {/* 🔍 조회부 */}
      <div className="search-div mb-4">
        <table className="search-table w-full">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[100px]">사업번호</th>
              <td className="search-td w-[200px]">
                <div className="flex gap-1 items-center">
                  <input className="input-base input-default w-full" />
                  <button className="icon_btn icon_search" />
                </div>
              </td>
              <th className="search-th w-[100px]">사업명</th>
              <td className="search-td w-[30%]" colSpan={3}>
                <input className="input-base input-default w-full" />
              </td>
              <th className="search-th w-[100px]">사업기간</th>
              <td className="search-td">
                <div className="flex gap-2 items-center">
                  <input type="date" className="input-base input-calender" />
                  <span className="m-1">~</span>
                  <input type="date" className="input-base input-calender" />
                </div>
              </td>
            </tr>
            <tr className="search-tr">
              <th className="search-th">진행단계</th>
              <td className="search-td">
                <input className="input-base input-default w-full" />
              </td>
              <th className="search-th">사업부서/영업대표</th>
              <td className="search-td">
                <input className="input-base input-default w-full" />
              </td>
              <th className="search-th">실행부서/PM</th>
              <td className="search-td">
                <input className="input-base input-default w-full" />
              </td>
              <td colSpan={2}></td>
              <td className="search-td text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🔄 좌우 2단 레이아웃 */}
      <div className="flex gap-4 mb-4">
        {/* 📋 계산서 발행 내역 등록 */}
        <div>
            <div className="tit_area">
                <h3>계산서 발행 내역 등록</h3>
            </div>
            <div className="flex-1 flex flex-col">
                <table className="form-table flex-1">
                    <tbody>
                    <tr className="form-tr">
                        <th className="form-th w-[100px]">구분</th>
                        <td className="form-td w-[150px]">
                        <select className="combo-base w-full">
                            <option>매출</option>
                            <option>매입</option>
                        </select>
                        </td>
                        <th className="form-th w-[100px]">유형</th>
                        <td className="form-td">
                        <div className="flex gap-2 items-center">
                            <label><input type="radio" name="group" defaultChecked /> App</label>
                            <label><input type="radio" name="group" /> 시스템</label>
                            <label><input type="radio" name="group" /> 패키지</label>
                            <label><input type="radio" name="group" /> IPCC</label>
                            <label><input type="radio" name="group" /> Infra SVC</label>
                        </div>
                        </td>
                    </tr>
                    <tr className="form-tr">
                        <th className="form-th">발행일자</th>
                        <td className="form-td">
                        <input type="date" className="input-base input-calender w-full" />
                        </td>
                        <th className="form-th">발행금액</th>
                        <td className="form-td">
                        <div className="flex items-center">
                            <input type="text" className="input-base input-default w-full" />
                            <span className="m-1">원</span>
                        </div>
                        </td>
                    </tr>
                    <tr className="form-tr">
                        <th className="form-th">발행내용</th>
                        <td className="form-td" colSpan={3}>
                        <input type="text" className="input-base input-default w-full" />
                        </td>
                    </tr>
                    <tr className="form-tr">
                        <th className="form-th">비고</th>
                        <td className="form-td" colSpan={3}>
                        <textarea className="textarea_def w-full" rows={2} />
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div className="flex justify-end gap-2 mt-2">
                    <button className="btn-base btn-act">신규</button>
                    <button className="btn-base btn-act">저장</button>
                    <button className="btn-base btn-delete">삭제</button>
                </div>
            </div>
        </div>
        {/* 📊 오른쪽 그리드 */}
        <div className="flex-1 flex flex-col">
            <div className="tit_area">
                <h3>title</h3>
            </div>
          <div className="gridbox-div flex-1">
            <table className="grid-table text-center">
              <thead>
                <tr>
                  <th className="grid-th w-[40px]">No</th>
                  <th className="grid-th w-[60px]">구분</th>
                  <th className="grid-th w-[60px]">유형</th>
                  <th className="grid-th w-[100px]">발행일자</th>
                  <th className="grid-th w-[120px]">발행금액</th>
                  <th className="grid-th">내용</th>
                  <th className="grid-th">비고</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                    <td className="grid-td">{i}</td>
                    <td className="grid-td">매출</td>
                    <td className="grid-td">APP</td>
                    <td className="grid-td">2025/01/31</td>
                    <td className="grid-td text-right">11,100,000</td>
                    <td className="grid-td">1월 농협손보 운영</td>
                    <td className="grid-td">타이호인스트</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📌 합계 표시 */}
          <div className="flex justify-end gap-4 mt-2 pr-4 text-[14px] items-center">
            <label className="font-semibold text-red-500 min-w-[70px]">매출합계:</label>
            <input type="text" className="input-base input-default text-right w-[160px] text-red-500 font-bold" defaultValue="55,500,000" />
            <label className="font-semibold text-blue-500 min-w-[70px]">매입합계:</label>
            <input type="text" className="input-base input-default text-right w-[160px] text-blue-500 font-bold" defaultValue="0" />
          </div>
        </div>
      </div>
    {/* 📌 그리드 */}
    <div className="tit_area mt-4">
        <h3>월별 실적 매출매입 리스트</h3>
            <p className="text-[13px] text-blue-500">※해당월의 발행완료 유무를 변경하려면 해당 리스트를 더블클릭 하십시오.</p>
        </div>

        <div className="gridbox-div">
        <table className="grid-table text-center">
            <thead>
            <tr>
                <th className="grid-th" rowSpan={2}>년월</th>
                <th className="grid-th" colSpan={7}>매출실적</th>
                <th className="grid-th" colSpan={5}>매입실적</th>
                <th className="grid-th" rowSpan={2}>발행완료</th>
            </tr>
            <tr>
                <th className="grid-th">APP</th>
                <th className="grid-th">시스템</th>
                <th className="grid-th">패키지</th>
                <th className="grid-th">IPCC</th>
                <th className="grid-th">InfraSVC</th>
                <th className="grid-th">APP</th>
                <th className="grid-th">합계</th>
                <th className="grid-th">시스템</th>
                <th className="grid-th">패키지</th>
                <th className="grid-th">IPCC</th>
                <th className="grid-th">InfraSVC</th>
                <th className="grid-th">합계</th>
            </tr>
            </thead>
            <tbody>
            {/* 더미 데이터 예시 */}
            <tr>
                <td className="grid-td">2025/01</td>
                <td className="grid-td text-right">11,100,000</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td text-right">11,100,000</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">Y</td>
            </tr>
            {/* 합계 */}
            <tr>
                <td className="grid-td font-semibold">합계</td>
                <td className="grid-td text-right">44,400,000</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td text-right">55,500,000</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">Y</td>
            </tr>
            </tbody>
        </table>
        </div>

        <div className="tit_area mt-4">
        <h3>월별 확정계획 매출매입 리스트</h3>
        </div>

        <div className="gridbox-div">
        <table className="grid-table text-center">
            <thead>
            <tr>
                <th className="grid-th" rowSpan={2}>년월</th>
                <th className="grid-th" colSpan={7}>매출계획</th>
                <th className="grid-th" colSpan={5}>매입계획</th>
                <th className="grid-th" rowSpan={2}>발행유무</th>
            </tr>
            <tr>
                <th className="grid-th">APP</th>
                <th className="grid-th">시스템</th>
                <th className="grid-th">패키지</th>
                <th className="grid-th">IPCC</th>
                <th className="grid-th">InfraSVC</th>
                <th className="grid-th">APP</th>
                <th className="grid-th">합계</th>
                <th className="grid-th">시스템</th>
                <th className="grid-th">패키지</th>
                <th className="grid-th">IPCC</th>
                <th className="grid-th">InfraSVC</th>
                <th className="grid-th">합계</th>
            </tr>
            </thead>
            <tbody>
            {/* 계획표 더미 */}
            <tr>
                <td className="grid-td">2025/01</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">Y</td>
            </tr>
            {/* 합계 */}
            <tr>
                <td className="grid-td font-semibold">합계</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">0</td>
                <td className="grid-td">Y</td>
            </tr>
            </tbody>
        </table>
        </div>




    </div>
  );
}
