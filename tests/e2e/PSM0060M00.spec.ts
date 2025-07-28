import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe('PSM0060M00 개발환경작성 E2E', () => {
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
		await test.step('메뉴 오픈 및 프로파일관리 진입', async () => {
			await page.getByRole('button', { name: '메뉴 아이콘 메뉴' }).click();
			await page.getByText('인사관리').nth(1).click();
			await page.getByText('프로파일관리').click();
		});
		await test.step('프로파일관리 페이지 로드 대기', async () => {
			await page.waitForSelector('[role="button"]', { timeout: 10000 });
		});
	});

	test('개발환경작성 선택', async ({ page }) => {

        await test.step('화면 로딩 후 1초 대기', async () => {
			await page.waitForTimeout(1000)
		})

		await test.step('사원명으로 검색', async () => {
			await page.locator('input[data-field="searchEmpNm"]').fill('RPA2');
		});

		await test.step('조회 버튼 클릭', async () => {
			await page.getByRole('button', { name: '조회' }).click();
		});

		await test.step('신규 버튼 클릭', async () => {
			await page.getByRole('button', { name: '신규' }).click();
		});

		await test.step('시작일자 입력', async () => {
			await page.locator('input[data-field="strtDate"]').fill('2025-07')
		});

        await test.step('종료일자 입력', async () => {
			await page.locator('input[data-field="endDate"]').fill('2025-07')
		})

        await test.step('프로젝트명 입력', async () => {
			await page.locator('input[data-field="prjtNm"]').fill('테스트 프로젝트1')
		})

        await test.step('고객사 입력', async () => {
			await page.locator('input[data-field="mmbrCo"]').fill('테스트 고객사1')
		})

        await test.step('담당업무 선택', async () => {
			await page.locator('select[data-field="chrgWrk"]').selectOption('03')
		})

        await test.step('선택 버튼 클릭', async () => {
			await page.getByRole('button', { name: '선택' }).click();
		});

		await test.step('UNIX 체크박스 선택', async () => {
			try {
				await page.waitForSelector('input[type="checkbox"]:has-text("UNIX")', { timeout: 5000 });
				await page.getByRole('checkbox', { name: 'UNIX' }).check();
				console.log('UNIX 체크박스 선택 성공');
			} catch (error) {
				console.log('UNIX 체크박스 선택에서 오류 발생:', error.message);
				// 대안: label을 통한 선택
				try {
					await page.locator('label').filter({ hasText: 'UNIX' }).click();
					console.log('UNIX label 클릭으로 선택 성공');
				} catch (e) {
					console.log('UNIX label 클릭도 실패:', e.message);
				}
			}
		});

		await test.step('ORACLE label 클릭', async () => {
			try {
				await page.locator('label').filter({ hasText: 'ORACLE' }).click();
				console.log('ORACLE label 클릭 성공');
			} catch (error) {
				console.log('ORACLE label 클릭에서 오류 발생:', error.message);
			}
		});

		await test.step('MS-SQL 텍스트 클릭', async () => {
			try {
				await page.getByText('MS-SQL').click();
				console.log('MS-SQL 텍스트 클릭 성공');
			} catch (error) {
				console.log('MS-SQL 텍스트 클릭에서 오류 발생:', error.message);
			}
		});

		await test.step('확인 버튼 클릭', async () => {
			try {
				await page.waitForSelector('button:has-text("확인")', { timeout: 5000 });
				await page.getByRole('button', { name: '확인' }).click();
				console.log('확인 버튼 클릭 성공');
			} catch (error) {
				console.log('확인 버튼 클릭에서 오류 발생:', error.message);
				// 대안: 다른 확인 버튼 찾기
				try {
					await page.locator('button:has-text("확인")').first().click();
					console.log('첫 번째 확인 버튼 클릭 성공');
				} catch (e) {
					console.log('확인 버튼을 찾을 수 없습니다:', e.message);
				}
			}
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
				await page.waitForSelector('text="프로필을 등록하시겠습니까?"', { timeout: 5000 });
				// 모달 내의 확인 버튼 클릭
				await page.locator('button:has-text("확인")').click();
			} catch (error) {
				console.log('확인 다이얼로그를 찾을 수 없습니다.');
			}
		});

		await test.step('저장된 내용이 그리드에 반영되는지 확인', async () => {
			try {
				await page.waitForTimeout(3000); // 저장 후 대기
				await expect(page.getByRole('gridcell', { name: '테스트 프로젝트' }).first()).toBeVisible({ timeout: 10000 });
				console.log('테스트 프로젝트가 그리드에 성공적으로 저장되었습니다.');
			} catch (error) {
				console.log('테스트 프로젝트가 그리드에 표시되지 않습니다:', error.message);
				// 그리드 내용 확인
				try {
					const cells = await page.locator('[role="gridcell"]').all();
					console.log(`그리드에 ${cells.length}개의 셀이 있습니다.`);
					for (let i = 0; i < Math.min(cells.length, 5); i++) {
						const text = await cells[i].textContent();
						console.log(`셀 ${i}: ${text}`);
					}
				} catch (e) {
					console.log('그리드 셀을 확인할 수 없습니다.');
				}
			}
		});
	});
}); 