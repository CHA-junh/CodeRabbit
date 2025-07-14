'use client';

import React from 'react';
import './common.css';

export default function Page() {
  return (
    <div className="relative w-full min-h-screen bg-white font-nanum overflow-hidden">
      {/* 테이블 */}
      <div className="form-table">

        {/* 1행: Input combo */}
        <div className="form-tr">
          <div className="form-th">input</div>
          <div className="form-td"><input className="input-base input-default" /></div>
          <div className="form-th">input hover</div>
          <div className="form-td"><input className="input-base input-hover" /></div>
          <div className="form-th">input focus</div>
          <div className="form-td"><input className="input-base input-focus" /></div>
          <div className="form-th">input disabled</div>
          <div className="form-td"><input className="input-base input-disabled" disabled /></div>
          <div className="form-th">combo</div>
          <div className="form-td"><select className="w-56 h-[32px] px-3 py-1 border border-stone-300 rounded-md bg-white text-sm"><option>전체</option></select></div>
          <div className="form-th"></div>
          <div className="form-td"></div>
        </div>

        {/* 2행: 버튼 활성 */}
        <div className="form-tr">
          <div className="form-th">etc button</div>
          <div className="form-td"><button type="button" className="btn-base btn-etc">신규</button></div>
          <div className="form-th">act button</div>
          <div className="form-td"><button type="button" className="btn-base btn-act">저장</button></div>
          <div className="form-th">search button</div>
          <div className="form-td">
            <button type="button" className="btn-base btn-search">조회</button>
          </div>
          <div className="form-th">delete button</div>
          <div className="form-td"><button type="button" className="btn-base btn btn-delete">삭제</button></div>
          <div className="form-th">excel button</div>
          <div className="form-td">
            <button type="button" className="btn-base btn-excel">엑셀</button>
          </div>
          <div className="form-th">calender</div>
          <div className="form-td">
            <button type="button" className="icon_btn" />
          </div>
        </div>

        {/* 3행: 버튼 비활성 */}
        <div className="form-tr">
          <div className="form-th">etc btn disabled</div>
          <div className="form-td"><button type="button" className="btn-base btn-etc btn-disabled" disabled>신규</button></div>
          <div className="form-th">act btn disabled</div>
          <div className="form-td"><button type="button" className="btn-base btn-act btn-disabled" disabled>저장</button></div>
          <div className="form-th">search btn disabled</div>
          <div className="form-td">
            <button type="button" className="btn-base btn-search" disabled>조회</button>
          </div>
          <div className="form-th">delete btn disabled</div>
          <div className="form-td"><button type="button" className="btn-base btn btn-delete" disabled>삭제</button></div>
          <div className="form-th">excel btn disabled</div>
          <div className="form-td">
            <button type="button" className="btn-base btn-excel" disabled>엑셀</button>
          </div>
          <div className="form-th">icon btn disabled</div>
          <div className="form-td">
            <button type="button" className="icon_btn" disabled/>
          </div>
        </div>
        
      </div>

      {/*버튼 SET */}
      <div className="flex gap-2 justify-end">
        <button className="btn-base btn-delete">삭제</button>
        <button className="btn-base btn-etc">신규</button>
        <button className="btn-base btn-act">저장</button>
      </div>


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


      {/* 타이틀 */}
      <div className="tit_area">
        <h3>프로그램목록</h3>
        <div>
          <button type="button" className="btn-base btn-excel">엑셀</button>
        </div>
      </div>



      {/* 그리드 영역  --- 더미 데이터 필수*/}
         {/*더미 데이터*/}
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

      {/*그리드*/}
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



    {/* 테이블 */}
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



    </div>
    
    </div>
  );
}
