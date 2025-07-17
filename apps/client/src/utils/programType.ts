export type ProgramType = 'main' | 'popup' | 'dialog' | 'report' | 'unknown'

export function getProgramType(pgmId?: string | null): ProgramType {
	if (typeof pgmId !== 'string') return 'unknown'
	if (pgmId.endsWith('M00')) return 'main'
	if (pgmId.endsWith('P00')) return 'popup'
	if (pgmId.endsWith('D00')) return 'dialog'
	if (pgmId.endsWith('R00')) return 'report'
	return 'unknown'
}
