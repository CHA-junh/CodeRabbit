'use client';

import React from 'react';
import './common.css';

export default function BSN0720M00() {
  return (
    <div className="">
      <table className="form-table">
        <tbody>
            {/* 1행 */}
            <tr className="form-tr">
            <th className="form-th w-[110px]">접수일자</th>
            <td className="form-td w-[150px]">
                <input type="date" className="input-base input-calender" />
            </td>
            <th className="form-th w-[120px]">외주업체</th>
            <td className="form-td w-[20%]">
                <select className="combo-base">
                <option>미정(N/A)</option>
                </select>
            </td>
            <th className="form-th w-[110px]">개발자명</th>
            <td className="form-td">
                <input type="text" className="input-base input-default" />
            </td>
            <th className="form-th w-[110px]">생년월일</th>
            <td className="form-td">
                <input type="date" className="input-base input-calender" />
            </td>
            <th className="form-th w-[110px]">성별</th>
            <td className="form-td" colSpan={3}>
                <select className="combo-base w-[100px]">
                <option>남자</option>
                <option>여자</option>
                </select>
            </td>
            </tr>
            <tr className="form-tr">
            <th className="form-th">최종학력</th>
            <td className="form-td">
                <select className="combo-base">
                <option>학사</option>
                </select>
            </td>
            <th className="form-th">학교</th>
            <td className="form-td">
                <input type="text" className="input-base input-default" />
            </td>
            <th className="form-th">전공</th>
            <td className="form-td">
                <input type="text" className="input-base input-default" />
            </td>
            <th className="form-th">졸업일자</th>
            <td className="form-td">
                <input type="date" className="input-base input-calender" />
            </td>
            </tr>
            <tr className="form-tr">
            <th className="form-th">자격증</th>
            <td className="form-td">
                <input type="text" className="input-base input-default" />
            </td>
            <th className="form-th">자격증취득일자</th>
            <td className="form-td">
                <input type="date" className="input-base input-calender" />
            </td>
            <th className="form-th">최초투입일자</th>
            <td className="form-td">
                <input type="date" className="input-base input-calender" />
            </td>
            <th className="form-th">최종철수일자</th>
            <td className="form-td">
                <input type="date" className="input-base input-calender" />
            </td>
            <th className="form-th">KOSA등록유무</th>
            <td className="form-td">
                <div className="flex gap-3 items-center">
                <label><input type="radio" name="kosa" value="있다" /> 있다</label>
                <label><input type="radio" name="kosa" value="없다" /> 없다</label>
                </div>
            </td>
            </tr>

            <tr className="form-tr">
            <th className="form-th">경력기준</th>
            <td className="form-td">
                <div className="flex gap-3 items-center">
                <label><input type="radio" name="careerBase" value="학력" /> 학력</label>
                <label><input type="radio" name="careerBase" value="기술자격" /> 기술자격</label>
                </div>
            </td>
            <th className="form-th">학력경력개월</th>
            <td className="form-td" colSpan={3}>
                <div className="flex gap-2">
                <input type="text" className="input-base input-default !w-[50px]" />
                <span className="m-1">년</span>
                <input type="text" className="input-base input-default !w-[50px]" />
                <span className="m-1">개월</span>
                <button className="btn-base btn-etc">경력개월수계산</button>
                </div>
            </td>
            <th className="form-th">기술등급</th>
            <td className="form-td">
                <select className="combo-base">
                <option>초급</option>
                </select>
            </td>
            <th className="form-th">경력계산기준</th>
            <td className="form-td"><input type="text" className="input-base input-default" /></td>


            </tr>

            {/* 7행 */}
            <tr className="form-tr">
            <th className="form-th">지원프로젝트</th>
            <td className="form-td">
                <input type="text" className="input-base input-default" />
            </td>
            <th className="form-th" rowSpan={2}>비고</th>
            <td className="form-td" colSpan={7} rowSpan={2}>
                <textarea type="text" className="input-base input-default w-full !h-[58px]" />
            </td>
            </tr>

            {/* 8행 */}
            <tr className="form-tr">
            <th className="form-th">지원단가</th>
            <td className="form-td">
                <div className="flex items-center">
                <input type="text" className="input-base input-default w-[100px]" />
                <span className="m-1">원</span>
                </div>
            </td>
            </tr>
            <tr className="form-tr">
            <th className="form-th">최종진행일</th>
            <td className="form-td">
                <input type="date" className="input-base input-calender" />
            </td>
            <th className="form-th">최종단계/결과</th>
            <td className="form-td">
                <input type="text" className="input-base input-default" />
            </td>
            <th className="form-th">최종진행내용</th>
            <td className="form-td" colSpan={5}>
                <input type="text" className="input-base input-default w-full" />
            </td>
            </tr>
        </tbody>
        </table>
        <div className="flex gap-2 justify-end mt-2">
            <button className="btn-base btn-etc">신규</button>
            <button className="btn-base btn-act">저장</button>
            <button className="btn-base btn-delete">삭제</button>
        </div>
    </div>
  );
}
