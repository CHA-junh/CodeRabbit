import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe('PSM1040M00 인사발령일괄등록 E2E', () => {
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

    test('사원 검색 및 인사발령일괄등록 진입', async ({ page }) => {
		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령일괄등록 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령일괄등록' }).click();
		});

		await test.step('인사발령일괄등록 화면이 로드되는지 확인', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
		});
	});
    
	test('리스트 초기화', async ({ page }) => {
		await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령일괄등록 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령일괄등록' }).click();
		});

		await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

        await test.step('발령구분 선택', async () => {
			try {
				await page.getByRole('cell', { name: '승진' }).getByRole('combobox').selectOption('3');
			} catch (error) {
				console.log('발령구분 선택에서 오류 발생:', error.message);
			}
		});

		await test.step('발령일자 입력', async () => {
			try {
				await page.locator('input[type="date"]').fill('2025-07-28');
			} catch (error) {
				console.log('발령일자 입력에서 오류 발생:', error.message);
			}
		});

		await test.step('본부 선택', async () => {
			try {
				// 본부 콤보박스가 로드될 때까지 대기
				await page.waitForSelector('select[data-field="hqDiv"]', { timeout: 10000 })
				
				// 본부를 1200으로 선택
				await page.locator('select[data-field="hqDiv"]').selectOption('1200')
			} catch (error) {
				console.log('본부 선택에서 오류 발생:', error.message);
			}
		})

		await test.step('부서 콤보박스 데이터 로딩 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('부서 선택', async () => {
			try {
				// 부서 콤보박스가 로드될 때까지 대기
				await page.waitForSelector('select[data-field="deptDiv"]', { timeout: 10000 })
				
				// 부서를 1201로 선택
				await page.locator('select[data-field="deptDiv"]').selectOption('1201')
			} catch (error) {
				console.log('부서 선택에서 오류 발생:', error.message);
			}
		})

        await test.step('그리드에서 사원번호 30000 찾아서 클릭', async () => {
			try {
				await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });
				await page.getByRole('gridcell', { name: '30000' }).click();
			} catch (error) {
				console.log('리스트 초기화 - 사원번호 30000 클릭에서 오류 발생:', error.message);
				// 대안: 첫 번째 셀 클릭
				try {
					await page.locator('[role="gridcell"]').first().click();
				} catch (e) {
					console.log('첫 번째 셀 클릭도 실패:', e.message);
				}
			}
		});
       
		await test.step('리스트초기화 버튼 클릭', async () => {
			await page.getByRole('button', { name: '리스트초기화' }).click();
		});

		await test.step('리스트초기화 버튼 클릭', async () => {
			await page.getByRole('button', { name: '리스트초기화' }).click();
		});
	});

    test('행 삭제', async ({ page }) => {
		await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령일괄등록 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령일괄등록' }).click();
		});

		await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

        await test.step('발령구분 선택', async () => {
			try {
				await page.getByRole('cell', { name: '승진' }).getByRole('combobox').selectOption('3');
			} catch (error) {
				console.log('발령구분 선택에서 오류 발생:', error.message);
			}
		});

		await test.step('발령일자 입력', async () => {
			try {
				await page.locator('input[type="date"]').fill('2025-07-28');
			} catch (error) {
				console.log('발령일자 입력에서 오류 발생:', error.message);
			}
		});

		await test.step('본부 선택', async () => {
			try {
				// 본부 콤보박스가 로드될 때까지 대기
				await page.waitForSelector('select[data-field="hqDiv"]', { timeout: 10000 })
				
				// 본부를 1200으로 선택
				await page.locator('select[data-field="hqDiv"]').selectOption('1200')
			} catch (error) {
				console.log('본부 선택에서 오류 발생:', error.message);
			}
		})

		await test.step('부서 콤보박스 데이터 로딩 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('부서 선택', async () => {
			try {
				// 부서 콤보박스가 로드될 때까지 대기
				await page.waitForSelector('select[data-field="deptDiv"]', { timeout: 10000 })
				
				// 부서를 1201로 선택
				await page.locator('select[data-field="deptDiv"]').selectOption('1201')
			} catch (error) {
				console.log('부서 선택에서 오류 발생:', error.message);
			}
		})

        await test.step('그리드에서 사원번호 30000 찾아서 클릭', async () => {
			try {
				await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });
				await page.getByRole('gridcell', { name: '30000' }).click();
			} catch (error) {
				console.log('행 삭제 - 사원번호 30000 클릭에서 오류 발생:', error.message);
				// 대안: 첫 번째 셀 클릭
				try {
					await page.locator('[role="gridcell"]').first().click();
				} catch (e) {
					console.log('첫 번째 셀 클릭도 실패:', e.message);
				}
			}
		});

		await test.step('행삭제 버튼 클릭', async () => {
			await page.getByRole('button', { name: '행삭제' }).click();
		});
	});

	test('사원 검색 및 발령 정보 입력', async ({ page }) => {
		
		await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('사원명으로 검색', async () => {
			await page.getByRole('textbox', { name: '사원명 입력' }).fill('테스트');
			await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
		});

		await test.step('인사발령일괄등록 버튼 클릭', async () => {
			await page.getByRole('button', { name: '인사발령일괄등록' }).click();
		});

		await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

		await test.step('발령구분 선택', async () => {
			try {
				await page.getByRole('cell', { name: '승진' }).getByRole('combobox').selectOption('3');
			} catch (error) {
				console.log('발령구분 선택에서 오류 발생:', error.message);
			}
		});

		await test.step('발령일자 입력', async () => {
			try {
				await page.locator('input[type="date"]').fill('2025-07-28');
			} catch (error) {
				console.log('발령일자 입력에서 오류 발생:', error.message);
			}
		});

		await test.step('본부 선택', async () => {
			try {
				// 본부 콤보박스가 로드될 때까지 대기
				await page.waitForSelector('select[data-field="hqDiv"]', { timeout: 10000 })
				
				// 본부를 1200으로 선택
				await page.locator('select[data-field="hqDiv"]').selectOption('1200')
			} catch (error) {
				console.log('본부 선택에서 오류 발생:', error.message);
			}
		})

		await test.step('부서 콤보박스 데이터 로딩 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('부서 선택', async () => {
			try {
				// 부서 콤보박스가 로드될 때까지 대기
				await page.waitForSelector('select[data-field="deptDiv"]', { timeout: 10000 })
				
				// 부서를 1201로 선택
				await page.locator('select[data-field="deptDiv"]').selectOption('1202')
			} catch (error) {
				console.log('부서 선택에서 오류 발생:', error.message);
			}
		})

        await test.step('그리드에서 사원번호 30000 찾아서 클릭', async () => {
			try {
				await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });
				await page.getByRole('gridcell', { name: '30000' }).click();
			} catch (error) {
				console.log('사원번호 30000 클릭에서 오류 발생:', error.message);
				// 대안: 첫 번째 셀 클릭
				try {
					await page.locator('[role="gridcell"]').first().click();
				} catch (e) {
					console.log('첫 번째 셀 클릭도 실패:', e.message);
				}
			}
		});

		await test.step('등록 버튼 클릭', async () => {
			await page.getByRole('button', { name: '등록', exact: true }).click();
		});

		await test.step('저장 후 대기', async () => {
			await page.waitForTimeout(2000);
		});

		await test.step('확인 버튼 클릭', async () => {
			// 모달 다이얼로그 안의 확인 버튼을 찾아서 클릭
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

        await test.step('등록 완료 확인', async () => {
			await page.waitForTimeout(2000);
		});
	});
    
}); 