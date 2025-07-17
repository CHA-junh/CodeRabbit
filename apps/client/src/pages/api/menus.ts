import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json([
		{
			title: '업무관리',
			children: [
				{ programId: 'EMP_MGMT', title: '사원관리' },
				{ programId: 'USR_EDIT', title: '개인정보수정' },
			],
		},
		{
			title: '시스템관리',
			children: [{ programId: 'SYS_MGMT', title: '프로그램관리' }],
		},
	])
}
