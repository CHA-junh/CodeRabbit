'use client';

import React, { useState } from 'react';
import BSN0681M00 from './BSN0681M00';
import BSN0682M00 from './BSN0682M00';

export default function BSN0680M00() {
  const [activeTab, setActiveTab] = useState('월별 투입/철수 현황');
  const tabs = ['월별 투입/철수 현황', '투입/철수 인원 리스트'];

  // 조회 조건 상태
  const [searchConditions, setSearchConditions] = useState({
    ownOutDiv: '1', // 자사/외주구분 (1:자사, 2:외주, ALL:전체)
    srchKb: '1', // 조회구분 (1:투입, 2:철수)
    bsnDiv: 'ALL', // 사업구분 (ALL:전체, BTS:SI, BTM:SM및유지보수, BIR:연구개발)
    fromDt: '2025-01-01', // 투입일자 From
    toDt: '2025-12-31', // 투입일자 To
    hqDiv: 'ALL', // 본부
    dept: 'ALL', // 직책
    tcnGrd: 'ALL' // 등급
  });

  // 조회 조건 변경 핸들러
  const handleConditionChange = (field: string, value: string) => {
    setSearchConditions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    console.log('조회 조건:', searchConditions);
    // TODO: API 호출 로직 구현
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* 🔍 조회 조건 */}
      <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
        <table className="w-full">
          <tbody>
            {/* ▶ 1행 */}
            <tr className="h-10">
              <th className="w-[120px] text-left text-sm font-medium text-gray-700 bg-gray-100 px-3 border border-gray-300">
                자사/외주구분
              </th>
              <td className="w-[350px] px-3 border border-gray-300 bg-white">
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="ownOutDiv" 
                    value="1"
                    checked={searchConditions.ownOutDiv === '1'}
                    onChange={(e) => handleConditionChange('ownOutDiv', e.target.value)}
                    className="mr-1"
                  /> 
                  자사
                </label>
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="ownOutDiv" 
                    value="2"
                    checked={searchConditions.ownOutDiv === '2'}
                    onChange={(e) => handleConditionChange('ownOutDiv', e.target.value)}
                    className="mr-1"
                  /> 
                  외주
                </label>
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="ownOutDiv" 
                    value="ALL"
                    checked={searchConditions.ownOutDiv === 'ALL'}
                    onChange={(e) => handleConditionChange('ownOutDiv', e.target.value)}
                    className="mr-1"
                  /> 
                  전체
                </label>
              </td>

              <th className="w-[100px] text-left text-sm font-medium text-gray-700 bg-gray-100 px-3 border border-gray-300">
                조회구분
              </th>
              <td className="w-[150px] px-3 border border-gray-300 bg-white">
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="srchKb" 
                    value="1"
                    checked={searchConditions.srchKb === '1'}
                    onChange={(e) => handleConditionChange('srchKb', e.target.value)}
                    className="mr-1"
                  /> 
                  투입
                </label>
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="srchKb" 
                    value="2"
                    checked={searchConditions.srchKb === '2'}
                    onChange={(e) => handleConditionChange('srchKb', e.target.value)}
                    className="mr-1"
                  /> 
                  철수
                </label>
              </td>

              <th className="w-[100px] text-left text-sm font-medium text-gray-700 bg-gray-100 px-3 border border-gray-300">
                사업구분
              </th>
              <td className="w-[250px] px-3 border border-gray-300 bg-white" colSpan={3}>
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="bsnDiv" 
                    value="ALL"
                    checked={searchConditions.bsnDiv === 'ALL'}
                    onChange={(e) => handleConditionChange('bsnDiv', e.target.value)}
                    className="mr-1"
                  /> 
                  전체
                </label>
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="bsnDiv" 
                    value="BTS"
                    checked={searchConditions.bsnDiv === 'BTS'}
                    onChange={(e) => handleConditionChange('bsnDiv', e.target.value)}
                    className="mr-1"
                  /> 
                  SI
                </label>
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="bsnDiv" 
                    value="BTM"
                    checked={searchConditions.bsnDiv === 'BTM'}
                    onChange={(e) => handleConditionChange('bsnDiv', e.target.value)}
                    className="mr-1"
                  /> 
                  SM/유지보수
                </label>
                <label className="mr-4">
                  <input 
                    type="radio" 
                    name="bsnDiv" 
                    value="BIR"
                    checked={searchConditions.bsnDiv === 'BIR'}
                    onChange={(e) => handleConditionChange('bsnDiv', e.target.value)}
                    className="mr-1"
                  /> 
                  연구개발
                </label>
              </td>
            </tr>

            {/* ▶ 2행 */}
            <tr className="h-10">
              <th className="text-left text-sm font-medium text-gray-700 bg-gray-100 px-3 border border-gray-300">
                투입일자
              </th>
              <td className="px-3 border border-gray-300 bg-white">
                <input 
                  type="date" 
                  className="border border-gray-300 rounded px-2 py-1 text-sm mr-2 w-32"
                  value={searchConditions.fromDt}
                  onChange={(e) => handleConditionChange('fromDt', e.target.value)}
                />
                ~
                <input 
                  type="date" 
                  className="border border-gray-300 rounded px-2 py-1 text-sm ml-2 w-32"
                  value={searchConditions.toDt}
                  onChange={(e) => handleConditionChange('toDt', e.target.value)}
                />
              </td>

              <th className="text-left text-sm font-medium text-gray-700 bg-gray-100 px-3 border border-gray-300">
                본부
              </th>
              <td className="px-3 border border-gray-300 bg-white">
                <select 
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                  value={searchConditions.hqDiv}
                  onChange={(e) => handleConditionChange('hqDiv', e.target.value)}
                >
                  <option value="ALL">전체</option>
                  <option value="001">본부1</option>
                  <option value="002">본부2</option>
                  <option value="003">본부3</option>
                </select>
              </td>

              <th className="text-left text-sm font-medium text-gray-700 bg-gray-100 px-3 border border-gray-300">
                직책
              </th>
              <td className="px-3 border border-gray-300 bg-white w-[150px]">
                <select 
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                  value={searchConditions.dept}
                  onChange={(e) => handleConditionChange('dept', e.target.value)}
                >
                  <option value="ALL">전체</option>
                  <option value="001">사원</option>
                  <option value="002">대리</option>
                  <option value="003">과장</option>
                  <option value="004">차장</option>
                  <option value="005">부장</option>
                </select>
              </td>

              <th className="text-left text-sm font-medium text-gray-700 bg-gray-100 px-3 border border-gray-300 w-[80px]">
                등급
              </th>
              <td className="px-3 border border-gray-300 bg-white w-[150px]">
                <select 
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                  value={searchConditions.tcnGrd}
                  onChange={(e) => handleConditionChange('tcnGrd', e.target.value)}
                >
                  <option value="ALL">전체</option>
                  <option value="001">초급</option>
                  <option value="002">중급</option>
                  <option value="003">고급</option>
                  <option value="004">특급</option>
                </select>
              </td>
              <td></td>
              {/* ▶ 조회 버튼 (우측 정렬) */}
              <td className="px-3 border border-gray-300 bg-white text-right">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
                  onClick={handleSearch}
                >
                  조회
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 📑 서브 탭 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 탭 버튼 */}
        <div className="flex border-b border-gray-300">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-600 bg-white' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 p-4 bg-white">
          {activeTab === '월별 투입/철수 현황' && <BSN0681M00 />}
          {activeTab === '투입/철수 인원 리스트' && <BSN0682M00 />}
        </div>
      </div>
    </div>
  );
} 