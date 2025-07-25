# BIST_NEW 테스트 가이드

이 문서는 BIST_NEW 프로젝트에서 사용하는 두 가지 테스트 도구인 **Jest**와 **Playwright**의 차이점과 사용 가이드를 설명합니다.

## 📋 목차

1. [테스트 도구 개요](#테스트-도구-개요)
2. [Jest vs Playwright 비교](#jest-vs-playwright-비교)
3. [언제 어떤 도구를 사용할까?](#언제-어떤-도구를-사용할까)
4. [테스트 작성 가이드](#테스트-작성-가이드)
5. [테스트 실행 방법](#테스트-실행-방법)
6. [Playwright 사용 가이드](#playwright-사용-가이드)
7. [모범 사례](#모범-사례)

---

## 🎯 테스트 도구 개요

### Jest (Unit/Integration Testing)

- **목적**: 컴포넌트 단위 테스트, 함수 테스트, API 모킹 테스트
- **환경**: Node.js 환경 (jsdom)
- **실행 속도**: 빠름 (밀리초 단위)
- **범위**: 개별 함수, 컴포넌트, 모듈

### Playwright (E2E Testing)

- **목적**: 실제 브라우저에서의 사용자 시나리오 테스트
- **환경**: 실제 브라우저 (Chrome, Firefox, Safari)
- **실행 속도**: 상대적으로 느림 (초 단위)
- **범위**: 전체 애플리케이션 플로우

---

## 🔄 Jest vs Playwright 비교

| 구분                | Jest                | Playwright             |
| ------------------- | ------------------- | ---------------------- |
| **테스트 유형**     | Unit/Integration    | E2E (End-to-End)       |
| **실행 환경**       | Node.js (jsdom)     | 실제 브라우저          |
| **API 호출**        | Mock 사용           | 실제 API 호출          |
| **데이터베이스**    | Mock 또는 테스트 DB | 실제 DB 또는 테스트 DB |
| **실행 속도**       | 빠름 (ms)           | 느림 (초)              |
| **신뢰성**          | 높음 (격리된 환경)  | 높음 (실제 사용 환경)  |
| **디버깅**          | 콘솔 로그           | 브라우저 개발자 도구   |
| **스크린샷/비디오** | 불가능              | 가능                   |

---

## 🤔 언제 어떤 도구를 사용할까?

### Jest를 사용하는 경우 ✅

- 컴포넌트 렌더링/함수/로직/모듈 단위 테스트
- API 모킹, 빠른 피드백, 단위별 검증

### Playwright를 사용하는 경우 ✅

- 실제 사용자 시나리오(로그인, 저장, 조회 등) 자동화
- 브라우저 호환성, E2E 플로우, UI/UX 검증
- 스크린샷/비디오, 리포트 자동화

---

## 📝 테스트 작성 가이드

### Playwright 기능별 테스트 구조화 예시

```typescript
import { test, expect } from "@playwright/test";

test.describe("USR2010M00 사용자 관리 기능별 테스트", () => {
	test.beforeEach(async ({ page }) => {
		// 로그인 및 메뉴 오픈
		await page.goto("http://localhost:3000/signin");
		await page.getByLabel("ID").fill("10385");
		await page.getByLabel("Password").fill("buttle1!");
		await page.getByRole("button", { name: "Login" }).click();
		await page.getByRole("button", { name: "메뉴 아이콘 메뉴" }).click();
		await page.getByText("시스템관리").click();
		await page.getByText("사용자관리").click();
		await page.getByText("사용자관리").nth(1).click();
	});

	// 공통 조회 함수
	async function searchUser(page, { hqDiv, deptDiv, userName }) {
		await test.step("본부 선택", async () => {
			await page.locator("#hqDiv").selectOption(hqDiv);
		});
		await test.step("부서 선택", async () => {
			await page.locator("#deptDiv").selectOption(deptDiv);
		});
		await test.step("사용자명 입력", async () => {
			await page.locator("#userNm").fill(userName);
		});
		await test.step("조회 버튼 클릭", async () => {
			await page.getByRole("button", { name: "조회" }).click();
		});
		await test.step("결과 그리드에서 사번 확인", async () => {
			await expect(page.getByRole("gridcell", { name: "90358" })).toBeVisible();
		});
	}

	test("사용자 조회", async ({ page }) => {
		await searchUser(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			userName: "권소연",
		});
	});

	test("사용자 정보 저장", async ({ page }) => {
		await searchUser(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			userName: "권소연",
		});
		await test.step("업무권한 콤보박스 선택", async () => {
			await page.locator("#workAuth").selectOption({ index: 1 });
		});
		await test.step('"해제" 라디오 버튼 선택', async () => {
			await page.locator("#workAuthAction_0").check();
		});
		await test.step('"저장" 버튼 클릭', async () => {
			await page.getByRole("button", { name: "저장" }).click();
		});
		await test.step("저장 확인 알림창(확인 버튼) 클릭", async () => {
			await page.getByRole("button", { name: "확인" }).click();
		});
	});

	test("비밀번호 초기화", async ({ page }) => {
		await searchUser(page, {
			hqDiv: "1200",
			deptDiv: "1200",
			userName: "권소연",
		});
		await test.step('"비밀번호 초기화" 버튼 클릭', async () => {
			await page.getByRole("button", { name: "비밀번호 초기화" }).click();
		});
		await test.step("비밀번호 초기화 확인 알림창(확인 버튼) 클릭", async () => {
			await page.getByRole("button", { name: "확인" }).click();
		});
	});
});
```

---

### 실제 화면 구조 기반 Playwright 테스트 예시

> **실제 셀렉터(id/label/role/텍스트)와 화면 플로우에 맞춘 접근성 기반 Playwright 테스트 예시**

**⚠️ 동적 옵션 로딩 주의:**

- 본부/부서 등 select의 옵션이 API 등으로 동적으로 로딩되는 경우, 반드시 selectOption 전에 해당 option이 렌더링될 때까지 waitForSelector로 대기해야 합니다.
- 그렇지 않으면 "did not find some options" 또는 타임아웃 오류가 발생할 수 있습니다.
- **중요:** `<option>` 요소는 select가 드롭다운으로 열리지 않은 상태에서는 항상 `hidden`이므로, `state: 'attached'`를 사용해야 합니다.

```typescript
import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 2560, height: 1440 } });

test.describe("USR2010M00 사용자 관리 E2E", () => {
	test.beforeEach(async ({ page }) => {
		await test.step("로그인 페이지 진입", async () => {
			await page.goto("http://localhost:3000/signin");
		});
		await test.step("ID 입력", async () => {
			await page.getByLabel("ID").fill("10385");
		});
		await test.step("비밀번호 입력", async () => {
			await page.getByLabel("Password").fill("buttle1!");
		});
		await test.step("로그인 버튼 클릭", async () => {
			await page.getByRole("button", { name: "Login" }).click();
		});
		await test.step("메뉴 오픈 및 사용자관리 진입", async () => {
			await page.getByRole("button", { name: "메뉴 아이콘 메뉴" }).click();
			await page.getByText("시스템관리").click();
			await page.getByText("사용자관리").click();
			await page.getByText("사용자관리").nth(1).click();
		});
	});

	test("사용자 조회", async ({ page }) => {
		await test.step("본부 옵션 로딩 대기", async () => {
			await page.waitForSelector('#hqDiv option[value="1200"]', {
				timeout: 5000,
				state: "attached",
			});
		});
		await test.step("본부 선택", async () => {
			await page.locator("#hqDiv").selectOption("1200");
		});
		await test.step("부서 옵션 로딩 대기", async () => {
			await page.waitForSelector('#deptDiv option[value="1200"]', {
				timeout: 5000,
				state: "attached",
			});
		});
		await test.step("부서 선택", async () => {
			await page.locator("#deptDiv").selectOption("1200");
		});
		await test.step("사용자명 입력", async () => {
			await page.locator("#userNm").fill("권소연");
		});
		await test.step("조회 버튼 클릭", async () => {
			await page.getByRole("button", { name: "조회" }).click();
		});
		await test.step("결과 그리드에서 이름 확인", async () => {
			await expect(
				page.getByRole("gridcell", { name: "권소연" })
			).toBeVisible();
		});
	});

	test("사용자 정보 저장", async ({ page }) => {
		await test.step("본부 선택", async () => {
			await page.locator("#hqDiv").selectOption("1200");
		});
		await test.step("부서 선택", async () => {
			await page.locator("#deptDiv").selectOption("1200");
		});
		await test.step("사용자명 입력", async () => {
			await page.locator("#userNm").fill("권소연");
		});
		await test.step("조회 버튼 클릭", async () => {
			await page.getByRole("button", { name: "조회" }).click();
		});
		await test.step("결과 그리드에서 사번 확인", async () => {
			await expect(
				page.getByRole("gridcell", { name: "A250715001" })
			).toBeVisible();
		});
		await test.step("업무권한 콤보박스 선택", async () => {
			await page.locator("#workAuth").selectOption({ index: 1 });
		});
		await test.step('"해제" 라디오 버튼 선택', async () => {
			await page.locator("#workAuthAction_0").check();
		});
		await test.step('"저장" 버튼 클릭', async () => {
			await page.getByRole("button", { name: "저장" }).click();
		});
		await test.step("저장 확인 알림창(확인 버튼) 클릭", async () => {
			await page.getByRole("button", { name: "확인" }).click();
		});
	});

	test("비밀번호 초기화", async ({ page }) => {
		await test.step("본부 선택", async () => {
			await page.locator("#hqDiv").selectOption("1200");
		});
		await test.step("부서 선택", async () => {
			await page.locator("#deptDiv").selectOption("1200");
		});
		await test.step("사용자명 입력", async () => {
			await page.locator("#userNm").fill("권소연");
		});
		await test.step("조회 버튼 클릭", async () => {
			await page.getByRole("button", { name: "조회" }).click();
		});
		await test.step("결과 그리드에서 사번 확인", async () => {
			await expect(
				page.getByRole("gridcell", { name: "A250715001" })
			).toBeVisible();
		});
		await test.step('"비밀번호 초기화" 버튼 클릭', async () => {
			await page.getByRole("button", { name: "비밀번호 초기화" }).click();
		});
		await test.step("비밀번호 초기화 확인 알림창(확인 버튼) 클릭", async () => {
			await page.getByRole("button", { name: "확인" }).click();
		});
	});
});
```

---

### test.step() 활용법

- 각 단계별로 한글 설명을 붙여 코드와 리포트 모두 가독성/추적성 향상
- Playwright 리포트에서 step별로 실제 설명이 그대로 보임

---

## 🚀 Playwright 자동화/엑셀 리포트 팁

- playwright.config.ts에서 reporter, screenshot, video 옵션 설정
- scripts/convert-playwright-to-excel-with-image.js: 결과 json+스크린샷을 엑셀로 변환
- npm run convert:pw:excel: 엑셀 변환만 별도 실행 가능
- STEP_SPLIT_ROW 옵션으로 테스트 스텝 행 분할/한 셀 줄바꿈 선택 가능

---

## 📚 모범 사례/실전 팁

- describe/it/test/beforeEach 구조화, 공통 시나리오 함수화
- test.step() 적극 활용, 한글 설명 중심 단계화
- 테스트 데이터/담당자/모듈명 관리, 리포트 자동화

---

**실제 업무 플로우와 일치하는 Playwright 테스트 구조화, 자동화, 리포트까지 모두 이 가이드대로 작성하면 됩니다!**

### 원인 분석

- `"A250715001"` 사번이 실제로 조회 결과에 존재하지 않거나,
- ag-Grid의 셀 접근 방식이 예상과 다르거나,
- 필터/검색 조건이 맞지 않아 결과가 비어 있거나,
- 혹은 로그인/메뉴 진입 등 앞 단계에서 실패했을 수도 있습니다.

---

## 1. **실제 데이터 확인**

- **"권소연"**이라는 이름, 본부 `"1200"`, 부서 `"1200"` 조건으로 조회 시
  - 실제로 `"A250715001"` 사번이 결과에 존재합니까?
  - 개발자도구에서 그리드 셀을 클릭해보고, 사번이 어떻게 렌더링되는지 확인해 주세요.

---

## 2. **셀렉터/텍스트 확인 방법**

- 크롬 개발자도구에서 해당 셀을 우클릭 → "Copy → Copy selector" 또는 "Copy → Copy accessible name" 해보세요.
- 또는 Playwright Inspector(`npx playwright codegen http://localhost:3000`)로 직접 클릭해보면 실제 동작하는 셀렉터를 알 수 있습니다.

---

## 3. **테스트 코드 점검 포인트**

- `getByRole("gridcell", { name: "A250715001" })`가 실제로 일치하는지 확인
  - ag-Grid는 셀에 `role="gridcell"`이 붙지만, 내부 텍스트가 다를 수 있습니다.
  - 예: 사번 앞뒤에 공백, 다른 텍스트, 혹은 `<span>` 등으로 감싸져 있을 수 있음
- 혹시 사번이 아니라 이름, 혹은 다른 컬럼이 더 확실하다면 그걸로 바꿔도 됩니다.

---

## 4. **실패 원인별 해결법**

### (1) **사번이 실제로 없음**

- 테스트 데이터를 `"A250715001"`이 아니라 실제 조회되는 사번으로 바꿔주세요.

### (2) **셀렉터가 다름**

- 개발자도구/Playwright Inspector로 실제 셀렉터를 확인해서,  
  예를 들어 `page.getByText("A250715001")` 또는 `page.locator('css=...')` 등으로 바꿔주세요.

### (3) **조회 조건이 잘못됨**

- 본부/부서/이름 조건이 실제 데이터와 맞는지 확인하세요.

---

## 5. **임시 디버깅 코드**

실패 원인을 빠르게 파악하려면,  
아래처럼 조회 후 그리드의 모든 셀 텍스트를 출력해보세요.

```typescript
await page.getByRole("button", { name: "조회" }).click();
const cells = await page.locator('[role="gridcell"]').allTextContents();
console.log("그리드 셀 목록:", cells);
```

이렇게 하면 실제 어떤 값이 있는지 알 수 있습니다.

---

## 6. **수정 예시**

예를 들어, 실제로 `"A250715001"` 대신 `"B123456789"`가 있다면 아래처럼 바꿔야 합니다.

```typescript
await expect(page.getByRole("gridcell", { name: "B123456789" })).toBeVisible();
```

또는, 이름 컬럼이 더 확실하다면

```typescript
<code_block_to_apply_changes_from>
```

---

### **정리**

- 실제 조회 결과에 있는 값을 기준으로 테스트 코드를 수정해야 합니다.
- Playwright Inspector나 개발자도구로 실제 셀렉터/텍스트를 확인해 주세요.
- 필요하다면, 그리드의 모든 셀 텍스트를 출력해서 어떤 값이 있는지 먼저 확인하세요.

**실제 조회 결과(사번/이름 등)나 셀렉터 정보를 알려주시면, 바로 맞춤형으로 테스트 코드를 수정해드릴 수 있습니다!**  
확인 후 알려주시면 바로 반영해드리겠습니다.
