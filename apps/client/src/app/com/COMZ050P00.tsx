'use client';

import React, { useState, useEffect } from 'react';
import '@/app/common/common.css';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useSearchParams } from 'next/navigation';


// DB 컬럼명 기준 타입 정의
interface BusinessNameSearchResult {
  BSN_NO: string;
  BSN_DIV: string;
  BSN_DIV_NM: string;
  BSN_NM: string;
  ORD_PLC: string;
  DEPT_NO: string;
  SALE_DIV: string;
  SALE_DIV_NM: string;
  BSN_YR: string;
  SEQ_NO: string;
  PGRS_ST_DIV: string;
  PGRS_ST_DIV_NM: string;
  BSN_STRT_DT: string;
  BSN_END_DT: string;
  BIZ_REPNM: string;
  PM_NM: string;
  CTR_DT: string;
  PPLS_DEPT_NM: string;
  PPLS_DEPT_CD: string;
  PPLS_HQ_CD: string;
  EXEC_DEPT_NM: string;
  EXEC_DEPT_CD: string;
  EXEC_HQ_CD: string;
  RMK: string;
  REG_DTTM: string;
  CHNG_DTTM: string;
  CHNGR_ID: string;
  [key: string]: any; // 대소문자 혼용 대응
}

const PGRS_STATES = [
  { code: '1', label: '신규' },
  { code: '2', label: '영업진행' },
  { code: '3', label: '수주확정' },
  { code: '4', label: '계약' },
  { code: '8', label: '완료(종결)' },
  { code: '7', label: '수주실패' },
  { code: '9', label: '취소(삭제)' },
];

const getCurrentYear = () => new Date().getFullYear().toString();

