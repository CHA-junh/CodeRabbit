'use client';

import React, { useState } from 'react';
import './common.css';

export default function TestLoginPopup() {
  const [userId, setUserId] = useState('');

  return (
    <div className="popup-wrapper">
      {/* 상단 헤더 */}
      <div className="popup-header">
        <h3 className="popup-title">테스트 로그인 화면</h3>
        <button className="popup-close" type="button">×</button>
      </div>

      {/* 본문 */}
      <div className="popup-body text-left">
        <table className="clear-table w-full mb-4">
          <tbody>
            <tr className="clear-tr">
              <th className="clear-th w-[110px]">테스트 사용자ID</th>
              <td className="clear-td min-w-64">
                <div className="flex items-center gap-2">
                  <input 
                    id="testUserId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="input-base input-default w-[120px] text-center"
                  />
                  <button type="button" className="btn-base btn-act">확인</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 안내 문구 */}
        <div className="px-3">
          <p className="text-sm text-blue-600 leading-relaxed">
            테스트를 위한 화면 입니다.
          </p>
          <p className="text-sm text-blue-600 leading-relaxed">
            테스트 하고자 하는 사용자 ID를 입력하고 확인 버튼을 클릭하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
