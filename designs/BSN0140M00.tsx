'use client';

import React from 'react';

export default function BSN0140M00() {
    
  return (
    <div>
      {/* 🔷 타이틀 영역 */}
      <div className="tit_area">
        <h3>직접경비</h3>
        <div className="flex items-center ml-auto gap-2">
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" className="accent-blue-500" defaultChecked />
            직접경비 자동계산
          </label>
        </div>
      </div>

      {/* 🧾 직접경비 테이블 */}
      <table className="form-table">
        <tbody>
          {[
            ['복리후생비', '0', '10.5%(SM:7만/인건비공수(M/M)인×실비)'],
            ['여비교통비', '0', '실비'],
            ['소모품비', '0', '(C+I)×0.2%'],
            ['도서인쇄비', '', ''],
            ['세금과공과', '0', '(C+I)×0.1%'],
            ['보험료', '', ''],
            ['교육훈련비', '', ''],
            ['운반비', '', '실비'],
            ['접대비', '0', '(C+I)-B-F×2.0%'],
            ['기술도입비', '', '실비'],
            ['지급임차료', '', '실비'],
            ['A/S비', '0', '(C+I)×2.0% OR 0%(SM)'],
            ['기타비용', '0', '(C+I)×0.3%'],
            ['Risk Contingency 비용', '', ''],
          ].map(([label, value, formula], idx) => (
            <tr key={idx}>
              <th className="form-th w-[200px]">{label}</th>
              <td className="form-td  w-[20%]">
                <input
                  type="text"
                  defaultValue={value}
                  className="input-base input-default w-full text-right"
                />
              </td>
              <td className="form-td w-[30%]">{formula}</td>
              <td className="form-td w-[74px] text-right">
                <button className="btn-base btn-etc">계산</button>
              </td>
              <td className="form-td">
                <input
                  type="text"
                  className="input-base input-default w-full"
                  defaultValue=""
                />
              </td>
            </tr>
          ))}

          {/* 🔹 합계 행 */}
          <tr>
            <th className="form-th text-right">계</th>
            <td className="form-td">
              <input
                type="text"
                defaultValue="0"
                className="input-base input-default w-full"
              />
            </td>
            <td className="form-td" colSpan={3}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
