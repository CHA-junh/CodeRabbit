'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import '@/app/common/common.css';

// 대분류 코드 타입
interface LargeCode {
  LRG_CSF_CD: string;
  LRG_CSF_NM: string;
  USE_YN: string;
  EXPL: string;
}

// 소분류 코드 타입
interface SmallCode {
  SML_CSF_CD: string;
  SML_CSF_NM: string;
  SORT_ORD: number;
  USE_YN: string;
  EXPL: string;
  LINK_CD1: string;
  LINK_CD2: string;
  LINK_CD3: string; // 추가, 화면에는 숨김
  LRG_CSF_CD: string;
}

const defaultLargeCode: LargeCode = {
  LRG_CSF_CD: '',
  LRG_CSF_NM: '',
  USE_YN: 'Y',
  EXPL: '',
};

const defaultSmallCode: SmallCode = {
  SML_CSF_CD: '',
  SML_CSF_NM: '',
  SORT_ORD: 1,
  USE_YN: 'Y',
  EXPL: '',
  LINK_CD1: '',
  LINK_CD2: '',
  LINK_CD3: '', // 추가, 화면에는 숨김
  LRG_CSF_CD: '',
};

// 토스트 알림 컴포넌트
const Toast: React.FC<{ message: string; type?: 'success' | 'error'; onClose: () => void }> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded shadow-lg text-white text-sm font-semibold ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
      role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

