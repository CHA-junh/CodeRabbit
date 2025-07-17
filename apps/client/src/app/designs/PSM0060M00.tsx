'use client';

import React from 'react';
import './common.css';

export default function RoleManagementPopup() {
  return (
    <div className="popup-wrapper">
      <div className="popup-header">
        <h3 className="popup-title">개발환경/DBMS/언어 내용 입력</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      <div className="popup-body">
        <table className="form-table my-4">
          <tbody>
            {/* 운영체제 */}
            <tr className="form-tr">
              <th className="form-th w-[120px]">운영체제(OS)</th>
              <td className="form-td">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {['UNIX', 'WINDOW', 'LINUX'].map(os => (
                    <label key={os} className="whitespace-nowrap">
                      <input type="checkbox" className="mr-1" /> {os}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-x-2 mt-1">
                  <label className="whitespace-nowrap shrink-0">
                    <input type="checkbox" className="mr-1" /> 기타
                  </label>
                  <input type="text" className="input-base input-default flex-1 min-w-[150px]" />
                </div>
              </td>
            </tr>

            {/* DBMS */}
            <tr className="form-tr">
              <th className="form-th">DBMS</th>
              <td className="form-td">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {['ORACLE', 'MS-SQL', 'DB2', 'Sybase', 'Informix'].map(db => (
                    <label key={db} className="whitespace-nowrap">
                      <input type="checkbox" className="mr-1" /> {db}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-x-2 mt-1">
                  <label className="whitespace-nowrap shrink-0">
                    <input type="checkbox" className="mr-1" /> 기타
                  </label>
                  <input type="text" className="input-base input-default flex-1 min-w-[150px]" />
                </div>
              </td>
            </tr>

            {/* 프레임웍 */}
            <tr className="form-tr">
              <th className="form-th">프레임웍</th>
              <td className="form-td">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {['Corebase', 'ProFrame', 'AnyFrame', '전자정부'].map(fw => (
                    <label key={fw} className="whitespace-nowrap">
                      <input type="checkbox" className="mr-1" /> {fw}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-x-2 mt-1">
                  <label className="whitespace-nowrap shrink-0">
                    <input type="checkbox" className="mr-1" /> 기타
                  </label>
                  <input type="text" className="input-base input-default flex-1 min-w-[150px]" />
                </div>
              </td>
            </tr>

            {/* WAS/미들웨어 */}
            <tr className="form-tr">
              <th className="form-th">WAS/미들웨어</th>
              <td className="form-td">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {['JEUS', 'Weblogic', 'WebSphere', 'MTS(COM++)', 'T-MAX', 'Tuxedo'].map(was => (
                    <label key={was} className="whitespace-nowrap">
                      <input type="checkbox" className="mr-1" /> {was}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-x-2 mt-1">
                  <label className="whitespace-nowrap shrink-0">
                    <input type="checkbox" className="mr-1" /> 기타
                  </label>
                  <input type="text" className="input-base input-default flex-1 min-w-[150px]" />
                </div>
              </td>
            </tr>

            {/* 언어/개발환경 */}
            <tr className="form-tr">
              <th className="form-th">언어/개발환경</th>
              <td className="form-td">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {[
                    'JAVA,JSP', 'EJB', '.NET,C#,ASP', 'PRO-C', 'C,C++',
                    'Ajax', 'Struts', 'iBatis', 'Spring', 'JQuery', 'HTML5',
                    'Visual Basic', 'Power Builder', 'Visual C++', 'Delphi',
                  ].map(lang => (
                    <label key={lang} className="whitespace-nowrap">
                      <input type="checkbox" className="mr-1" /> {lang}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-x-2 mt-1">
                  <label className="whitespace-nowrap shrink-0">
                    <input type="checkbox" className="mr-1" /> 기타
                  </label>
                  <input type="text" className="input-base input-default flex-1 min-w-[150px]" />
                </div>
              </td>
            </tr>

            {/* TOOL */}
            <tr className="form-tr">
              <th className="form-th">TOOL</th>
              <td className="form-td">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {[
                    'Miplatform', 'Xplatform', 'NCRM', 'xFrame', 'Gause',
                    'RD(Report Design)', 'OZ Report', 'Crystal Report',
                  ].map(tool => (
                    <label key={tool} className="whitespace-nowrap">
                      <input type="checkbox" className="mr-1" /> {tool}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-x-2 mt-1">
                  <label className="whitespace-nowrap shrink-0">
                    <input type="checkbox" className="mr-1" /> 기타
                  </label>
                  <input type="text" className="input-base input-default flex-1 min-w-[150px]" />
                </div>
              </td>
            </tr>

            {/* 모바일 */}
            <tr className="form-tr">
              <th className="form-th">모바일</th>
              <td className="form-td">
                <div className="flex items-center gap-x-4">
                  {['Android', 'I/O/S'].map(m => (
                    <label key={m} className="whitespace-nowrap">
                      <input type="checkbox" className="mr-1" /> {m}
                    </label>
                  ))}
                  <label className="whitespace-nowrap shrink-0">
                    <input type="checkbox" className="mr-1" /> 기타
                  </label>
                  <input type="text" className="input-base input-default flex-1 min-w-[150px]" />
                </div>
              </td>
            </tr>

            {/* 기타 */}
            <tr className="form-tr">
              <th className="form-th">기타</th>
              <td className="form-td">
                <input type="text" className="input-base input-default w-full" />
              </td>
            </tr>
          </tbody>
        </table>
                    {/*버튼 SET */}
      <div className="flex gap-2 justify-end">
        <button className="btn-base btn-delete">취소</button>
        <button className="btn-base btn-act">확인</button>
      </div>
      </div>

    </div>
  );
}
