export type ProgramType = 'main' | 'popup' | 'dialog' | 'report' | 'unknown'

export function getProgramType(
	pgmId?: string | null,
	programList?: any[]
): ProgramType {
	if (typeof pgmId !== 'string') return 'unknown'
	if (programList) {
		const program = programList.find((p) => p.PGM_ID === pgmId)
		if (program && String(program.TGT_MDI_DVCD).toUpperCase() === 'MAIN')
			return 'main'
		// 필요시 popup, dialog, report 등도 program의 다른 필드로 판별 가능
	}
	// fallback: 기존 접미사 판별
	if (pgmId.endsWith('M00')) return 'main'
	if (pgmId.endsWith('P00')) return 'popup'
	if (pgmId.endsWith('D00')) return 'dialog'
	if (pgmId.endsWith('R00')) return 'report'
	return 'unknown'
}