const BusinessNameSearchPopup: React.FC = () => {
  // 쿼리스트링 파라미터 읽기
  const params = useSearchParams();
  const initialBsnNm = params?.get('bsnNm') || '';
  const mode = params?.get('mode') || '';

  // 상태
  const [checkedStates, setCheckedStates] = useState<string[]>(PGRS_STATES.map(s => s.code));
  const [allChecked, setAllChecked] = useState(true);
  const [startYear, setStartYear] = useState('ALL');
  const [yearList, setYearList] = useState<string[]>([]);
  const [bsnNm, setBsnNm] = useState(initialBsnNm);
  const [searchKey, setSearchKey] = useState('');
  const [data, setData] = useState<BusinessNameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  
  // 세션에서 로그인ID 가져오기 (우선순위: userId > empNo > name)
  const loginId = session.user?.userId || session.user?.empNo || session.user?.name || '';
  


  // mode별 진행상태 체크박스 제어(레거시 호환)
  useEffect(() => {
    if (!mode) return;
    if (mode === 'plan') {
      setCheckedStates(['1', '2']);
      setAllChecked(false);
    } else if (mode === 'rsts') {
      setCheckedStates(['3', '4', '8']);
      setAllChecked(false);
    } else if (mode === 'mans') {
      setCheckedStates(['2', '3', '4', '8']);
      setAllChecked(false);
    } else {
      setCheckedStates(PGRS_STATES.map(s => s.code));
      setAllChecked(true);
    }
  }, [mode]);

  // 연도 콤보박스 데이터 (최근 10년 + ALL)
  useEffect(() => {
    const now = parseInt(getCurrentYear(), 10);
    const years = Array.from({ length: 10 }, (_, i) => (now - i).toString());
    setYearList(['ALL', ...years]);
  }, []);

  // 모두선택 체크박스 핸들러
  const handleAllCheck = () => {
    if (allChecked) {
      setCheckedStates([]);
      setAllChecked(false);
    } else {
      setCheckedStates(PGRS_STATES.map(s => s.code));
      setAllChecked(true);
    }
  };

  // 개별 상태 체크박스 핸들러
  const handleStateCheck = (code: string) => {
    let next;
    if (checkedStates.includes(code)) {
      next = checkedStates.filter(c => c !== code);
    } else {
      next = [...checkedStates, code];
    }
    setCheckedStates(next);
    setAllChecked(next.length === PGRS_STATES.length);
  };

  // 연도 콤보박스 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartYear(e.target.value);
  };

  // 사업명 입력 핸들러
  const handleBsnNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBsnNm(e.target.value);
  };

  // 조회 버튼 클릭
  const handleSearch = async () => {
    setLoading(true);
    setSearchKey(bsnNm);
    try {
      const body = {
        SP: 'COM_02_0201_S(?, ?, ?, ?, ?)',
        PARAM: [
          bsnNm,
          startYear,
          checkedStates.length === 0 ? 'ALL' : checkedStates.join(','),
          loginId // 실제 로그인ID
        ].join('|'),
      };
      

      const res = await fetch('http://localhost:8080/api/business-name-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('API 요청 실패');
      const result = await res.json();
      setData(result.data || []);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 종료 버튼 핸들러
  const handleClose = () => {
    window.close(); // 팝업 닫기(실제 환경에 맞게 수정)
  };

  // 그리드 더블클릭 시 부모창에 값 반환
  const handleRowDoubleClick = (item: BusinessNameSearchResult) => {
    if (window.opener) {
      window.opener.postMessage({
        type: 'BSN_SELECT',
        payload: {
          BSN_NO: item.BSN_NO,
          BSN_NM: item.BSN_NM,
          // 필요시 추가 필드
        }
      }, '*');
    }
    window.close();
  };

  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">사업명 검색</h3>
        <button className="popup-close" type="button" aria-label="팝업 닫기" tabIndex={0} onClick={handleClose} onKeyDown={e => { if (e.key === 'Enter') handleClose(); }}>×</button>
      </div>

      <div className="popup-body">
        {/* 검색 조건 */}
        <div className="search-div">
          <table className="search-table">
            <tbody>
              <tr className="search-tr">
                <th className="search-th w-[100px]">진행상태</th>
                <td className="search-td" colSpan={7}>
                  <label className="mr-2">
                    <input type="checkbox" checked={allChecked} onChange={handleAllCheck} tabIndex={0} aria-label="모두선택" /> (모두선택)
                  </label>
                  {PGRS_STATES.map(st => (
                    <label className="mr-2" key={st.code}>
                      <input
                        type="checkbox"
                        checked={checkedStates.includes(st.code)}
                        onChange={() => handleStateCheck(st.code)}
                        tabIndex={0}
                        aria-label={st.label}
                      /> {st.label}
                    </label>
                  ))}
                </td>
              </tr>
              <tr className="search-tr">
                <th className="search-th">시작년도</th>
                <td className="search-td w-[120px]">
                  <select className="combo-base !w-[120px]" value={startYear} onChange={handleYearChange} tabIndex={0} aria-label="시작년도">
                    {yearList.map(y => <option key={y} value={y}>{y === 'ALL' ? '전체' : y}</option>)}
                  </select>
                </td>
                <th className="search-th w-[110px]">사업명</th>
                <td className="search-td  w-[25%]">
                  <input type="text" className="input-base input-default w-[200px]" value={bsnNm} onChange={handleBsnNmChange} tabIndex={0} aria-label="사업명" />
                </td>
                <td className="search-td text-right" colSpan={2}>
                  <button className="btn-base btn-search" onClick={handleSearch} tabIndex={0} aria-label="조회">조회</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 유사사업명칭 */}
        <div className="clearbox-div mt-4">
          <table className="clear-table">
            <tbody>
              <tr className="clear-tr">
                <th className="clear-th w-[150px]">유사 사업명칭 조회결과 </th>
                <td className="clear-td">
                  <input type="text" className="input-base input-default w-[300px]" value={searchKey} readOnly placeholder="검색 KEY" tabIndex={-1} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 검색 결과 그리드 */}
        <div className="gridbox-div mt-4 scroll-area scrollbar-thin overflow-y-scroll h-[480px] min-h-[120px] max-h-[480px]">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th w-[40px]">No</th>
                <th className="grid-th">사업번호</th>
                <th className="grid-th w-[25%]">사업명</th>
                <th className="grid-th">시작일자</th>
                <th className="grid-th">종료일자</th>
                <th className="grid-th">사업부서</th>
                <th className="grid-th">영업대표</th>
                <th className="grid-th">실행부서</th>
                <th className="grid-th">PM</th>
                <th className="grid-th">상태</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="grid-tr"><td colSpan={10} className="p-4 text-center">로딩중...</td></tr>
              ) : data.length === 0 ? (
                <tr className="grid-tr"><td colSpan={10} className="p-4 text-center">조회 결과가 없습니다.</td></tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    className="grid-tr"
                    key={item.BSN_NO || item.bsnNo || idx}
                    onDoubleClick={() => handleRowDoubleClick(item)}
                    tabIndex={0}
                    aria-label={`사업번호 ${item.BSN_NO || item.bsnNo}`}
                  >
                    <td className="grid-td text-center w-[40px]">{idx + 1}</td>
                    <td className="grid-td truncate max-w-[120px]" title={item.BSN_NO || item.bsnNo}>{item.BSN_NO || item.bsnNo}</td>
                    <td className="grid-td truncate max-w-[320px]" title={item.BSN_NM || item.bsnNm}>{item.BSN_NM || item.bsnNm}</td>
                    <td className="grid-td truncate max-w-[100px]" title={item.BSN_STRT_DT || item.bsnStrtDt}>{item.BSN_STRT_DT || item.bsnStrtDt}</td>
                    <td className="grid-td truncate max-w-[100px]" title={item.BSN_END_DT || item.bsnEndDt}>{item.BSN_END_DT || item.bsnEndDt}</td>
                    <td className="grid-td truncate max-w-[120px]" title={item.PPLS_DEPT_NM || item.pplsDeptNm}>{item.PPLS_DEPT_NM || item.pplsDeptNm}</td>
                    <td className="grid-td truncate max-w-[120px]" title={item.BIZ_REPNM || item.bizRepnm}>{item.BIZ_REPNM || item.bizRepnm}</td>
                    <td className="grid-td truncate max-w-[120px]" title={item.EXEC_DEPT_NM || item.execDeptNm}>{item.EXEC_DEPT_NM || item.execDeptNm}</td>
                    <td className="grid-td truncate max-w-[80px]" title={item.PM_NM || item.pmNm}>{item.PM_NM || item.pmNm}</td>
                    <td className="grid-td truncate max-w-[100px]" title={item.PGRS_ST_DIV_NM || item.pgrsStDivNm}>{item.PGRS_ST_DIV_NM || item.pgrsStDivNm}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 종료 버튼 */}
        <div className="flex justify-end mt-4">
          <button className="btn-base btn-delete" onClick={() => window.close()} tabIndex={0} aria-label="종료">종료</button>
        </div>
      </div>
    </div>
  );
};

export default BusinessNameSearchPopup; 