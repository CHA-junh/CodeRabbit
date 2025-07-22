'use client';

import React from 'react';

export default function BSN0150M00() {
  const dummyData = [
    {
      no: 1,
      type: '자사',
      orderAmount: '220,000,000',
      materialCost: '100,000,000',
      materialSupply: '110,000,000',
      laborCost: '70,000,000',
      laborSupply: '80,000,000',
      directCost: '30,000,000',
      totalCost: '200,000,000',
      profit: '20,000,000',
      vat: '22,000,000',
      history: '1차 작성',
      createdAt: '2025-07-22 14:30',
    },
    {
      no: 2,
      type: '외주',
      orderAmount: '150,000,000',
      materialCost: '70,000,000',
      materialSupply: '77,000,000',
      laborCost: '40,000,000',
      laborSupply: '44,000,000',
      directCost: '20,000,000',
      totalCost: '130,000,000',
      profit: '20,000,000',
      vat: '15,000,000',
      history: '수정본',
      createdAt: '2025-07-21 10:10',
    },
    {
      no: 3,
      type: '자사',
      orderAmount: '100,000,000',
      materialCost: '50,000,000',
      materialSupply: '55,000,000',
      laborCost: '30,000,000',
      laborSupply: '33,000,000',
      directCost: '10,000,000',
      totalCost: '90,000,000',
      profit: '10,000,000',
      vat: '10,000,000',
      history: '최종본',
      createdAt: '2025-07-20 09:00',
    },
  ];

  return (
    <div>
      {/* 🔷 타이틀 영역 */}
      <div className="tit_area">
        <h3>품의서 작성 이력</h3>
        <div className="flex gap-2 ml-auto">
          <button type="button" className="btn-base btn-search">조회</button>
          <button type="button" className="btn-base btn-etc">품의서출력</button>
          
        </div>
      </div>

      {/* 📋 그리드 영역 */}
      <div className="gridbox-div">
        <table className="grid-table">
          <thead>
            <tr>
              <th className="grid-th" rowSpan={2}>No</th>
              <th className="grid-th" rowSpan={2}>구분</th>
              <th className="grid-th" rowSpan={2}>수주금액</th>
              <th className="grid-th" colSpan={2}>재료비</th>
              <th className="grid-th" colSpan={2}>직접인건비</th>
              <th className="grid-th" rowSpan={2}>직접경비</th>
              <th className="grid-th" rowSpan={2}>총원가</th>
              <th className="grid-th" rowSpan={2}>정상이익</th>
              <th className="grid-th" rowSpan={2}>부가가치</th>
              <th className="grid-th" rowSpan={2}>이력내용</th>
              <th className="grid-th" rowSpan={2}>등록일시</th>
            </tr>
            <tr>
              <th className="grid-th">원가</th>
              <th className="grid-th">공급가</th>
              <th className="grid-th">원가</th>
              <th className="grid-th">공급가</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((row, i) => (
              <tr key={i} className="grid-tr even:bg-[#F9FCFF] hover:bg-blue-50">
                <td className="grid-td text-center">{row.no}</td>
                <td className="grid-td">{row.type}</td>
                <td className="grid-td text-right">{row.orderAmount}</td>
                <td className="grid-td text-right">{row.materialCost}</td>
                <td className="grid-td text-right">{row.materialSupply}</td>
                <td className="grid-td text-right">{row.laborCost}</td>
                <td className="grid-td text-right">{row.laborSupply}</td>
                <td className="grid-td text-right">{row.directCost}</td>
                <td className="grid-td text-right">{row.totalCost}</td>
                <td className="grid-td text-right">{row.profit}</td>
                <td className="grid-td text-right">{row.vat}</td>
                <td className="grid-td">{row.history}</td>
                <td className="grid-td text-center">{row.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className=" mt-2 flex justify-between">
        {/* 안내 문구 */}
        <div className="text-[12px] text-blue-700 px-1">
          ※ 리스트 해당 건을 선택 더블클릭하면 사업품의서를 엑셀출력합니다.
        </div>

        <button type="button" className="btn-base btn-delete">삭제</button>

      </div>

    </div>
  );
}
