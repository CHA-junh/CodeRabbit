'use client';

import React from 'react';
import './common.css';

export default function PSM1052D00() {
  return (
      <div className="flex justify-between items-center mt-3">
        <p className="text-[13px] text-[#00509A] py-1">
          ※ 입사전 경력 (자사인력) - 입사전 프로젝트 투입 기간을 말함.
          (1)학력기준 : 프로젝트 최초 투입일부터 입사일 전까지의 개월 수
          (2)기술자격기준 : 자격취득일부터 입사일 전까지의 개월 수
          ※ 입사후 경력 (자사인력) - 입사후 재직 간을 말함
          (1)학력기준 : 입사일부터 현재일까지의 개월 수 (재직개월수와 동일)
          (2)기술자격기준 : 자격취득일부터 현재일까지의 개월 수
          ※ 외주인력은 프로젝트 최초 투입일부터 최종 철수일까지 프로필의 경력 개월수를 계산합.
          
          ※ 계산된 경력 개월수와 등급을 사원정보 저장 시 반영을 할려면 [확인] 버튼을 선택하고 미반영시에는 [취소]버튼을 선택함.
        </p>
      </div>
  );
}
