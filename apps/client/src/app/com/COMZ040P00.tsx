'use client';

import React, { useState, useEffect } from 'react';
import '@/app/common/common.css';
import { useAuth } from '@/modules/auth/hooks/useAuth';

interface BusinessData {
  BSN_NO: string;
  BSN_NM: string;
  BIZ_REPNM: string;
  BIZ_REPID: string;
  BIZ_REPEMAIL: string;
  PM_NM: string;
  PM_ID: string;
  BSN_STRT_DT: string;
  BSN_END_DT: string;
  BSN_DEPT_KB: string;
  PPLS_DEPT_NM: string;
  PPLS_DEPT_CD: string;
  EXEC_DEPT_NM: string;
  EXEC_DEPT_CD: string;
  PGRS_ST_DIV: string;
  PGRS_ST_DIV_NM: string;
}

export default function ProjectSearchPopup() {
  const { user } = useAuth();
  const [searchType, setSearchType] = useState('0'); // 0: 전체, 1: 사업부서, 2: 실행부서
  const [hqDiv, setHqDiv] = useState('ALL');
  const [deptDiv, setDeptDiv] = useState('ALL');
  const [userNm, setUserNm] = useState('');
  const [progressStates, setProgressStates] = useState({
    all: true,
    new: true,
    sales: true,
    confirmed: true,
    contract: true,
    completed: true,
    failed: true,
    cancelled: true
  });
  const [bsnYear, setBsnYear] = useState(new Date().getFullYear().toString());
  const [bsnYearAll, setBsnYearAll] = useState(true);
  const [bsnNo, setBsnNo] = useState('');
  const [businessList, setBusinessList] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 진행상태 코드 매핑
  const getProgressStateCode = () => {
    let codes = [];
    if (progressStates.new) codes.push('1');
    if (progressStates.sales) codes.push('2');
    if (progressStates.confirmed) codes.push('3');
    if (progressStates.contract) codes.push('4');
    if (progressStates.completed) codes.push('8');
    if (progressStates.failed) codes.push('7');
    if (progressStates.cancelled) codes.push('9');
    return codes.join(',');
  };

  // 모두선택 체크박스 처리
  const handleAllProgressChange = (checked: boolean) => {
    setProgressStates({
      all: checked,
      new: checked,
      sales: checked,
      confirmed: checked,
      contract: checked,
      completed: checked,
      failed: checked,
      cancelled: checked
    });
  };

  // 개별 진행상태 체크박스 처리
  const handleProgressChange = (key: string, checked: boolean) => {
    setProgressStates(prev => ({
      ...prev,
      [key]: checked,
      all: false // 개별 선택 시 모두선택 해제
    }));
  };

  // 조회구분 변경 처리
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    if (value === '0') {
      setHqDiv('ALL');
      setDeptDiv('ALL');
      setUserNm('');
    }
  };

  // 사업년도 전체 체크 처리
  const handleBsnYearAllChange = (checked: boolean) => {
    setBsnYearAll(checked);
  };

  // 검색 실행
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/COMZ040P00', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bsnNo: bsnNo,
          startYear: bsnYearAll ? 'ALL' : bsnYear,
          progressStateDiv: getProgressStateCode(),
          searchDiv: searchType,
          hqCd: hqDiv,
          deptCd: deptDiv,
          userNm: userNm || 'ALL',
          loginId: user?.userId || user?.empNo || ''
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBusinessList(data.data || []);
      } else {
        setError(data.message || '검색에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error('Business search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 더블클릭 처리
  const handleDoubleClick = (item: BusinessData) => {
    if (window.opener) {
      // 부모창에 데이터 전달
      const resultData = {
        bsnNo: item.BSN_NO,
        bsnDeptKb: item.BSN_DEPT_KB,
        bizRepNm: item.BIZ_REPNM,
        bizRepId: item.BIZ_REPID,
        pmNm: item.PM_NM,
        pmId: item.PM_ID,
        bsnStrtDt: item.BSN_STRT_DT,
        bsnEndDt: item.BSN_END_DT,
        bizRepEmail: item.BIZ_REPEMAIL,
        pplsDeptCd: item.PPLS_DEPT_CD,
        execDeptCd: item.EXEC_DEPT_CD,
        bsnNm: item.BSN_NM
      };
      
      // 부모창에 이벤트 전달
      window.opener.postMessage({
        type: 'BUSINESS_SELECT',
        data: resultData
      }, '*');
      
      window.close();
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ESC 키로 팝업 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">사업번호검색</h3>
        <button 
          className="popup-close" 
          type="button"
          onClick={() => window.close()}
        >
          ×
        </button>
      </div>

      <div className="popup-body">
        {/* 검색 영역 */}
        <div className="search-div">
          <table className="search-table">
            <tbody>
              {/* 1행 - 조회구분 */}
              <tr className="search-tr">
                <th className="search-th w-[110px]">조회구분</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '0'}
                      onChange={() => handleSearchTypeChange('0')}
                    /> 전체
                  </label>
                  <label className="mr-2">
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '1'}
                      onChange={() => handleSearchTypeChange('1')}
                    /> 사업부서
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="searchType" 
                      checked={searchType === '2'}
                      onChange={() => handleSearchTypeChange('2')}
                    /> 실행부서
                  </label>
                </td>
              </tr>

              {/* 2행 - 본부, 추진부서, 영업대표 */}
              <tr className="search-tr">
                <th className="search-th">본부</th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={hqDiv}
                    onChange={(e) => setHqDiv(e.target.value)}
                    disabled={searchType === '0'}
                  >
                    <option value="ALL">전체</option>
                    <option value="01">경영지원본부</option>
                    <option value="02">영업본부</option>
                    <option value="03">서비스사업본부</option>
                    <option value="04">개발본부</option>
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? '실행부서' : '추진부서'}
                </th>
                <td className="search-td !w-[150px]">
                  <select 
                    className="combo-base"
                    value={deptDiv}
                    onChange={(e) => setDeptDiv(e.target.value)}
                    disabled={searchType === '0'}
                  >
                    <option value="ALL">전체</option>
                  </select>
                </td>
                <th className="search-th w-[110px]">
                  {searchType === '2' ? 'PM명' : '영업대표'}
                </th>
                <td className="search-td !w-[150px]">
                  <input 
                    type="text" 
                    className="input-base input-default w-[100px]" 
                    value={userNm}
                    onChange={(e) => setUserNm(e.target.value)}
                    disabled={searchType === '0'}
                  />
                </td>
                <td className="search-td" colSpan={4}></td>
              </tr>

              {/* 3행 - 진행상태 */}
              <tr className="search-tr">
                <th className="search-th">진행상태</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.all}
                      onChange={(e) => handleAllProgressChange(e.target.checked)}
                    /> (모두선택)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.new}
                      onChange={(e) => handleProgressChange('new', e.target.checked)}
                    /> 신규
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.sales}
                      onChange={(e) => handleProgressChange('sales', e.target.checked)}
                    /> 영업진행
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.confirmed}
                      onChange={(e) => handleProgressChange('confirmed', e.target.checked)}
                    /> 수주확정
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.contract}
                      onChange={(e) => handleProgressChange('contract', e.target.checked)}
                    /> 계약
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.completed}
                      onChange={(e) => handleProgressChange('completed', e.target.checked)}
                    /> 완료(종결)
                  </label>
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={progressStates.failed}
                      onChange={(e) => handleProgressChange('failed', e.target.checked)}
                    /> 수주실패
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={progressStates.cancelled}
                      onChange={(e) => handleProgressChange('cancelled', e.target.checked)}
                    /> 취소(삭제)
                  </label>
                </td>
              </tr>

              {/* 4행 - 사업년도, 사업번호, 조회버튼 */}
              <tr className="search-tr">
                <th className="search-th">사업년도</th>
                <td className="search-td">
                  <label className="mr-2">
                    <input 
                      type="checkbox" 
                      checked={bsnYearAll}
                      onChange={(e) => handleBsnYearAllChange(e.target.checked)}
                    /> 전체
                  </label>
                  <select 
                    className="combo-base w-[120px]"
                    value={bsnYear}
                    onChange={(e) => setBsnYear(e.target.value)}
                    disabled={bsnYearAll}
                  >
                    <option value="2025">2025년</option>
                    <option value="2024">2024년</option>
                    <option value="2023">2023년</option>
                  </select>
                </td>
                <th className="search-th">사업번호</th>
                <td className="search-td">
                  <input 
                    type="text" 
                    className="input-base input-default w-[120px]" 
                    value={bsnNo}
                    onChange={(e) => setBsnNo(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </td>
                <td className="search-td text-right" colSpan={4}>
                  <button 
                    className="btn-base btn-search"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? '조회중...' : '조회'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-2">
            <div className="error-message-box">
              <div className="error-message-icon">⚠</div>
              <div className="error-message-desc">{error}</div>
            </div>
          </div>
        )}

        {/* 그리드 영역 */}
        <div className="gridbox-div mt-4">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th">No</th>
                <th className="grid-th">사업번호</th>
                <th className="grid-th">사업명</th>
                <th className="grid-th">시작일자</th>
                <th className="grid-th">종료일자</th>
                <th className="grid-th">영업부서</th>
                <th className="grid-th">영업대표</th>
                <th className="grid-th">실행부서</th>
                <th className="grid-th">PM</th>
                <th className="grid-th">진행상태</th>
              </tr>
            </thead>
            <tbody>
              {businessList.map((item, index) => (
                <tr 
                  key={item.BSN_NO}
                  className="grid-tr cursor-pointer hover:bg-gray-50"
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  <td className="grid-td">{index + 1}</td>
                  <td className="grid-td">{item.BSN_NO}</td>
                  <td className="grid-td">{item.BSN_NM}</td>
                  <td className="grid-td">{item.BSN_STRT_DT}</td>
                  <td className="grid-td">{item.BSN_END_DT}</td>
                  <td className="grid-td">{item.PPLS_DEPT_NM}</td>
                  <td className="grid-td">{item.BIZ_REPNM}</td>
                  <td className="grid-td">{item.EXEC_DEPT_NM}</td>
                  <td className="grid-td">{item.PM_NM}</td>
                  <td className="grid-td">{item.PGRS_ST_DIV_NM}</td>
                </tr>
              ))}
              {businessList.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="grid-td text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 종료 버튼 */}
        <div className="flex justify-end mt-4">
          <button 
            className="btn-base btn-delete"
            onClick={() => window.close()}
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}
