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
    </div>
  );
}
