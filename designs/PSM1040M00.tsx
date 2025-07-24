'use client';

import React from 'react';
import './common.css';

export default function PSM1040M00({ isTab }: { isTab?: boolean }) {
  return (
    <div className={`flex flex-col ${isTab ? 'flex-1 min-h-0' : 'h-full'} overflow-auto`}>
      {/* 인사발령내용 + 대상자 */}
      <div className="flex gap-4">
        {/* 왼쪽 인사발령내용 입력 */}
        <div className="w-[320px] flex flex-col">
          <div className="tit_area">
            <h3>인사발령내용</h3>
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
                </tr>
                <tr className="form-tr">
                  <th className="form-th">발령일자</th>
                  <td className="form-td">
                    <input type="date" className="input-base input-default w-full" />
                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">발령본부</th>
                  <td className="form-td">
                    <select className="combo-base w-full">
                      <option>본부공통</option>
                    </select>
                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">발령부서</th>
                  <td className="form-td">
                    <select className="combo-base w-full">
                      <option>본부공통</option>
                    </select>
                  </td>
                </tr>
                <tr className="form-tr">
                  <th className="form-th">발령직위</th>
                  <td className="form-td">
                    <select className="combo-base w-full">
                      <option>사원</option>
                    </select>
                  </td>
                </tr>
                <tr className="form-tr align-top">
                  <th className="form-th pt-2">비고</th>
                  <td className="form-td">
                    <textarea className="textarea_def w-full min-h-[80px]" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-2 gap-2">
              <button className="btn-base btn-etc">신규</button>
              <button className="btn-base btn-act">등록</button>
            </div>
          </div>
        </div>

        {/* 오른쪽 인사발령 대상자 */}
        <div className="flex-1 flex flex-col">
          <div className="tit_area justify-between">
            <h3>인사발령 대상자</h3>
            <div className="flex gap-2">
              <button className="btn-base btn-etc">리스트초기화</button>
              <button className="btn-base btn-delete">행삭제</button>
            </div>
          </div>
          <div className="gridbox-div grid-scroll flex-1">
            <table className="grid-table">
              <thead>
                <tr className="grid-tr">
                  <th className="grid-th">구분</th>
                  <th className="grid-th">발령일자</th>
                  <th className="grid-th">사번</th>
                  <th className="grid-th">성명</th>
                  <th className="grid-th">본부</th>
                  <th className="grid-th">부서</th>
                  <th className="grid-th">직책</th>
                  <th className="grid-th">본부</th>
                  <th className="grid-th">부서</th>
                  <th className="grid-th">직책</th>
                  <th className="grid-th">비고</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr className="grid-tr" key={i}>
                    <td className="grid-td">승진</td>
                    <td className="grid-td">2025-01-01</td>
                    <td className="grid-td">1000{i + 1}</td>
                    <td className="grid-td">홍길동</td>
                    <td className="grid-td">기존본부</td>
                    <td className="grid-td">기존부서</td>
                    <td className="grid-td">사원</td>
                    <td className="grid-td">발령본부</td>
                    <td className="grid-td">발령부서</td>
                    <td className="grid-td">대리</td>
                    <td className="grid-td">비고내용</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[#00509A] py-1">
            ※ 발령대상자는 화면 상단의 사원(외주)리스트를 더블클릭하면 인사발령 대상자 리스트에 추가 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
