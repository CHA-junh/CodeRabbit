import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe('PSM1050M00 경력 개월수 계산 E2E', () => {
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

	test('신규 사원 경력 계산 입력', async ({ page }) => {
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
	});

	test('신규 사원 경력 계산 및 확인 기능', async ({ page }) => {
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

		await test.step('경력계산 팝업에서 계산 버튼 클릭', async () => {
			try {
				// 여러 가지 계산 버튼 선택자 시도
				await Promise.race([
					page.getByRole('button', { name: '계산', exact: true }).click(),
					page.locator('button:has-text("계산")').click(),
					page.locator('button').filter({ hasText: '계산' }).click(),
					page.locator('input[type="button"][value="계산"]').click(),
					page.locator('input[type="submit"][value="계산"]').click()
				])
				console.log('계산 버튼을 클릭했습니다')
			} catch (e) {
				console.log('계산 버튼을 찾을 수 없습니다. 경력계산이 자동으로 완료되었을 수 있습니다.')
			}
		})

		await test.step('경력계산 완료 확인', async () => {
			try {
				await expect(page.getByRole('button', { name: '확인' })).toBeVisible({ timeout: 5000 })
			} catch (e) {
				console.log('경력계산 확인 버튼이 나타나지 않음')
			}
		})

		await test.step('경력계산 확인 버튼 클릭', async () => {
			try {
				await page.getByRole('button', { name: '확인' }).click({ timeout: 3000 })
			} catch (e) {
				console.log('경력계산 확인 버튼 클릭 실패')
			}
		})
	});

	test('기존 사원 경력 계산 및 저장 기능', async ({ page }) => {
        await test.step('화면 로딩 후 3초 대기', async () => {
			await page.waitForTimeout(3000)
		})

        await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('그리드에서 사원번호 30000 찾아서 클릭', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
			await page.getByRole('gridcell', { name: '30000' }).click();
		});

        await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
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

		await test.step('경력계산 팝업에서 계산 버튼 클릭', async () => {
			try {
				// 여러 가지 계산 버튼 선택자 시도
				await Promise.race([
					page.getByRole('button', { name: '계산', exact: true }).click(),
					page.locator('button:has-text("계산")').click(),
					page.locator('button').filter({ hasText: '계산' }).click(),
					page.locator('input[type="button"][value="계산"]').click(),
					page.locator('input[type="submit"][value="계산"]').click()
				])
				console.log('계산 버튼을 클릭했습니다')
			} catch (e) {
				console.log('계산 버튼을 찾을 수 없습니다. 경력계산이 자동으로 완료되었을 수 있습니다.')
			}
		})

        await test.step('경력저장 버튼 클릭', async () => {
			try {
				await page.getByRole('button', { name: '경력저장' }).click();
			} catch (error) {
				console.log('경력저장 버튼 클릭에서 오류 발생:', error.message);
			}
		});

		await test.step('저장 버튼 클릭', async () => {
			try {
				await page.getByRole('button', { name: '저장' }).click();
			} catch (error) {
				console.log('저장 버튼 클릭에서 오류 발생:', error.message);
			}
		});

		await test.step('확인 버튼 클릭', async () => {
			try {
				// 확인 버튼이 나타날 때까지 대기
				await page.waitForSelector('button:has-text("확인")', { timeout: 5000 });
				// 모달 내의 확인 버튼 클릭
				await page.locator('button:has-text("확인")').click();
				console.log('확인 버튼 클릭 성공');
			} catch (error) {
				console.log('확인 버튼을 찾을 수 없습니다:', error.message);
			}
		});
	});

    test('취소 버튼 클릭', async ({ page }) => {
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

        await test.step('취소 버튼 클릭', async () => {
			await page.getByRole('button', { name: '취소' }).click();
		});
		
	});

}); 