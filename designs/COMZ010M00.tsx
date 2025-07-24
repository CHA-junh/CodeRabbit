'use client';

import React from 'react';
import './common.css';

export default function CodeManagementPage() {
  return (
    <div className="mdi">
        {/* 🔍 조회 영역 */}
      <div className="search-div mb-3">
        <table className="search-table">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[110px]">대분류 코드</th>
              <td className="search-td w-[15%]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <th className="search-th w-[100px]">대분류명</th>
              <td className="search-td  w-[20%]">
                <input type="text" className="input-base input-default w-full" />
              </td>
              <td className="search-td text-right">
                <button className="btn-base btn-search ml-2">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>



        <div className="flex gap-4">
          {/* 대분류 코드 테이블 */}
          <div className="flex-1">
            <div className="gridbox-div h-[240px] overflow-y-auto mb-4">
              <table className="grid-table w-full">
                <thead>
                  <tr>
                    <th className="grid-th">대분류코드</th>
                    <th className="grid-th">대분류명</th>
                    <th className="grid-th">사용여부</th>
                    <th className="grid-th">설명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="grid-tr">
                    <td className="grid-td">010</td>
                    <td className="grid-td">업무구분</td>
                    <td className="grid-td">N</td>
                    <td className="grid-td">사내전산 업무구분-사용안함</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 대분류 등록 폼 */}
            <div className="border border-stone-300 p-3 rounded">
              <div className="tit_area flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold">대분류코드 등록</h4>
                <button className="btn-base btn-etc">신규</button>
              </div>
              <table className="form-table w-full mb-4">
                <tbody>
                  <tr className="form-tr">
                    <th className="form-th w-[120px]">대분류코드</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="010" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th w-[120px]">대분류명</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="업무구분" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">사용여부</th>
                    <td className="form-td">
                      <select className="input-base input-default w-full">
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">설명</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="사내전산 업무구분-사용안함" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end">
                <button className="btn-base btn-delete">삭제</button>
                <button className="btn-base btn-act mr-2">저장</button>
              </div>
            </div>
          </div>

          {/* 소분류 코드 테이블 */}
          <div className="flex-1">
            <div className="gridbox-div h-[240px] overflow-y-auto mb-4">
              <table className="grid-table w-full">
                <thead>
                  <tr>
                    <th className="grid-th">소분류코드</th>
                    <th className="grid-th">소분류명</th>
                    <th className="grid-th">정렬순서</th>
                    <th className="grid-th">사용여부</th>
                    <th className="grid-th">설명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="grid-tr">
                    <td className="grid-td">01</td>
                    <td className="grid-td">사업관리</td>
                    <td className="grid-td text-right">1</td>
                    <td className="grid-td">Y</td>
                    <td className="grid-td">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 소분류 등록 폼 */}
            <div className="border border-stone-300 p-3 rounded">
              <div className="tit_area flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold">소분류코드 등록</h4>
                <button className="btn-base btn-etc">신규</button>
              </div>
              <table className="form-table w-full mb-2">
                <tbody>
                  <tr className="form-tr">
                    <th className="form-th w-[120px]">대분류코드</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="010" />
                    </td>
                    <th className="form-th w-[120px]">소분류코드</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="01" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">소분류명</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="사업관리" />
                    </td>
                    <th className="form-th">연결코드1</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="0" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">연결코드2</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="0" />
                    </td>
                    <th className="form-th">정렬순서</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" defaultValue="1" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">사용여부</th>
                    <td className="form-td">
                      <select className="input-base input-default w-full">
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </td>
                    <th className="form-th">설명</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end">
                <button className="btn-base btn-delete mr-2">삭제</button>
                <button className="btn-base btn-act mr-2">저장</button>
                <button className="btn-base btn-delete">종료</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
