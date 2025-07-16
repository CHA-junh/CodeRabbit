'use client';

import React, { useState } from 'react';
import './common.css';

export default function EmployeeNameSearchPopup() {
  const [empName, setEmpName] = useState('');
  const [empList, setEmpList] = useState([
    {
      empNo: 'E001',
      empName: '홍길동',
      dutyName: '과장',
      hqName: '경영본부',
      deptName: '전략팀',
      authCdName: '관리자',
      remark: '',
      bsnUseYn: 1,
      wpcUseYn: 0,
      psmUseYn: 1,
    },
    // 추가 데이터 가능
  ]);

  const handleSearch = () => {
    console.log(`사용자명 검색: ${empName}`);
  };

  const handleClose = () => {
    console.log('팝업 닫기');
  };

  return (
    <div className="popup-wrapper min-w-[840px]">
      {/* 팝업 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">사용자명 검색</h3>
        <button className="popup-close" onClick={handleClose}>×</button>
      </div>

      {/* 팝업 본문 */}
      <div className="popup-body scroll-area">
        {/* 검색 조건 */}
        <div className="search-div mb-4">
          <table className="search-table w-full">
            <tbody>
              <tr>
                <th className="search-th w-[100px]">사용자 명</th>
                <td className="search-td w-[200px]">
                  <input
                    type="text"
                    className="input-base input-default w-full"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                  />
                </td>
                <td className="search-td text-right" colSpan={6}>
                  <button className="btn-base btn-search" onClick={handleSearch}>조회</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 결과 그리드 */}
        <div className="gridbox-div mb-4">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th w-[60px]">사번</th>
                <th className="grid-th w-[70px]">성명</th>
                <th className="grid-th w-[120px]">본부명</th>
                <th className="grid-th w-[120px]">부서명</th>
                <th className="grid-th w-[60px]">직급명</th>
                <th className="grid-th w-[100px]">사용자 권한</th>
                <th className="grid-th w-[60px]">사업</th>
                <th className="grid-th w-[60px]">추진비</th>
                <th className="grid-th w-[60px]">인사/복리</th>
                <th className="grid-th">비고</th>
              </tr>
            </thead>
            <tbody>
              {empList.map((item, idx) => (
                <tr className="grid-tr" key={idx}>
                  <td className="grid-td text-center">{idx + 1}</td>
                  <td className="grid-td text-center">{item.empNo}</td>
                  <td className="grid-td text-center">{item.empName}</td>
                  <td className="grid-td text-center">{item.hqName}</td>
                  <td className="grid-td text-center">{item.deptName}</td>
                  <td className="grid-td text-center">{item.dutyName}</td>
                  <td className="grid-td text-center">{item.authCdName}</td>
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={item.bsnUseYn === 1} readOnly />
                  </td>
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={item.wpcUseYn === 1} readOnly />
                  </td>
                  <td className="grid-td text-center">
                    <input type="checkbox" checked={item.psmUseYn === 1} readOnly />
                  </td>
                  <td className="grid-td">{item.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 종료 버튼 하단 우측 정렬 */}
        <div className="flex justify-end mt-2">
          <button className="btn-base btn-delete" onClick={handleClose}>종료</button>
        </div>
      </div>
    </div>
  );
}
