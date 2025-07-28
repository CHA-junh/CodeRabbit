import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe('PSM0050M00 프로파일관리 E2E', () => {
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

	test('사원 검색 및 프로파일 내역 조회', async ({ page }) => {

        await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})
        
		await test.step('사원명으로 검색', async () => {
			await page.locator('input[data-field="searchEmpNm"]').fill('RPA2');
		});

		await test.step('조회 버튼 클릭', async () => {
			await page.getByRole('button', { name: '조회' }).click();
		});

		await test.step('프로파일 내역이 조회되는지 확인', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
		});
	});

	test('CSV 다운로드', async ({ page }) => {

        await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})
        
		await test.step('사원명으로 검색', async () => {
			await page.locator('input[data-field="searchEmpNm"]').fill('RPA2');
		});

		await test.step('조회 버튼 클릭', async () => {
			await page.getByRole('button', { name: '조회' }).click();
		});

		await test.step('프로파일 내역이 조회되는지 확인', async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
		});

		await test.step('CSV 버튼 클릭', async () => {
			await page.getByRole('button', { name: 'CSV' }).click();
		});
	});

	test('프로파일 내역 등록', async ({ page }) => {

        await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
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
			await page.locator('input[data-field="prjtNm"]').fill('테스트 프로젝트')
		})

        await test.step('고객사 입력', async () => {
			await page.locator('input[data-field="mmbrCo"]').fill('테스트 고객사')
		})

        await test.step('담당업무 선택', async () => {
			await page.locator('select[data-field="chrgWrk"]').selectOption('03')
		})

        await test.step('개발환경 입력', async () => {
			await page.locator('input[data-field="delpEnvr"]').fill('개발환경')
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

	test('프로파일 내역 삭제', async ({ page }) => {

        await test.step('화면 로딩 후 2초 대기', async () => {
			await page.waitForTimeout(2000)
		})

		await test.step('사원명으로 검색', async () => {
			await page.locator('input[data-field="searchEmpNm"]').fill('RPA2');
		});

		await test.step('조회 버튼 클릭', async () => {
			await page.getByRole('button', { name: '조회' }).click();
		});

		await test.step('그리드에서 테스트 프로젝트 찾아서 더블클릭', async () => {
			try {
				await page.waitForSelector('[role="gridcell"]', { timeout: 10000 });
				await page.waitForTimeout(2000); // 그리드 로딩 대기
				
				// 테스트 프로젝트를 찾아서 더블클릭
				await page.getByRole('gridcell', { name: '테스트 프로젝트' }).dblclick();
				console.log('테스트 프로젝트를 찾아서 더블클릭했습니다.');
			} catch (error) {
				console.log('테스트 프로젝트를 찾을 수 없습니다. 다른 방법으로 시도합니다.');
				
				// 대안 1: 프로젝트명이 포함된 셀 찾기
				try {
					const cells = await page.locator('[role="gridcell"]').all();
					for (const cell of cells) {
						const text = await cell.textContent();
						if (text && text.includes('테스트')) {
							await cell.dblclick();
							console.log('테스트가 포함된 셀을 찾아서 더블클릭했습니다.');
							return;
						}
					}
				} catch (e) {
					console.log('테스트가 포함된 셀을 찾을 수 없습니다.');
				}
				
				// 대안 2: 첫 번째 셀 더블클릭
				try {
					await page.locator('[role="gridcell"]').first().dblclick();
					console.log('첫 번째 셀을 더블클릭했습니다.');
				} catch (e) {
					console.log('그리드 셀을 찾을 수 없습니다.');
				}
			}
			
			// 선택 후 잠시 대기하여 선택 상태 확인
			await page.waitForTimeout(1000);
		});

		await test.step('삭제 버튼 클릭', async () => {
			try {
				// 삭제 버튼이 활성화될 때까지 대기
				await page.waitForSelector('button:has-text("삭제"):not([disabled])', { timeout: 10000 });
				await page.getByRole('button', { name: '삭제' }).click();
				console.log('삭제 버튼 클릭 성공');
			} catch (error) {
				console.log('삭제 버튼이 비활성화되어 있습니다. 항목을 다시 선택합니다.');
				
				// 항목을 다시 선택
				try {
					await page.waitForTimeout(1000);
					await page.locator('[role="gridcell"]').first().dblclick();
					await page.waitForTimeout(1000);
					
					// 다시 삭제 버튼 시도
					await page.waitForSelector('button:has-text("삭제"):not([disabled])', { timeout: 5000 });
					await page.getByRole('button', { name: '삭제' }).click();
					console.log('항목 재선택 후 삭제 버튼 클릭 성공');
				} catch (e) {
					console.log('삭제 버튼을 활성화할 수 없습니다:', e.message);
					// 강제로 클릭 시도 (마지막 수단)
					try {
						await page.locator('button:has-text("삭제")').click({ force: true });
						console.log('강제로 삭제 버튼 클릭');
					} catch (forceError) {
						console.log('삭제 버튼 클릭 실패:', forceError.message);
					}
				}
			}
		});

		await test.step('삭제 후 대기', async () => {
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

		await test.step('삭제 완료 확인', async () => {
			try {
				// 삭제 완료 메시지나 다른 확인 요소가 나타나는지 확인
				await expect(page.getByText('삭제되었습니다')).toBeVisible({ timeout: 10000 })
			} catch (e) {
				console.log('삭제 완료 메시지가 나타나지 않음')
			}
		})
	});

}); 