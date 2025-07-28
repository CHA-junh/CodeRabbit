/**
 * Playwright JSON 결과를 엑셀로 변환하며, Sheet1(테스트 결과)와 Sheet2(스크린샷 전용)을 생성하는 최신 스크립트
 *
 * Sheet1: 테스트 결과(텍스트, 담당자 등), '스크린샷' 컬럼에는 '스크린샷시트 N행' 참조 표시
 * Sheet2: 각 행에 스크린샷 이미지를 addImage로 삽입, 파일명도 함께 표시
 *
 * STEP_SPLIT_ROW 옵션: false(한 셀에 줄바꿈), true(행 분할)
 */

const STEP_SPLIT_ROW = false; // true: 행 분할, false: 한 셀에 줄바꿈

const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const developerMapping = require("./developer-mapping.json");

const resultDir = path.join(__dirname, "../test-results");
const jsonPath = path.join(resultDir, "results.json");

if (!fs.existsSync(jsonPath)) {
	console.error(
		`[ERROR] Playwright 결과 파일이 존재하지 않습니다: ${jsonPath}`
	);
	process.exit(1);
}

console.log(`📊 Playwright JSON을 Excel(샘플: Sheet1+Sheet2)로 변환 중...`);

function extractProgramId(filePath) {
	const fileName = filePath.replace(/\\/g, "/").split("/").pop();
	return fileName ? fileName.replace(/\.(test|spec)\.(tsx?|jsx?)$/, "") : "";
}

function getProgramName(programId) {
	// 프로그램명은 빈 값으로 표시 (사용자가 직접 입력)
	return "";
}

function getDeveloperByPath(filePath) {
	const programId = extractProgramId(filePath);
	if (developerMapping.programs[programId]) {
		return developerMapping.programs[programId].developer;
	}
	const modulePrefix = programId.substring(0, 3);
	if (developerMapping.modulePrefixes[modulePrefix]) {
		return `미지정(${developerMapping.modulePrefixes[modulePrefix]})`;
	}
	return "미지정";
}

