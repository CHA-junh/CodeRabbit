'use client';

import React, { useState } from 'react';
import './common.css';

export default function GradeUnitPricePopup() {
  const [radioValue, setRadioValue] = useState('1');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [gridData, setGridData] = useState([
    { grade: '특급', duty: '책임', price: '3,500,000' },
    { grade: '고급', duty: '선임', price: '2,800,000' },
    { grade: '중급', duty: '사원', price: '2,000,000' },
  ]);

  const handleSearch = () => {
    if (!year.trim()) {
      alert('년도를 입력하세요.');
      return;
    }
    // 📌 실제 서버 호출 로직 대체
    console.log(`조회조건: ${radioValue}, ${year}`);
  };

  return (
    <div className="popup-wrapper min-w-[500px]">
      <div className="popup-header">
        <h3 className="popup-title">등급별 단가 조회</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      <div className="popup-body scroll-area">
        {/* 조회 조건 영역 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                <th className="search-th w-[100px]">자사/외주 구분</th>
                <td className="search-td w-[120px]">
                  <div className="flex items-center gap-4 text-sm">
                    <label><input type="radio" name="gubun" value="1" checked={radioValue === '1'} onChange={e => setRadioValue(e.target.value)} /> 자사</label>
                    <label><input type="radio" name="gubun" value="2" checked={radioValue === '2'} onChange={e => setRadioValue(e.target.value)} /> 외주</label>
                  </div>
                </td>
                <th className="search-th w-[70px]">년도</th>
                <td className="search-td w-[100px]">
                  <select
                    className="combo-base w-full"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                  >
                    {Array.from({ length: 11 }, (_, i) => {
                      const y = new Date().getFullYear() - 5 + i;
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                </td>

                <td className="search-td text-right">
                  <button className="btn-base btn-search" onClick={handleSearch}>조회</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 그리드 영역 */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th">등급</th>
                <th className="grid-th">직책</th>
                <th className="grid-th text-right">단가</th>
              </tr>
            </thead>
            <tbody>
              {gridData.map((item, idx) => (
                <tr className="grid-tr" key={idx}>
                  <td className="grid-td">{item.grade}</td>
                  <td className="grid-td">{item.duty}</td>
                  <td className="grid-td text-right">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete">종료</button>
        </div>
      </div>
    </div>
  );
}
