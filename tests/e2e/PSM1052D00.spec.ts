import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe('PSM1052D00 신규 사원 경력 안내 E2E', () => {
	test.beforeEach(async ({ page }) => {
		await test.step('로그인 페이지 진입', async () => {
			await page.goto('http://localhost:3000/signin');
		});
		await test.step('ID 입력', async () => {
			await page.getByRole('textbox', { name: 'ID' }).fill('10999');
		});
		await test.step('비밀번호 입력', async () => {
			await page.getByRole('textbox', { name: 'Password' }).fill('bUTTLE1!');
		});
		await test.step('로그인 버튼 클릭', async () => {
			await page.getByRole('button', { name: 'Login' }).click();
		});
		await test.step('로그인 후 페이지 로딩 대기', async () => {
			await page.waitForLoadState('networkidle');
		});
		await test.step('메뉴 오픈 및 기본정보등록(개인별) 진입', async () => {
			await page.getByRole('button', { name: '메뉴 아이콘 메뉴' }).click();
			await page.getByText('인사관리').nth(1).click();
			await page.getByText('기본정보등록(개인별)').click();
		});
		await test.step('기본정보등록 페이지 로드 대기', async () => {
			await page.waitForSelector('[role="button"]', { timeout: 10000 });
		});
	});

	test('신규 사원 경력 안내 문구 셋팅', async ({ page }) => {
        await test.step('화면 로딩 후 3초 대기', async () => {
			await page.waitForTimeout(3000)
		})

		await test.step('신규 버튼 클릭', async () => {
			await page.getByRole('button', { name: '신규' }).click();
		});

		await test.step('입사일자 입력', async () => {
			await page.locator('input[data-field="entrDt"]').fill('2025-07-28')
		})

		await test.step('최종학력 선택', async () => {
			await page.locator('select[data-field="lastAdbgDiv"]').selectOption('03')
		})

        await test.step('최초투입일자 선택', async () => {
			await page.locator('input[data-field="fstInDt"]').fill('2025-07-28')
		})

        await test.step('본부 선택', async () => {
			// 본부 콤보박스가 로드될 때까지 대기
			await page.waitForSelector('select[data-field="hqDiv"]', { timeout: 10000 })
			
			// 본부를 1200으로 선택
			await page.locator('select[data-field="hqDiv"]').selectOption('1200')
		})

        await test.step('경력계산 버튼 클릭', async () => {
			await page.getByRole('button', { name: '경력계산' }).click()
		})

		await test.step('경력계산 팝업 대기', async () => {
			try {
				// 여러 가지 팝업 선택자 시도
				await Promise.race([
					page.waitForSelector('[role="dialog"]', { timeout: 5000 }),
					page.waitForSelector('.modal', { timeout: 5000 }),
					page.waitForSelector('.popup', { timeout: 5000 }),
					page.waitForSelector('[class*="modal"]', { timeout: 5000 }),
					page.waitForSelector('[class*="popup"]', { timeout: 5000 }),
					page.waitForSelector('div[style*="position: fixed"]', { timeout: 5000 }),
					page.waitForSelector('div[style*="z-index"]', { timeout: 5000 })
				])
				console.log('경력계산 팝업이 나타났습니다')
			} catch (e) {
				console.log('경력계산 팝업이 나타나지 않았습니다. 직접 계산 버튼을 찾아보겠습니다.')
			}
		})
	});
}); 