// 테스트 파일에서 test.step() 정보를 추출하는 함수
function extractTestSteps(filePath) {
	try {
		// 상대 경로를 절대 경로로 변환
		let fullPath;
		if (filePath.startsWith("tests/")) {
			// 이미 tests/로 시작하는 경우
			fullPath = path.join(__dirname, "..", filePath);
		} else {
			// 파일명만 있는 경우 tests/e2e/ 디렉토리에서 찾기
			fullPath = path.join(__dirname, "..", "tests", "e2e", filePath);
		}

		console.log(`파일 경로 확인: ${filePath} -> ${fullPath}`);

		if (!fs.existsSync(fullPath)) {
			console.log(`파일이 존재하지 않음: ${fullPath}`);
			return ["(파일 없음)"];
		}

		const content = fs.readFileSync(fullPath, "utf8");
		const steps = [];

		// test.step() 패턴 찾기
		const stepPattern = /await\s+test\.step\s*\(\s*["']([^"']+)["']/g;
		let match;

		while ((match = stepPattern.exec(content)) !== null) {
			let stepTitle = match[1];

			// 스텝 제목을 "~ 확인한다" 형태로 변환
			if (!stepTitle.includes("확인한다") && !stepTitle.includes("한다")) {
				// 특정 패턴에 따라 변환
				if (stepTitle.includes("클릭")) {
					stepTitle = stepTitle.replace("클릭", "클릭한다");
				} else if (stepTitle.includes("입력")) {
					stepTitle = stepTitle.replace("입력", "입력한다");
				} else if (stepTitle.includes("선택")) {
					stepTitle = stepTitle.replace("선택", "선택한다");
				} else if (stepTitle.includes("검색")) {
					stepTitle = stepTitle.replace("검색", "검색한다");
				} else if (stepTitle.includes("저장")) {
					stepTitle = stepTitle.replace("저장", "저장한다");
				} else if (stepTitle.includes("대기")) {
					stepTitle = stepTitle.replace("대기", "대기한다");
				} else if (stepTitle.includes("렌더링")) {
					stepTitle = stepTitle.replace("렌더링", "렌더링한다");
				} else if (stepTitle.includes("노출")) {
					stepTitle = stepTitle.replace("노출", "노출한다");
				} else if (stepTitle.includes("제거")) {
					stepTitle = stepTitle.replace("제거", "제거한다");
				} else if (stepTitle.includes("생성")) {
					stepTitle = stepTitle.replace("생성", "생성한다");
				} else if (stepTitle.includes("복사")) {
					stepTitle = stepTitle.replace("복사", "복사한다");
				} else if (stepTitle.includes("초기화")) {
					stepTitle = stepTitle.replace("초기화", "초기화한다");
				} else if (stepTitle.includes("부여")) {
					stepTitle = stepTitle.replace("부여", "부여한다");
				} else if (stepTitle.includes("누른다")) {
					// 이미 "~한다" 형태인 경우 그대로 유지
				} else {
					// 기본적으로 "~한다" 추가
					stepTitle = stepTitle + "한다";
				}
			}

			steps.push(stepTitle);
		}

		// test.step()이 없으면 test() 함수 내부의 주요 액션들을 찾기
		if (steps.length === 0) {
			// 주요 액션 패턴들
			const actionPatterns = [
				/await\s+page\.getByRole\s*\(\s*["']button["']\s*,\s*{\s*name:\s*["']([^"']+)["']/g,
				/await\s+page\.locator\s*\(\s*["']([^"']+)["']/g,
				/await\s+page\.getByText\s*\(\s*["']([^"']+)["']/g,
				/await\s+expect\s*\(([^)]+)\)\.toBeVisible/g,
			];

			for (const pattern of actionPatterns) {
				while ((match = pattern.exec(content)) !== null) {
					let action = match[1].replace(/["']/g, "").trim();

					// 액션을 "~한다" 형태로 변환
					if (action && !steps.includes(action)) {
						if (!action.includes("한다")) {
							action = action + "한다";
						}
						steps.push(action);
					}
				}
			}
		}

		console.log(`추출된 스텝 수: ${steps.length}`);
		return steps.length > 0 ? steps : ["(스텝 없음)"];
	} catch (error) {
		console.error(`테스트 스텝 추출 실패 (${filePath}):`, error.message);
		return ["(스텝 추출 실패)"];
	}
}

function getAllScreenshots(limit = 100) {
	if (!fs.existsSync(resultDir)) return [];
	const screenshots = [];
	const dirs = fs.readdirSync(resultDir);
	for (const dir of dirs) {
		const fullDir = path.join(resultDir, dir);
		if (fs.statSync(fullDir).isDirectory()) {
			const files = fs.readdirSync(fullDir);
			files
				.filter((f) => f.endsWith(".png"))
				.forEach((f) => {
					if (screenshots.length < limit)
						screenshots.push(path.join(fullDir, f));
				});
		}
	}
	return screenshots;
}

function getBrowser(result, test, spec, suite) {
	return (
		result.projectName ||
		test.projectName ||
		spec.projectName ||
		suite.projectName ||
		""
	);
}

function collectSpecs(suite, rows) {
	if (suite.specs && suite.specs.length > 0) {
		suite.specs.forEach((spec) => {
			spec.tests.forEach((test) => {
				test.results.forEach((result) => {
					const isFail = result.status !== "passed";
					const browser = getBrowser(result, test, spec, suite);
					const developer = getDeveloperByPath(spec.file);

					// 프로그램ID와 프로그램명 추출
					const programId = extractProgramId(spec.file);
					const programName = getProgramName(programId);

					// 테스트 파일에서 스텝 정보 추출
					const stepTitles = extractTestSteps(spec.file);

					if (STEP_SPLIT_ROW) {
						stepTitles.forEach((stepTitle, idx) => {
							rows.push({
								programId: programId,
								programName: programName,
								file: spec.file,
								scenario: spec.title,
								step: stepTitle,
								browser,
								status: result.status,
								duration: `${(result.duration / 1000).toFixed(1)}s`,
								error: isFail && result.error ? result.error.message : "",
								developer,
							});
						});
					} else {
						rows.push({
							programId: programId,
							programName: programName,
							file: spec.file,
							scenario: spec.title,
							step: stepTitles.join("\n"),
							browser,
							status: result.status,
							duration: `${(result.duration / 1000).toFixed(1)}s`,
							error: isFail && result.error ? result.error.message : "",
							developer,
						});
					}
				});
			});
		});
	}
	if (suite.suites && suite.suites.length > 0) {
		suite.suites.forEach((childSuite) => collectSpecs(childSuite, rows));
	}
}

(async () => {
	const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
	const rows = [];
	const workbook = new ExcelJS.Workbook();

	// Sheet1: 테스트 결과
	const sheet1 = workbook.addWorksheet("테스트 결과");
	sheet1.columns = [
		{ header: "프로그램ID", key: "programId", width: 15 },
		{ header: "프로그램명", key: "programName", width: 20 },
		{ header: "파일", key: "file", width: 30 },
		{ header: "시나리오", key: "scenario", width: 30 },
		{ header: "테스트 스텝", key: "step", width: 60 },
		{ header: "브라우저", key: "browser", width: 15 },
		{ header: "상태", key: "status", width: 10 },
		{ header: "실행시간", key: "duration", width: 12 },
		{ header: "에러 메시지", key: "error", width: 40 },
		{ header: "스크린샷", key: "screenshot", width: 20 },
		{ header: "개발담당자", key: "developer", width: 15 },
	];

	// Sheet2: 스크린샷 전용
	const sheet2 = workbook.addWorksheet("스크린샷");
	sheet2.columns = [
		{ header: "번호", key: "idx", width: 8 },
		{ header: "파일명", key: "filename", width: 40 },
		{ header: "이미지", key: "img", width: 40 },
	];

	// 테스트 결과 rows 생성
	data.suites.forEach((suite) => collectSpecs(suite, rows));

	// 스크린샷 파일 목록(최대 100개)
	const screenshotList = getAllScreenshots(100);

	// Sheet2: 스크린샷 이미지 삽입
	screenshotList.forEach((screenshotPath, idx) => {
		const row = sheet2.addRow({
			idx: idx + 1,
			filename: path.basename(screenshotPath),
			img: "",
		});
		if (fs.existsSync(screenshotPath)) {
			const imageId = workbook.addImage({
				filename: screenshotPath,
				extension: "png",
			});
			sheet2.addImage(imageId, {
				tl: { col: 2, row: row.number - 1 }, // C열
				ext: { width: 240, height: 180 },
			});
		}
	});

	// Sheet1: 스크린샷 참조
	rows.forEach((row, idx) => {
		row.screenshot = screenshotList[idx] ? `스크린샷시트 ${idx + 1}행` : "";
		sheet1.addRow(row);
	});

	// 타임스탬프
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
	const outputPath = path.join(
		resultDir,
		`playwright-sample-report-with-image-${timestamp}.xlsx`
	);
	await workbook.xlsx.writeFile(outputPath);

	console.log(
		`샘플 엑셀 리포트(테스트 결과+스크린샷)가 생성되었습니다: ${outputPath}`
	);
})();