const COMZ010M00Page = () => {
  // 검색 상태
  const [searchLRG_CSF_CD, setSearchLRG_CSF_CD] = useState('');
  const [searchLRG_CSF_NM, setSearchLRG_CSF_NM] = useState('');

  // 목록 상태
  const [largeCodes, setLargeCodes] = useState<LargeCode[]>([]);
  const [smallCodes, setSmallCodes] = useState<SmallCode[]>([]);

  // 선택/폼 상태
  const [selectedLarge, setSelectedLarge] = useState<LargeCode | null>(null);
  const [largeForm, setLargeForm] = useState<LargeCode>(defaultLargeCode);
  const [smallForm, setSmallForm] = useState<SmallCode>(defaultSmallCode);

  // 로딩/에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'success' });

  const { session } = useAuth();
  const USER_ID = session.user?.userId || session.user?.empNo || 'SYSTEM';

  const apiUrl = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/COMZ010M00'
    : '/api/COMZ010M00';

  // 대분류 코드 목록 조회 함수
  const fetchLargeCodes = async (LRG_CSF_CD = '', LRG_CSF_NM = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SP: 'COM_01_0101_S(?,?)',
          PARAM: `${LRG_CSF_CD}|${LRG_CSF_NM}`,
        }),
      });
      if (!res.ok) throw new Error('조회 실패');
      const data = await res.json();
      setLargeCodes(data.data || []);
    } catch (e: any) {
      setError(e.message || '에러 발생');
    } finally {
      setLoading(false);
    }
  };

  // 소분류 코드 목록 조회 함수
  const fetchSmallCodes = async (LRG_CSF_CD: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SP: 'COM_01_0104_S(?)',
          PARAM: LRG_CSF_CD,
        }),
      });
      if (!res.ok) throw new Error('소분류 조회 실패');
      const data = await res.json();
      setSmallCodes(data.data || []);
    } catch (e: any) {
      setError(e.message || '에러 발생');
    } finally {
      setLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = () => {
    fetchLargeCodes(searchLRG_CSF_CD, searchLRG_CSF_NM);
    setLargeForm(defaultLargeCode); // 대분류 등록 폼 초기화
    setSmallForm(defaultSmallCode); // 소분류 등록 폼 초기화
    setSmallCodes([]); // 소분류 그리드 초기화
    setSelectedLarge(null); // 대분류 선택 해제
  };

  // 대분류 행 클릭 시 소분류 목록 조회
  const handleLargeRowClick = (row: LargeCode) => {
    setSelectedLarge(row);
    setLargeForm(row);
    fetchSmallCodes(row.LRG_CSF_CD);
  };

  // 대분류 행 더블클릭 시 폼 포커스
  const handleLargeRowDoubleClick = (row: LargeCode) => {
    setSelectedLarge(row);
    setLargeForm(row);
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('input[name="LRG_CSF_CD"]')?.focus();
    }, 0);
  };
  // 소분류 행 더블클릭 시 폼 포커스
  const handleSmallRowDoubleClick = (row: SmallCode) => {
    setSmallForm(row);
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('input[name="SML_CSF_CD"]')?.focus();
    }, 0);
  };

  const handleLargeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLargeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLargeNew = () => {
    setLargeForm(defaultLargeCode);
    setSelectedLarge(null);
  };

  // 대분류 코드 중복 체크
  const isLargeCodeDuplicate = (code: string) => {
    return largeCodes.some(item => item.LRG_CSF_CD === code);
  };
  // 소분류 코드 중복 체크
  const isSmallCodeDuplicate = (code: string) => {
    return smallCodes.some(item => item.SML_CSF_CD === code);
  };

  // 대분류 저장(등록/수정)
  const handleLargeSave = async () => {
    // 필수값 체크
    if (!largeForm.LRG_CSF_CD) {
      setError('대분류코드를 입력하세요.');
      setToast({ message: '대분류코드를 입력하세요.', type: 'error' });
      document.querySelector<HTMLInputElement>('input[name="LRG_CSF_CD"]')?.focus();
      return;
    }
    if (!largeForm.LRG_CSF_NM) {
      setError('대분류명을 입력하세요.');
      setToast({ message: '대분류명을 입력하세요.', type: 'error' });
      document.querySelector<HTMLInputElement>('input[name="LRG_CSF_NM"]')?.focus();
      return;
    }
    // 신규 등록 시 중복 체크 (수정은 허용)
    if (!selectedLarge && isLargeCodeDuplicate(largeForm.LRG_CSF_CD)) {
      setError('이미 존재하는 대분류코드입니다.');
      setToast({ message: '이미 존재하는 대분류코드입니다.', type: 'error' });
      document.querySelector<HTMLInputElement>('input[name="LRG_CSF_CD"]')?.focus();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const param = [
        largeForm.LRG_CSF_CD,
        largeForm.LRG_CSF_NM,
        largeForm.USE_YN,
        largeForm.EXPL,
        USER_ID,
      ].join('|');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SP: 'COM_01_0102_T(?,?,?,?,?,?)',
          PARAM: param,
        }),
      });
      if (!res.ok) throw new Error('저장 실패');
      await fetchLargeCodes();
      setLargeForm(defaultLargeCode);
      setSelectedLarge(null);
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('input[name="LRG_CSF_CD"]')?.focus();
      }, 0);
      setToast({ message: '대분류코드 저장 완료', type: 'success' });
    } catch (e: any) {
      setError(e.message || '에러 발생');
      setToast({ message: e.message || '에러 발생', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 대분류 삭제
  const handleLargeDelete = async () => {
    if (!largeForm.LRG_CSF_CD) return;
    setLoading(true);
    setError(null);
    try {
      const param = [largeForm.LRG_CSF_CD].join('|');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SP: 'COM_01_0103_D(?,?)',
          PARAM: param,
        }),
      });
      if (!res.ok) throw new Error('삭제 실패');
      await fetchLargeCodes();
      setLargeForm(defaultLargeCode);
      setSelectedLarge(null);
      setSmallCodes([]);
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('input[name="LRG_CSF_CD"]')?.focus();
      }, 0);
      setToast({ message: '대분류코드 삭제 완료', type: 'success' });
    } catch (e: any) {
      setError(e.message || '에러 발생');
      setToast({ message: e.message || '에러 발생', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 소분류 행 클릭 핸들러
  const handleSmallRowClick = (row: SmallCode) => {
    setSmallForm(row);
  };

  // 소분류 관련 핸들러
  const handleSmallFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSmallForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSmallNew = () => {
    setSmallForm(defaultSmallCode);
    if (selectedLarge) {
      setSmallForm((prev) => ({ ...prev, LRG_CSF_CD: selectedLarge.LRG_CSF_CD }));
    }
  };

  // 소분류 저장(등록/수정)
  const handleSmallSave = async () => {
    // 필수값 체크
    if (!smallForm.SML_CSF_CD) {
      setError('소분류코드를 입력하세요.');
      setToast({ message: '소분류코드를 입력하세요.', type: 'error' });
      document.querySelector<HTMLInputElement>('input[name="SML_CSF_CD"]')?.focus();
      return;
    }
    if (!smallForm.SML_CSF_NM) {
      setError('소분류명을 입력하세요.');
      setToast({ message: '소분류명을 입력하세요.', type: 'error' });
      document.querySelector<HTMLInputElement>('input[name="SML_CSF_NM"]')?.focus();
      return;
    }
    // 신규 등록 시 중복 체크 (수정은 허용)
    if (!smallForm.LRG_CSF_CD) {
      setError('대분류코드를 먼저 선택하세요.');
      setToast({ message: '대분류코드를 먼저 선택하세요.', type: 'error' });
      return;
    }
    if (!smallCodes || !Array.isArray(smallCodes)) {
      setError('소분류 목록이 올바르지 않습니다.');
      setToast({ message: '소분류 목록이 올바르지 않습니다.', type: 'error' });
      return;
    }
    if (!selectedLarge && isSmallCodeDuplicate(smallForm.SML_CSF_CD)) {
      setError('이미 존재하는 소분류코드입니다.');
      setToast({ message: '이미 존재하는 소분류코드입니다.', type: 'error' });
      document.querySelector<HTMLInputElement>('input[name="SML_CSF_CD"]')?.focus();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const param = [
        smallForm.LRG_CSF_CD,
        smallForm.SML_CSF_CD,
        smallForm.SML_CSF_NM,
        smallForm.LINK_CD1,
        smallForm.LINK_CD2,
        smallForm.LINK_CD3, // 추가
        smallForm.SORT_ORD,
        smallForm.USE_YN,
        smallForm.EXPL,
        USER_ID,
      ].join('|');
      const fetchBody = {
        SP: 'COM_01_0105_T(?,?,?,?,?,?,?,?,?,?,?)',
        PARAM: param,
      };
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fetchBody),
      });
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {}
      if (!res.ok) throw new Error('저장 실패');
      if (smallForm.LRG_CSF_CD) await fetchSmallCodes(smallForm.LRG_CSF_CD);
      setSmallForm(defaultSmallCode);
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('input[name="SML_CSF_CD"]')?.focus();
      }, 0);
      setToast({ message: '소분류코드 저장 완료', type: 'success' });
    } catch (e: any) {
      setError(e.message || '에러 발생');
      setToast({ message: e.message || '에러 발생', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 소분류 삭제
  const handleSmallDelete = async () => {
    if (!smallForm.LRG_CSF_CD || !smallForm.SML_CSF_CD) return;
    setLoading(true);
    setError(null);
    try {
      const param = [smallForm.LRG_CSF_CD, smallForm.SML_CSF_CD].join('|');
      const res = await fetch('http://localhost:8080/api/procedure-demo/comz010m00', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SP: 'COM_01_0106_D(?,?,?)',
          PARAM: param,
        }),
      });
      if (!res.ok) throw new Error('삭제 실패');
      await fetchSmallCodes(smallForm.LRG_CSF_CD);
      setSmallForm(defaultSmallCode);
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('input[name="SML_CSF_CD"]')?.focus();
      }, 0);
      setToast({ message: '소분류코드 삭제 완료', type: 'success' });
    } catch (e: any) {
      setError(e.message || '에러 발생');
      setToast({ message: e.message || '에러 발생', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 대분류 코드 입력 시 실시간 중복 체크
  const handleLargeCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLargeForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'LRG_CSF_CD' && isLargeCodeDuplicate(value)) {
      setError('이미 존재하는 대분류코드입니다.');
    } else {
      setError(null);
    }
  };
  // 소분류 코드 입력 시 실시간 중복 체크
  const handleSmallCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSmallForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'SML_CSF_CD' && isSmallCodeDuplicate(value)) {
      setError('이미 존재하는 소분류코드입니다.');
    } else {
      setError(null);
    }
  };

  // 대분류 등록 폼 엔터키 저장
  const handleLargeFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    if (e.key === 'Enter') {
      handleLargeSave();
    }
  };
  // 소분류 등록 폼 엔터키 저장
  const handleSmallFormKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    if (e.key === 'Enter') {
      handleSmallSave();
    }
  };
  // 검색 input 엔터키 검색
  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 대분류 그리드 키보드 ↑↓ 이동
  const handleLargeRowKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'ArrowDown') {
      const nextIdx = idx + 1;
      if (nextIdx < largeCodes.length) {
        const nextRow = largeCodes[nextIdx];
        setSelectedLarge(nextRow);
        setLargeForm(nextRow);
        fetchSmallCodes(nextRow.LRG_CSF_CD);
        // 다음 행에 포커스 이동
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="대분류코드 "]')[nextIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      const prevIdx = idx - 1;
      if (prevIdx >= 0) {
        const prevRow = largeCodes[prevIdx];
        setSelectedLarge(prevRow);
        setLargeForm(prevRow);
        fetchSmallCodes(prevRow.LRG_CSF_CD);
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="대분류코드 "]')[prevIdx]?.focus();
        }, 0);
      }
    }
  };
  // 소분류 그리드 키보드 ↑↓ 이동
  const handleSmallRowKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'ArrowDown') {
      const nextIdx = idx + 1;
      if (nextIdx < smallCodes.length) {
        const nextRow = smallCodes[nextIdx];
        setSmallForm(nextRow);
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="소분류코드 "]')[nextIdx]?.focus();
        }, 0);
      }
    } else if (e.key === 'ArrowUp') {
      const prevIdx = idx - 1;
      if (prevIdx >= 0) {
        const prevRow = smallCodes[prevIdx];
        setSmallForm(prevRow);
        setTimeout(() => {
          document.querySelectorAll<HTMLTableRowElement>('tr[aria-label^="소분류코드 "]')[prevIdx]?.focus();
        }, 0);
      }
    }
  };

  // 최초 마운트 시 전체 조회
  useEffect(() => {
    fetchLargeCodes();
    setSmallCodes([]); // 초기화
  }, []);

  return (
    <div className="popup-wrapper">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">대분류/소분류코드 관리</h3>
        <button className="popup-close" type="button" aria-label="닫기" tabIndex={0}>×</button>
      </div>
      <div className="popup-body">
        
        {/* 🔍 조회 영역 */}
        <div className="search-div mb-3">
          <table className="search-table">
            <tbody>
              <tr className="search-tr">
                <th className="search-th w-[110px]">대분류 코드</th>
                <td className="search-td w-[15%]">
                  <input type="text" className="input-base input-default w-full" name="searchLRG_CSF_CD" value={searchLRG_CSF_CD} onChange={e => setSearchLRG_CSF_CD(e.target.value)} onKeyDown={handleSearchInputKeyDown} tabIndex={0} aria-label="대분류코드 검색" />
                </td>
                <th className="search-th w-[100px]">대분류명</th>
                <td className="search-td  w-[20%]">
                  <input type="text" className="input-base input-default w-full" name="searchLRG_CSF_NM" value={searchLRG_CSF_NM} onChange={e => setSearchLRG_CSF_NM(e.target.value)} onKeyDown={handleSearchInputKeyDown} tabIndex={0} aria-label="대분류명 검색" />
                </td>
                <td className="search-td text-right">
                  <button className="btn-base btn-search ml-2" onClick={handleSearch} tabIndex={0} aria-label="조회">조회</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-4">
          {/* 대분류 코드 테이블 */}
          <div className="flex-1">
            <div className="gridbox-div scroll-area scrollbar-thin h-[240px] min-h-[120px] max-h-[240px] overflow-y-scroll bg-white mb-4">
              <table className="grid-table w-full">
                <thead>
                  <tr>
                    <th className="grid-th">대분류코드</th>
                    <th className="grid-th">대분류명</th>
                    <th className="grid-th">사용여부</th>
                    <th className="grid-th">설명</th>
                  </tr>
                </thead>
                <tbody>
                  {largeCodes.length === 0 ? (
                    <tr><td colSpan={4} className="grid-td !text-center">데이터 없음</td></tr>
                  ) : (
                    largeCodes.map((row, idx) => (
                      <tr
                        className={`grid-tr cursor-pointer${selectedLarge && selectedLarge.LRG_CSF_CD === row.LRG_CSF_CD ? ' !bg-blue-100' : ''}`}
                        key={row.LRG_CSF_CD ? `${row.LRG_CSF_CD}-${idx}` : idx}
                        onClick={() => handleLargeRowClick(row)}
                        tabIndex={0}
                        aria-label={`대분류코드 ${row.LRG_CSF_CD}`}
                        onDoubleClick={() => handleLargeRowDoubleClick(row)}
                        onKeyDown={handleLargeRowKeyDown(idx)}
                      >
                        <td className="grid-td truncate max-w-[100px]" title={row.LRG_CSF_CD}>{row.LRG_CSF_CD}</td>
                        <td className="grid-td truncate max-w-[180px]" title={row.LRG_CSF_NM}>{row.LRG_CSF_NM}</td>
                        <td className="grid-td truncate max-w-[60px]" title={row.USE_YN}>{row.USE_YN}</td>
                        <td className="grid-td truncate max-w-[200px]" title={row.EXPL}>{row.EXPL}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* 대분류 등록 폼 */}
            <div className="border border-stone-300 p-3 rounded">
              <div className="tit_area flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold">대분류코드 등록</h4>
                <button className="btn-base btn-etc" onClick={handleLargeNew} tabIndex={0} aria-label="신규">신규</button>
              </div>
              <table className="form-table w-full mb-4" onKeyDown={handleLargeFormKeyDown}>
                <tbody>
                  <tr className="form-tr">
                    <th className="form-th w-[120px]">대분류코드</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="LRG_CSF_CD" value={largeForm.LRG_CSF_CD || ''} onChange={handleLargeCodeChange} tabIndex={0} aria-label="대분류코드 입력" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th w-[120px]">대분류명</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="LRG_CSF_NM" value={largeForm.LRG_CSF_NM || ''} onChange={handleLargeFormChange} tabIndex={0} aria-label="대분류명 입력" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">사용여부</th>
                    <td className="form-td">
                      <select className="input-base input-default w-full" name="USE_YN" value={largeForm.USE_YN || ''} onChange={handleLargeFormChange} tabIndex={0} aria-label="사용여부 선택">
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">설명</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="EXPL" value={largeForm.EXPL || ''} onChange={handleLargeFormChange} tabIndex={0} aria-label="설명 입력" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end">
                <button className="btn-base btn-delete" onClick={handleLargeDelete} tabIndex={0} aria-label="삭제">삭제</button>
                <button className="btn-base btn-act mr-2" onClick={handleLargeSave} tabIndex={0} aria-label="저장">저장</button>
              </div>
            </div>
          </div>
          {/* 소분류 코드 테이블 */}
          <div className="flex-1">
            <div className="gridbox-div scroll-area scrollbar-thin h-[240px] min-h-[120px] max-h-[240px] overflow-y-scroll bg-white mb-4">
              <table className="grid-table w-full">
                <thead>
                  <tr>
                    <th className="grid-th">소분류코드</th>
                    <th className="grid-th">소분류명</th>
                    <th className="grid-th">정렬순서</th>
                    <th className="grid-th">사용여부</th>
                    <th className="grid-th">설명</th>
                  </tr>
                </thead>
                <tbody>
                  {smallCodes.length === 0 ? (
                    <tr><td colSpan={5} className="grid-td !text-center">데이터 없음</td></tr>
                  ) : (
                    smallCodes.map((row, idx) => (
                      <tr
                        className={`grid-tr${smallForm.LRG_CSF_CD === row.LRG_CSF_CD && smallForm.SML_CSF_CD === row.SML_CSF_CD ? ' !bg-blue-100' : ''}`}
                        key={row.SML_CSF_CD ? `${row.SML_CSF_CD}-${idx}` : idx}
                        tabIndex={0}
                        aria-label={`소분류코드 ${row.SML_CSF_CD}`}
                        onClick={() => handleSmallRowClick(row)}
                        onDoubleClick={() => handleSmallRowDoubleClick(row)}
                        onKeyDown={handleSmallRowKeyDown(idx)}
                      >
                        <td className="grid-td truncate max-w-[100px]" title={row.SML_CSF_CD}>{row.SML_CSF_CD}</td>
                        <td className="grid-td truncate max-w-[180px]" title={row.SML_CSF_NM}>{row.SML_CSF_NM}</td>
                        <td className="grid-td text-right truncate max-w-[60px]" title={String(row.SORT_ORD)}>{row.SORT_ORD}</td>
                        <td className="grid-td truncate max-w-[60px]" title={row.USE_YN}>{row.USE_YN}</td>
                        <td className="grid-td truncate max-w-[200px]" title={row.EXPL}>{row.EXPL}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* 소분류 등록 폼 */}
            <div className="border border-stone-300 p-3 rounded">
              <div className="tit_area flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold">소분류코드 등록</h4>
                <button className="btn-base btn-etc" onClick={handleSmallNew} tabIndex={0} aria-label="신규">신규</button>
              </div>
              <table className="form-table w-full mb-2" onKeyDown={handleSmallFormKeyDown}>
                <tbody>
                  <tr className="form-tr">
                    <th className="form-th w-[120px]">대분류코드</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="LRG_CSF_CD" value={smallForm.LRG_CSF_CD || ''} onChange={handleSmallFormChange} tabIndex={0} aria-label="대분류코드 입력" />
                    </td>
                    <th className="form-th w-[120px]">소분류코드</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="SML_CSF_CD" value={smallForm.SML_CSF_CD || ''} onChange={handleSmallCodeChange} tabIndex={0} aria-label="소분류코드 입력" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">소분류명</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="SML_CSF_NM" value={smallForm.SML_CSF_NM || ''} onChange={handleSmallFormChange} tabIndex={0} aria-label="소분류명 입력" />
                    </td>
                    <th className="form-th">연결코드1</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="LINK_CD1" value={smallForm.LINK_CD1 || ''} onChange={handleSmallFormChange} tabIndex={0} aria-label="연결코드1 입력" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">연결코드2</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="LINK_CD2" value={smallForm.LINK_CD2 || ''} onChange={handleSmallFormChange} tabIndex={0} aria-label="연결코드2 입력" />
                    </td>
                    <th className="form-th">정렬순서</th>
                    <td className="form-td">
                      <input type="number" className="input-base input-default w-full" name="SORT_ORD" value={smallForm.SORT_ORD || 0} onChange={handleSmallFormChange} tabIndex={0} aria-label="정렬순서 입력" />
                    </td>
                  </tr>
                  <tr className="form-tr">
                    <th className="form-th">사용여부</th>
                    <td className="form-td">
                      <select className="input-base input-default w-full" name="USE_YN" value={smallForm.USE_YN || ''} onChange={handleSmallFormChange} tabIndex={0} aria-label="사용여부 선택">
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </td>
                    <th className="form-th">설명</th>
                    <td className="form-td">
                      <input type="text" className="input-base input-default w-full" name="EXPL" value={smallForm.EXPL || ''} onChange={handleSmallFormChange} tabIndex={0} aria-label="설명 입력" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end">
                <button className="btn-base btn-delete mr-2" onClick={handleSmallDelete} tabIndex={0} aria-label="삭제">삭제</button>
                <button className="btn-base btn-act mr-2" onClick={handleSmallSave} tabIndex={0} aria-label="저장">저장</button>
                <button
                  className="btn-base btn-delete"
                  tabIndex={0}
                  aria-label="종료"
                  onClick={() => window.close()}
                >종료</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default COMZ010M00Page; 