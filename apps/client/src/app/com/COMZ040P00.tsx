'use client';

import React, { useState, useEffect } from 'react';
import '@/app/common/common.css';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';

/**
 * COMZ040P00 - (팝)사업번호검색화면
 * 
 * 주요 기능:
 * - 사업번호 검색 및 선택
 * - 권한별 조회 범위 제어
 * - 진행상태별 필터링
 * - 부서별 사업 조회
 * 
 * 연관 테이블:
 * - TBL_BSN_NO_INF (사업번호 정보)
 * - TBL_BSN_SCDC (사업품의서)
 * - TBL_BSN_PLAN (사업계획)
 * - TBL_DEPT (부서 정보)
 */

// API URL 설정
const apiUrl =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api`
    : '/api';

interface BusinessData {
  bsnNo: string;
  bsnNm: string;
  bizRepNm: string;
  bizRepId: string;
  bizRepEmail: string;
  pmNm: string;
  pmId: string;
  bsnStrtDt: string;
  bsnEndDt: string;
  bsnDeptKb: string;
  pplsDeptNm: string;
  pplsDeptCd: string;
  execDeptNm: string;
  execDeptCd: string;
  pgrsStDiv: string;
  pgrsStDivNm: string;
}

// 부서 정보 타입
interface DeptInfo {
  deptDivCd: string;
  deptNm: string;
  hqDivCd: string;
}

export default function ProjectSearchPopup() {
  const { user } = useAuth();
  const { showToast } = useToast();
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
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>(null);
  const [deptList, setDeptList] = useState<DeptInfo[]>([]);
  const [planYn, setPlanYn] = useState(false); // 사업예산품의서 여부

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

  // 부서 목록 조회 함수
  const fetchDeptList = async (hqCd: string) => {
    try {
      const res = await fetch(`${apiUrl}/COMZ060P00`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deptNo: '',
          year: new Date().getFullYear().toString(),
          deptDivCd: hqCd
        }),
      });
      if (!res.ok) throw new Error('부서 조회 실패');
      const data = await res.json();
      setDeptList(data.data || []);
    } catch (e: any) {
      console.error('부서 조회 오류:', e);
      showToast('부서 조회 중 오류가 발생했습니다.', 'error');
      setDeptList([]);
    }
  };

  // 권한에 따른 조회구분 디폴트 설정 (레거시 setDefalutSrchKb 함수)
  const setDefaultSearchType = () => {
    const authCd = user?.role || '';
    const hqDivCd = user?.department || '';
    const deptTp = user?.department || '';

    if (authCd === '00') { // 본부장/임원 이상
      setSearchType('0');
    } else if (authCd === '10') { // 부서장
      if (hqDivCd === '02' || deptTp === 'BIZ') { // 영업본부
        setSearchType('1');
      } else if (hqDivCd === '03' || hqDivCd === '04') { // 서비스사업본부, 개발본부
        setSearchType('2');
      } else {
        setSearchType('0');
      }
    } else if (authCd === '20') { // 영업대표
      setSearchType('1');
    } else if (authCd === '30') { // PM
      setSearchType('2');
    } else {
      if (hqDivCd === '01' || deptTp === 'ADM') { // 경영지원본부
        setSearchType('0');
      } else {
        setSearchType('');
      }
    }

    handleSearchTypeChange(searchType);
  };

  // 진행상태 설정 (레거시 setPgrsSt 함수)
  const setProgressStateByType = (val: string) => {
    if (val === 'plan') { // 사업예산품의서
      setPlanYn(true);
      setProgressStates({
        all: true,
        new: true,
        sales: true,
        confirmed: false,
        contract: false,
        completed: false,
        failed: false,
        cancelled: false
      });
    } else if (val === 'rsts') { // 사업확정품의서
      setPlanYn(false);
      setProgressStates({
        all: true,
        new: false,
        sales: false,
        confirmed: true,
        contract: true,
        completed: true,
        failed: false,
        cancelled: false
      });
    } else if (val === 'pplct') { // 업무추진비
      setPlanYn(false);
      const authCd = user?.role || '';
      const hqDivCd = user?.department || '';
      const deptTp = user?.department || '';

      if (hqDivCd === '02' || authCd === '00' || deptTp === 'BIZ') {
        // 영업본부 또는 본부장 이상
        setProgressStates({
          all: true,
          new: true,
          sales: true,
          confirmed: true,
          contract: true,
          completed: false,
          failed: false,
          cancelled: false
        });
      } else {
        // 영업본부와 본부장이상이 아니면 수주확정된 사업리스트만 조회 가능
        setProgressStates({
          all: true,
          new: false,
          sales: false,
          confirmed: true,
          contract: true,
          completed: true,
          failed: false,
          cancelled: false
        });
      }
    } else {
      setPlanYn(false);
      setProgressStates({
        all: true,
        new: true,
        sales: true,
        confirmed: true,
        contract: true,
        completed: true,
        failed: true,
        cancelled: true
      });
    }
  };

  // 선택 권한 체크 (레거시 chkAuthListSelect 함수)
  const checkAuthListSelect = (item: BusinessData): boolean => {
    const authCd = user?.role || '';
    const userName = user?.name || '';

    // PM인 경우에는 자신의 사업만 선택할 수 있다
    if (authCd === '30') {
      if (userName !== item.pmNm) {
        alert(`${userName}은(는) 해당 사업의 PM이 아닙니다. 선택할 수 없습니다.`);
        return false;
      }
    }
    return true;
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

  // 본부 변경 처리
  const handleHqChange = (value: string) => {
    setHqDiv(value);
    setDeptDiv('ALL');
    if (value !== 'ALL' && searchType !== '0') {
      fetchDeptList(value);
    } else {
      setDeptList([]);
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
      const response = await fetch(`${apiUrl}/COMZ040P00`, {
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

  // 행 클릭 처리
  const handleRowClick = (item: BusinessData) => {
    setSelectedBusiness(item);
  };

  // 더블클릭 처리
  const handleDoubleClick = (item: BusinessData) => {
    // 권한 체크
    if (!checkAuthListSelect(item)) {
      return;
    }

    if (window.opener) {
      // 부모창에 데이터 전달
      const resultData = {
        bsnNo: item.bsnNo,
        bsnDeptKb: item.bsnDeptKb,
        bizRepNm: item.bizRepNm,
        bizRepId: item.bizRepId,
        pmNm: item.pmNm,
        pmId: item.pmId,
        bsnStrtDt: item.bsnStrtDt,
        bsnEndDt: item.bsnEndDt,
        bizRepEmail: item.bizRepEmail,
        pplsDeptCd: item.pplsDeptCd,
        execDeptCd: item.execDeptCd,
        bsnNm: item.bsnNm
      };
      
      // 부모창에 이벤트 전달
      window.opener.postMessage({
        type: 'BUSINESS_SELECT',
        data: resultData
      }, '*');
      
      window.close();
    }
  };

  // 그리드 행 키보드 네비게이션
  const handleRowKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'ArrowDown') {
      const nextIdx = idx + 1;
      if (nextIdx < businessList.length) {
        const nextRow = businessList[nextIdx];
        setSelectedBusiness(nextRow);
        // 다음 행에 포커스 이동
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="사업번호 "]')[nextIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      const prevIdx = idx - 1;
      if (prevIdx >= 0) {
        const prevRow = businessList[prevIdx];
        setSelectedBusiness(prevRow);
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="사업번호 "]')[prevIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'Enter') {
      // 엔터키로 선택
      const currentRow = businessList[idx];
      if (currentRow) {
        handleDoubleClick(currentRow);
      }
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 유효성 체크 (레거시 chkValidation 함수)
  const checkValidation = (): boolean => {
    // 사업예산 계획일 경우
    if (planYn) {
      if (!progressStates.new && !progressStates.sales) {
        alert('진행상태를 선택하세요.');
        return false;
      }
    } else {
      if (!progressStates.confirmed && !progressStates.contract && !progressStates.completed) {
        alert('진행상태를 선택하세요.');
        return false;
      }
    }
    return true;
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
    // 권한에 따른 기본 설정
    setDefaultSearchType();
    setProgressStateByType(''); // 기본 진행상태 설정
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
          tabIndex={0}
          aria-label="닫기"
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
                    onChange={(e) => handleHqChange(e.target.value)}
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
                    {deptList.map((dept) => (
                      <option key={dept.deptDivCd} value={dept.deptDivCd}>
                        {dept.deptNm}
                      </option>
                    ))}
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
                    onKeyDown={handleKeyPress}
                    tabIndex={0}
                    aria-label="사업번호 입력"
                  />
                </td>
                <td className="search-td text-right" colSpan={4}>
                  <button 
                    className="btn-base btn-search"
                    onClick={() => {
                      if (checkValidation()) {
                        handleSearch();
                      }
                    }}
                    disabled={loading}
                    tabIndex={0}
                    aria-label="조회"
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
        <div className="gridbox-div scroll-area scrollbar-thin h-[400px] min-h-[200px] max-h-[400px] overflow-y-scroll bg-white mt-4">
          <table className="grid-table w-full">
            <thead>
              <tr>
                <th className="grid-th w-[50px]">No</th>
                <th className="grid-th">사업번호</th>
                <th className="grid-th w-[400px]">사업명</th>
                <th className="grid-th w-[100px]">시작일자</th>
                <th className="grid-th w-[100px]">종료일자</th>
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
                  key={item.bsnNo}
                  className={`grid-tr cursor-pointer hover:bg-gray-50${selectedBusiness && selectedBusiness.bsnNo === item.bsnNo ? ' !bg-blue-100' : ''}`}
                  onClick={() => handleRowClick(item)}
                  onDoubleClick={() => handleDoubleClick(item)}
                  tabIndex={0}
                  aria-label={`사업번호 ${item.bsnNo}`}
                  onKeyDown={handleRowKeyDown(index)}
                >
                  <td className="grid-td w-[50px] text-center">{index + 1}</td>
                  <td className="grid-td truncate max-w-[120px]" title={item.bsnNo}>{item.bsnNo}</td>
                  <td className="grid-td truncate max-w-[300px]" title={item.bsnNm}>{item.bsnNm}</td>
                  <td className="grid-td truncate max-w-[100px]" title={item.bsnStrtDt}>{item.bsnStrtDt}</td>
                  <td className="grid-td truncate max-w-[100px]" title={item.bsnEndDt}>{item.bsnEndDt}</td>
                  <td className="grid-td truncate max-w-[120px]" title={item.pplsDeptNm}>{item.pplsDeptNm}</td>
                  <td className="grid-td truncate max-w-[100px]" title={item.bizRepNm}>{item.bizRepNm}</td>
                  <td className="grid-td truncate max-w-[120px]" title={item.execDeptNm}>{item.execDeptNm}</td>
                  <td className="grid-td truncate max-w-[100px]" title={item.pmNm}>{item.pmNm}</td>
                  <td className="grid-td truncate max-w-[100px]" title={item.pgrsStDivNm}>{item.pgrsStDivNm}</td>
                </tr>
              ))}
              {businessList.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="grid-td !text-center">데이터 없음</td>
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
            tabIndex={0}
            aria-label="종료"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}
