import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe("PSM1010M00 기본정보등록 E2E", () => {
	test.beforeEach(async ({ page }) => {
		await test.step("로그인 페이지 진입", async () => {
			await page.goto("http://localhost:3000/signin");
		});
		await test.step("ID 입력", async () => {
			await page.getByRole('textbox', { name: 'ID' }).fill('10999');
		});
		await test.step("비밀번호 입력", async () => {
			await page.getByRole('textbox', { name: 'Password' }).fill('bUTTLE1!');
		});
		await test.step("로그인 버튼 클릭", async () => {
			await page.getByRole('button', { name: 'Login' }).click();
		});
		await test.step("로그인 후 페이지 로딩 대기", async () => {
			await page.waitForLoadState("networkidle");
		});
		await test.step("메뉴 오픈 및 기본정보등록(개인별) 진입", async () => {
			await page.getByRole('button', { name: '메뉴 아이콘 메뉴' }).click();
			await page.getByText('인사관리').nth(1).click();
			await page.getByText('기본정보등록(개인별)').click();
		});
		await test.step("기본정보등록 페이지 로드 대기", async () => {
			await page.waitForSelector('[role="button"]', { timeout: 5000 });
		});
	});

	// 공통 조회 함수
	async function searchEmployee(page, { hqDiv = "ALL", deptDiv = "ALL", employeeName = "", includeRetired = false, employeeType = "자사" }) {
		await test.step("본부 선택", async () => {
			await page.locator('td').filter({ hasText: '전체사내공통(25)디지털영업본부(25)SI사업본부(' }).getByRole('combobox').selectOption(hqDiv);
		});
		await test.step("부서 선택", async () => {
			await page.getByRole('cell', { name: 'SI사업본부(25)' }).getByRole('combobox').selectOption(deptDiv);
		});
		if (employeeType === "외주") {
			await test.step("외주 라디오 버튼 선택", async () => {
				await page.locator('span').filter({ hasText: '외주' }).click();
			});
		} else {
			await test.step("자사 라디오 버튼 선택", async () => {
				await page.getByRole('radio', { name: '자사' }).check();
			});
		}
		if (includeRetired) {
			await test.step("퇴사자 포함 체크박스 선택", async () => {
				await page.getByRole('checkbox', { name: '퇴사자 포함' }).check();
			});
		} else {
			await test.step("퇴사자 포함 체크박스 해제", async () => {
				await page.getByRole('checkbox', { name: '퇴사자 포함' }).uncheck();
			});
		}
		if (employeeName) {
			await test.step("사원명 입력", async () => {
				await page.getByRole('textbox', { name: '사원명 입력' }).fill(employeeName);
				await page.getByRole('textbox', { name: '사원명 입력' }).press('Enter');
			});
		}
		await test.step("조회 버튼 클릭", async () => {
			await page.getByRole('button', { name: '조회', exact: true }).click();
		});
		await test.step("결과 그리드 로딩 대기", async () => {
			await page.waitForSelector('[role="gridcell"]', { timeout: 5000 });
		});
	}

	test("자사 사원 기본 조회", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "자사",
		});
		await test.step("조회 결과가 표시되는지 확인", async () => {
			// 첫 번째 행의 첫 번째 셀을 확인 (더 구체적인 셀렉터)
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("외주 사원 조회", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "외주",
		});
		await test.step("외주 사원 조회 결과 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("사원명으로 검색", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeName: "테스트",
			employeeType: "자사",
		});
		await test.step("검색 결과가 표시되는지 확인", async () => {
			// "테스트"라는 이름이 포함된 셀을 찾아서 확인
			await expect(page.getByRole('gridcell', { name: '테스트' }).first()).toBeVisible();
		});
	});

	test("퇴사자 포함 조회", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "ALL",
			includeRetired: true,
			employeeType: "자사",
		});
		await test.step("퇴사자 포함 조회 결과 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("퇴사자 제외 조회", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "ALL",
			includeRetired: false,
			employeeType: "자사",
		});
		await test.step("퇴사자 제외 조회 결과 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("투입현황 조회", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "자사",
		});
		await test.step("투입현황조회 버튼 클릭", async () => {
			await page.getByRole('button', { name: '투입현황조회' }).click();
		});
		await test.step("투입현황 조회 결과 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("사원 상세 정보 조회 (직책)", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "자사",
		});
		await test.step("첫 번째 사원의 직책 셀 클릭하여 상세 정보 조회", async () => {
			// 첫 번째 행의 직책 셀을 클릭 (col-id="DUTY")
			await page.locator('[col-id="DUTY"]').first().click();
		});
		await test.step("상세 정보가 표시되는지 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("다른 사원 상세 정보 조회 (직책)", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "자사",
		});
		await test.step("두 번째 사원의 직책 셀 클릭하여 상세 정보 조회", async () => {
			// 두 번째 행의 직책 셀을 클릭
			await page.locator('[col-id="DUTY"]').nth(1).click();
		});
		await test.step("상세 정보가 표시되는지 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("사원 본부 정보 조회", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "자사",
		});
		await test.step("첫 번째 사원의 본부 셀 클릭하여 정보 조회", async () => {
			// 첫 번째 행의 본부 셀을 클릭 (col-id="HQ_DIV")
			await page.locator('[col-id="HQ_DIV"]').first().click();
		});
		await test.step("본부 정보가 표시되는지 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("다른 사원 본부 정보 조회", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "자사",
		});
		await test.step("두 번째 사원의 본부 셀 클릭하여 정보 조회", async () => {
			// 두 번째 행의 본부 셀을 클릭
			await page.locator('[col-id="HQ_DIV"]').nth(1).click();
		});
		await test.step("본부 정보가 표시되는지 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	test("페이지 제목 클릭으로 새로고침", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "자사",
		});
		await test.step("페이지 제목 클릭하여 새로고침", async () => {
			await page.locator('div').filter({ hasText: /^\[PSM0010\]기본정보등록\(개인별\)$/ }).first().click();
		});
		await test.step("조회 버튼 클릭", async () => {
			await page.getByRole('button', { name: '조회', exact: true }).click();
		});
		await test.step("새로고침 후 결과 확인", async () => {
			await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
		});
	});

	// 디버깅용 테스트 (실제 데이터 확인)
	test("그리드 데이터 확인", async ({ page }) => {
		await searchEmployee(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			employeeType: "자사",
		});
		await test.step("그리드의 모든 셀 텍스트 출력", async () => {
			const cells = await page.locator('[role="gridcell"]').allTextContents();
			console.log("그리드 셀 목록:", cells);
		});
	});
}); 