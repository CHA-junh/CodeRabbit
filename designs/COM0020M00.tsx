'use client'

import React from 'react'
import './common.css';

export default function DesignsPage() {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4"
      style={{ backgroundImage: `url('/login_bg.png')` }}
    >
      <div className="w-full max-w-5xl bg-gradient-to-b from-sky-50 to-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* 이미지 영역 */}
        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
          {/* 배경 이미지 */}
          <img
            src="/login_notebook.png"
            alt="Login"
            className="w-full h-full object-cover md:rounded-l-3xl"
          />

          {/* 로고 이미지 (좌측 상단 고정) */}
          <img
            src="/logo.svg"
            alt="Logo"
            className="absolute top-4 left-4 max-w-md h-auto"
          />
        </div>

        {/* 로그인 영역 */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-10">Sign in</h2>

          {/* ID 입력 */}
          <div className="mb-6">
            <label className="block text-gray-800 text-lg font-bold mb-2">ID</label>
            <input
              type="text"
              placeholder="Employee number"
              className="w-full px-6 py-3 rounded-full bg-[#EFEFEF] text-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Password 입력 */}
          <div className="mb-4">
            <label className="block text-gray-800 text-lg font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-6 py-3 rounded-full bg-[#EFEFEF] text-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right mb-6">
            <a href="#" className="text-sm text-gray-500 hover:underline">
              Forget password?
            </a>
          </div>

          {/* Login 버튼 */}
          <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-full text-lg transition duration-200">
            Login
          </button>

          {/* 안내 문구 */}
          <p className="text-sm text-gray-600 mt-6">
            ID는 사원번호이며, 비밀번호는 웹메일 비밀번호입니다.
          </p>
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="absolute bottom-4 text-center w-full text-gray-700 text-sm">
        본 시스템은 부뜰종합전산시스템입니다. 문의사항은 경영지원본부를 이용해 주십시오.
      </div>
    </div>
	)
}
