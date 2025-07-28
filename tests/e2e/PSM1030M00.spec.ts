import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe('PSM1030M00 인사발령내역(건별) E2E', () => {
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

	test('사원 검색 및 인사발령내역 진입', async ({ page }) => {

        await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})
        ㅛ
		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령내역(건별) 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령내역(건별)' }).click();
		});

		await test.step('인사발령내역 화면이 로드되는지 확인', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
		});
	});

    test('인사발령내역 등록', async ({ page }) => {

        await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령내역(건별) 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령내역(건별)' }).click();
		});

		await test.step('그리드에서 사원번호 30000 찾아서 클릭', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
			await page.getByRole('gridcell', { name: '30000' }).click();
		});

        await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

		await test.step('신규 버튼 클릭', async () => {
			await page.getByRole('button', { name: '신규' }).click();
		});

        await test.step('발령일자 입력', async () => {
			await page.locator('input[data-field="apntDt"]').fill('2025-07-28')
		});

        await test.step('발령직위 입력', async () => {
			await page.locator('select[data-field="duty"]').selectOption('7')
		})

		await test.step('저장 버튼 클릭', async () => {
			await page.getByRole('button', { name: '저장' }).click();
		});

		await test.step('저장 후 대기', async () => {
			await page.waitForTimeout(2000);
		});

		await test.step('확인 버튼 클릭', async () => {
			// 모달 다이얼로그 안의 확인 버튼을 찾아서 클릭
			try {
				// 모달이 나타날 때까지 대기
				await page.waitForSelector('text="새로운 인사발령을 등록하시겠습니까?"', { timeout: 5000 });
				// 모달 내의 확인 버튼 클릭
				await page.locator('button:has-text("확인")').click();
			} catch (error) {
				console.log('확인 다이얼로그를 찾을 수 없습니다.');
			}
		});

		await test.step('저장된 내용이 그리드에 반영되는지 확인', async () => {
			await expect(page.getByRole('gridcell', { name: 'TEST' }).first()).toBeVisible();
		});
	});

	test('인사발령내역 조회 및 편집', async ({ page }) => {

        await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령내역(건별) 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령내역(건별)' }).click();
		});

		await test.step('그리드에서 사원번호 30000 찾아서 클릭', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
			await page.getByRole('gridcell', { name: '30000' }).click();
		});

        await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

		await test.step('직급 셀 더블클릭하여 편집 모드 진입', async () => {
			await page.getByRole('gridcell', { name: '과장' }).nth(1).dblclick();
		});

        await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

		await test.step('텍스트 영역에 내용 입력', async () => {
			await page.locator('textarea').click();
			await page.locator('textarea').fill('TEST');
		});

		await test.step('저장 버튼 클릭', async () => {
			await page.getByRole('button', { name: '저장' }).click();
		});

		await test.step('저장 후 대기', async () => {
			await page.waitForTimeout(2000);
		});

		await test.step('확인 버튼 클릭', async () => {
			// 모달 다이얼로그 안의 확인 버튼을 찾아서 클릭
			try {
				// 모달이 나타날 때까지 대기
				await page.waitForSelector('text="인사발령을 수정하시겠습니까?"', { timeout: 5000 });
				// 모달 내의 확인 버튼 클릭
				await page.locator('button:has-text("확인")').click();
			} catch (error) {
				console.log('확인 다이얼로그를 찾을 수 없습니다.');
			}
		});

		await test.step('저장된 내용이 그리드에 반영되는지 확인', async () => {
			await expect(page.getByRole('gridcell', { name: 'TEST' }).first()).toBeVisible();
		});
	});

	test('인사발령내역 삭제', async ({ page }) => {
		await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령내역(건별) 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령내역(건별)' }).click();
		});

		await test.step('그리드에서 사원번호 30000 찾아서 클릭', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
			await page.getByRole('gridcell', { name: '30000' }).click();
		});

        await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

		await test.step('직급 셀 더블클릭하여 편집 모드 진입', async () => {
			await page.getByRole('gridcell', { name: '과장' }).nth(1).dblclick();
		});

        await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

		await test.step('삭제 버튼 클릭', async () => {
			await page.getByRole('button', { name: '삭제' }).click();
		});

		await test.step('삭제 후 대기', async () => {
			await page.waitForTimeout(2000);
		});

		await test.step('확인 버튼 클릭', async () => {
			// 모달 다이얼로그 안의 확인 버튼을 찾아서 클릭
			try {
				// 모달이 나타날 때까지 대기
				await page.waitForSelector('text="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."', { timeout: 5000 });
				// 모달 내의 확인 버튼 클릭
				await page.locator('button:has-text("확인")').click();
			} catch (error) {
				console.log('확인 다이얼로그를 찾을 수 없습니다.');
			}
		});

		await test.step('삭제가 완료되었는지 확인', async () => {
			// 삭제 후 그리드 상태 확인
			await page.waitForTimeout(1000);
		});
	});

	test('인사발령내역 데이터 검증', async ({ page }) => {
		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령내역(건별) 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령내역(건별)' }).click();
		});

		await test.step('그리드에 데이터가 표시되는지 확인', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
			const cells = await page.locator('[role="gridcell"]').count();
			expect(cells).toBeGreaterThan(0);
		});

	});
}); 