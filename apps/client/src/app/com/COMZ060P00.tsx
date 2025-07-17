"use client";
import React, { useState, useEffect } from "react";
import { useDeptDivCodes } from '@/modules/com/hooks/useCommonCodes';
import { useSearchParams } from 'next/navigation';
import '@/app/common/common.css';

interface DeptNoSearchResult {
  deptNo: string;
  deptNm: string;
  strtDt: string;
  endDt: string;
  deptDivCd: string;
  deptDivNm: string;
  hqDivCd: string;
  hqDivNm: string;
  bsnDeptKb: string;
}

const apiUrl = typeof window !== "undefined" && process.env.NODE_ENV === "development"
  ? "http://localhost:8080/api/search-dept-no"
  : "/api/search-dept-no";

export default function DeptNumberSearchPopup() {
  const params = useSearchParams();
  const initialDeptNo = params.get('deptNo') || '';
  const [form, setForm] = useState({
    deptNo: initialDeptNo,
    year: new Date().getFullYear().toString(),
    deptDivCd: '',
  });
  const [results, setResults] = useState<DeptNoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const deptDivCodes = useDeptDivCodes();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const params = new URLSearchParams({
        deptNo: form.deptNo,
        year: form.year,
        ...(form.deptDivCd ? { deptDivCd: form.deptDivCd } : {}),
      });
      const url = `${apiUrl}?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      const results = Array.isArray(data) ? data : (data.data ?? []);
      setResults(results);
    } catch (err: any) {
      setError(err.message || "오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 그리드 행 더블클릭 시 부모창에 값 전달
  const handleRowDoubleClick = (row: DeptNoSearchResult) => {
    if (window.opener) {
      window.opener.postMessage({ type: 'DEPT_SELECT', payload: row }, '*');
    }
    window.close();
  };

  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">부서번호 검색</h3>
        {/* 닫기 버튼은 실제 팝업이 아니므로 생략 또는 필요시 구현 */}
      </div>
      <div className="popup-body">
        {/* 조회영역 */}
        <div className="search-div mb-4">
          <table className="search-table">
            <tbody>
              <tr className="search-tr">
                <th className="search-th w-[70px]">년도</th>
                <td className="search-td w-[120px]">
                  <input
                    type="text"
                    name="year"
                    className="input-base input-default w-full"
                    value={form.year}
                    onChange={handleChange}
                    aria-label="년도"
                  />
                </td>
                <th className="search-th w-[92px]">부서번호</th>
                <td className="search-td w-[180px]">
                  <input
                    type="text"
                    name="deptNo"
                    className="input-base input-default w-full"
                    value={form.deptNo}
                    onChange={handleChange}
                    aria-label="부서번호"
                  />
                </td>
                <th className="search-th w-[92px]">부서구분</th>
                <td className="search-td w-[180px]">
                  <select
                    name="deptDivCd"
                    className="combo-base w-full"
                    value={form.deptDivCd}
                    onChange={handleChange}
                    aria-label="부서구분"
                  >
                    <option value="">전체</option>
                    {deptDivCodes.map((item, idx) => {
                      // @ts-ignore: DB 응답이 대문자 속성일 수 있음
                      const code = item.code || item.CODE;
                      // @ts-ignore
                      const name = item.name || item.NAME;
                      return (
                        <option key={code || idx} value={code}>{code} - {name}</option>
                      );
                    })}
                  </select>
                </td>
                <td className="search-td text-right" colSpan={2}>
                  <button
                    className="btn-base btn-search mr-2"
                    onClick={handleSearch}
                    tabIndex={0}
                    aria-label="조회"
                    onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
                  >
                    {loading ? "조회중..." : "조회"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 에러 메시지 */}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {/* 그리드 영역 */}
        <div className="gridbox-div mb-4 scroll-area scrollbar-thin overflow-y-scroll h-[480px] min-h-[120px] max-h-[480px]">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="grid-th">부서번호</th>
                <th className="grid-th">부서명</th>
                <th className="grid-th">시작일자</th>
                <th className="grid-th">종료일자</th>
                <th className="grid-th">본부구분</th>
                <th className="grid-th">부서구분</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && !loading && (
                <tr><td colSpan={6} className="text-center p-4">조회 결과가 없습니다.</td></tr>
              )}
              {results.map((item, idx) => (
                // @ts-ignore: DB 응답이 대문자 속성일 수 있음
                <tr key={idx} className="grid-tr" onDoubleClick={() => handleRowDoubleClick(item)}>
                  {/* @ts-ignore */}
                  <td className="grid-td truncate max-w-[100px]" title={item.deptNo || item.DEPT_NO}>{item.deptNo || item.DEPT_NO}</td>
                  {/* @ts-ignore */}
                  <td className="grid-td truncate max-w-[180px]" title={item.deptNm || item.DEPT_NM}>{item.deptNm || item.DEPT_NM}</td>
                  {/* @ts-ignore */}
                  <td className="grid-td truncate max-w-[100px]" title={item.strtDt || item.STRT_DT}>{item.strtDt || item.STRT_DT}</td>
                  {/* @ts-ignore */}
                  <td className="grid-td truncate max-w-[100px]" title={item.endDt || item.END_DT}>{item.endDt || item.END_DT}</td>
                  {/* @ts-ignore */}
                  <td className="grid-td truncate max-w-[120px]" title={item.hqDivNm || item.HQ_DIV_NM}>{item.hqDivNm || item.HQ_DIV_NM}</td>
                  {/* @ts-ignore */}
                  <td className="grid-td truncate max-w-[120px]" title={item.deptDivNm || item.DEPT_DIV_NM}>{item.deptDivNm || item.DEPT_DIV_NM}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 종료 버튼 (우측 정렬) */}
        <div className="flex justify-end">
          <button className="btn-base btn-delete" onClick={() => window.close()} tabIndex={0} aria-label="종료">종료</button>
        </div>
      </div>
    </div>
  );
} 