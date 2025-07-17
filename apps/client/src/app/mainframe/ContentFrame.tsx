'use client'

import React, { useState } from 'react'
import '../designs/common.css'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

interface ContentFrameProps {
	programId: string
	title: string
	menuPath?: string // menuPath를 추가로 받음
}

export default function ContentFrame({
	programId,
	title,
	menuPath,
}: ContentFrameProps) {
	const [DynamicComponent, setDynamicComponent] =
		useState<React.ComponentType<any> | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!menuPath) {
			setError('해당 화면이 존재하지 않습니다.')
			setDynamicComponent(null)
			return
		}
		setDynamicComponent(null)
		setError(null)
		const importPath = menuPath.endsWith('.tsx')
			? menuPath.slice(0, -4)
			: menuPath
		console.log('[ContentFrame] importPath:', importPath)
		import(`src/app/${importPath}`)
			.then((mod) => {
				console.log('[ContentFrame] import 결과:', mod)
				if (!mod || !mod.default) {
					throw new Error('동적 import 성공했으나 default export가 없음')
				}
				setDynamicComponent(() => mod.default)
			})
			.catch((err) => {
				console.error('ContentFrame 동적 import 실패:', importPath, err)
				setError('해당 화면이 존재하지 않습니다.')
				setDynamicComponent(() => () => (
					<div className='error-message-box'>
						<div className='error-message-icon'>⚠️</div>
						해당 화면이 존재하지 않습니다.
						<div className='error-message-desc'>관리자에게 문의하세요.</div>
					</div>
				))
			})
	}, [menuPath])

	if (error) {
		return (
			<div className='error-message-box'>
				<div className='error-message-icon'>⚠️</div>
				{error}
				<div className='error-message-desc'>관리자에게 문의하세요.</div>
			</div>
		)
	}
	if (!DynamicComponent) {
		return (
			<div className='error-message-box'>
				<div className='error-message-icon'>⚠️</div>
				해당 화면이 존재하지 않습니다.
				<div className='error-message-desc'>관리자에게 문의하세요.</div>
			</div>
		)
	}
	return <DynamicComponent title={title} />
}
