'use client';

import React, { useState } from 'react';
import './common.css';

export default function MainPage() {
  const [formData, setFormData] = useState({
    type: '자사',
    year: '2025',
    grade: '',
    position: '',
    price: '',
  });

  // ✅ rows는 컴포넌트 최상단에 위치해야 함
  const rows = [
    { grade: '초급', position: '사원', price: '2,000,000' },
    { grade: '중급', position: '대리', price: '2,500,000' },
    { grade: '고급', position: '과장', price: '3,000,000' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mdi">
      {/* 검색 영역 */}
      <div className="search-div mb-4">
        <table className="search-table table-fixed">
          <tbody>
            <tr className="search-tr">
              <th className="search-th w-[130px]">자사/외주 구분</th>
              <td className="search-td w-[120px]">
                <label className="mr-3">
                  <input
                    type="radio"
                    name="type"
                    value="자사"
                    checked={formData.type === '자사'}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  자사
                </label>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="외주"
                    checked={formData.type === '외주'}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  외주
                </label>
              </td>
              <th className="search-th w-[80px]">년도</th>
              <td className="search-td w-[150px]">
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input-base input-default w-[80px] mr-2"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </td>
              <td className="search-td text-right">
                <button className="btn-base btn-search">조회</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 그리드 영역 */}
      <div className="gridbox-div mb-4">
        <div className="grid-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[120px]">등급</th>
                <th className="grid-th w-[120px]">직책</th>
                <th className="grid-th w-[150px]">단가</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="grid-tr">
                  <td className="grid-td">{row.grade}</td>
                  <td className="grid-td">{row.position}</td>
                  <td className="grid-td text-right pr-4">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 등록 영역 */}
      <div className="mb-3">
        <table className="form-table mb-4">
          <tbody>
            <tr className="form-tr">
              <th className="form-th w-[80px]">등급</th>
              <td className="form-td w-[180px]">
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="input-base input-default w-full"
                >
                  <option value="">선택</option>
                  <option value="초급">초급</option>
                  <option value="중급">중급</option>
                </select>
              </td>

              <th className="form-th w-[80px]">직책</th>
              <td className="form-td w-[180px]">
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="input-base input-default w-full"
                >
                  <option value="">선택</option>
                  <option value="사원">사원</option>
                  <option value="대리">대리</option>
                </select>
              </td>

              <th className="form-th w-[80px]">단가</th>
              <td className="form-td w-[180px]">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-base input-default w-full"
                  />
                  <span className="m-1">원</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2">
        <button className="btn-base btn-delete">삭제</button>
        <button className="btn-base btn-act">저장</button>
        <button className="btn-base btn-delete">종료</button>
      </div>
    </div>
  );
}
