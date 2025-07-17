export interface ProgramMenuItem {
	programId: string
	title: string
	menuPath?: string
}

export interface MenuGroup {
	title: string
	children: ProgramMenuItem[]
}

export const menuData: MenuGroup[] = [
	{
		title: '업무관리',
		children: [
			{
				programId: 'EMP_MGMT',
				title: '사원관리',
				menuPath: 'mainframe/EMP_MGMT',
			},
			{
				programId: 'USR_EDIT',
				title: '개인정보수정',
				menuPath: 'mainframe/USR_EDIT',
			},
		],
	},
	{
		title: '시스템관리',
		children: [
			{
				programId: 'SYS_MGMT',
				title: '프로그램관리',
				menuPath: 'mainframe/SYS_MGMT',
			},
		],
	},
]
