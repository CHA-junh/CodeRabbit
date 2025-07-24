/**
 * Jest JSON 결과를 엑셀로 변환하는 통합 스크립트
 *
 * 사용법:
 * 1. 클라이언트만: node scripts/convert-jest-to-excel.js --client
 * 2. 서버만: node scripts/convert-jest-to-excel.js --server
 * 3. 통합: node scripts/convert-jest-to-excel.js --unified
 * 4. 모든 변환: node scripts/convert-jest-to-excel.js --all
 * 5. 기본값(통합): node scripts/convert-jest-to-excel.js
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// 명령행 인수 파싱
const args = process.argv.slice(2);
const mode = args.includes("--client")
	? "client"
	: args.includes("--server")
		? "server"
		: args.includes("--unified")
			? "unified"
			: args.includes("--all")
				? "all"
				: "unified";

// 개발자 매핑 정보 로드
const developerMapping = require("./developer-mapping.json");

console.log(`📊 Jest JSON을 Excel로 변환 중... (모드: ${mode})`);

// 파일 경로 설정
const baseDir = path.join(__dirname, "../test-reports");
const clientJsonPath = path.join(baseDir, "client/jest-report.json");
const serverJsonPath = path.join(baseDir, "server/jest-report.json");
const unifiedJsonPath = path.join(baseDir, "jest-report.json");

// 파일명에서 프로그램 ID 추출
const extractProgramId = (filePath) => {
	const fileName = filePath.replace(/\\/g, "/").split("/").pop();
	let programId = fileName.replace(/\.(test|spec)\.(tsx?|jsx?)$/, "");
	programId = programId.replace(/\.service$/, ""); // 서버 파일용
	return programId;
};

// 모듈명 추출
const getModuleName = (filePath) => {
	const programId = extractProgramId(filePath);
	if (developerMapping.programs[programId]) {
		return developerMapping.programs[programId].module;
	}
	const modulePrefix = programId.substring(0, 3);
	if (developerMapping.modulePrefixes[modulePrefix]) {
		return developerMapping.modulePrefixes[modulePrefix];
	}
	return "기타";
};

// 개발자 매핑
const getDeveloperByPath = (filePath) => {
	const programId = extractProgramId(filePath);
	if (developerMapping.programs[programId]) {
		return developerMapping.programs[programId].developer;
	}
	const modulePrefix = programId.substring(0, 3);
	if (developerMapping.modulePrefixes[modulePrefix]) {
		return `미지정(${developerMapping.modulePrefixes[modulePrefix]})`;
	}
	return "미지정";
};

// 타입 추출 (클라이언트/서버)
const getType = (filePath) => {
	const normalizedPath = filePath.replace(/\\/g, "/");
	if (normalizedPath.includes("/apps/client/")) {
		return "클라이언트";
	} else if (normalizedPath.includes("/apps/server/")) {
		return "서버";
	}
	return "기타";
};

// JSON 파일을 엑셀로 변환하는 함수
const convertJsonToExcel = (jsonFilePath, outputPath, type) => {
	console.log(`[LOG] 변환 시작: ${jsonFilePath} → ${outputPath} (${type})`);
	if (!fs.existsSync(jsonFilePath)) {
		console.error(`[ERROR] JSON 파일이 존재하지 않음: ${jsonFilePath}`);
		return false;
	}

	try {
		console.log(`[LOG] JSON 파일 읽기 시도: ${jsonFilePath}`);
		// JSON 파일 읽기
		const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
		console.log(
			`[LOG] JSON 파싱 완료, testResults length: ${jsonData.testResults.length}`
		);
		console.log(`✅ ${type} JSON 파일 읽기 완료`);

		// 테스트 결과 데이터 추출
		const testResults = [];

		jsonData.testResults.forEach((testSuite) => {
			testSuite.assertionResults.forEach((test) => {
				const filePath = testSuite.name;
				const fileName = path.basename(filePath);

				testResults.push({
					"테스트 파일명": fileName,
					"프로그램 ID": extractProgramId(filePath),
					모듈명: getModuleName(filePath),
					담당자: getDeveloperByPath(filePath),
					타입: getType(filePath),
					테스트명: test.title,
					상태: test.status === "passed" ? "성공" : "실패",
					"실행시간(ms)": test.duration || 0,
					오류메시지: test.failureMessages
						? test.failureMessages.join("; ")
						: "",
					"테스트 경로": test.ancestorTitles.join(" > ") + " > " + test.title,
					"전체 경로": filePath,
				});
			});
		});

		console.log(`📋 총 ${testResults.length}개의 테스트 결과 처리 완료`);

		// 통계 계산
		const totalTests = testResults.length;
		const passedTests = testResults.filter((t) => t.상태 === "성공").length;
		const failedTests = testResults.filter((t) => t.상태 === "실패").length;
		const successRate =
			totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;

		// 모듈별 통계
		const moduleStats = {};
		testResults.forEach((test) => {
			const module = test.모듈명;
			if (!moduleStats[module]) {
				moduleStats[module] = { total: 0, passed: 0, failed: 0 };
			}
			moduleStats[module].total++;
			if (test.상태 === "성공") {
				moduleStats[module].passed++;
			} else {
				moduleStats[module].failed++;
			}
		});

		// 담당자별 통계
		const developerStats = {};
		testResults.forEach((test) => {
			const developer = test.담당자;
			if (!developerStats[developer]) {
				developerStats[developer] = { total: 0, passed: 0, failed: 0 };
			}
			developerStats[developer].total++;
			if (test.상태 === "성공") {
				developerStats[developer].passed++;
			} else {
				developerStats[developer].failed++;
			}
		});

		// 워크북 생성
		const workbook = XLSX.utils.book_new();

		// 테스트 결과 시트
		const testSheet = XLSX.utils.json_to_sheet(testResults);
		XLSX.utils.book_append_sheet(workbook, testSheet, "테스트 결과");

		// 전체 통계 시트
		const summaryData = [
			{ 구분: "전체 테스트 수", 값: totalTests },
			{ 구분: "성공 테스트 수", 값: passedTests },
			{ 구분: "실패 테스트 수", 값: failedTests },
			{ 구분: "성공률 (%)", 값: successRate },
		];
		const summarySheet = XLSX.utils.json_to_sheet(summaryData);
		XLSX.utils.book_append_sheet(workbook, summarySheet, "전체 통계");

		// 모듈별 통계 시트
		const moduleData = Object.entries(moduleStats).map(([module, stats]) => ({
			모듈명: module,
			"전체 테스트 수": stats.total,
			"성공 테스트 수": stats.passed,
			"실패 테스트 수": stats.failed,
			"성공률 (%)":
				stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(2) : 0,
		}));
		const moduleSheet = XLSX.utils.json_to_sheet(moduleData);
		XLSX.utils.book_append_sheet(workbook, moduleSheet, "모듈별 통계");

		// 담당자별 통계 시트
		const developerData = Object.entries(developerStats).map(
			([developer, stats]) => ({
				담당자: developer,
				"전체 테스트 수": stats.total,
				"성공 테스트 수": stats.passed,
				"실패 테스트 수": stats.failed,
				"성공률 (%)":
					stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(2) : 0,
			})
		);
		const developerSheet = XLSX.utils.json_to_sheet(developerData);
		XLSX.utils.book_append_sheet(workbook, developerSheet, "담당자별 통계");

		// 엑셀 파일 저장
		XLSX.writeFile(workbook, outputPath);
		console.log(`[LOG] 엑셀 파일 저장 완료: ${outputPath}`);
		console.log(`✅ ${type} Excel 파일 생성 완료: ${outputPath}`);

		return true;
	} catch (error) {
		console.error(`[ERROR] 변환 중 예외 발생:`, error);
		return false;
	}
};

// 통합 변환 함수 (클라이언트 + 서버)
const convertUnified = () => {
	const clientData = [];
	const serverData = [];

	// 클라이언트 데이터 로드
	if (fs.existsSync(clientJsonPath)) {
		const clientJson = JSON.parse(fs.readFileSync(clientJsonPath, "utf8"));
		clientJson.testResults.forEach((testSuite) => {
			testSuite.assertionResults.forEach((test) => {
				const filePath = testSuite.name;
				const fileName = path.basename(filePath);

				clientData.push({
					"테스트 파일명": fileName,
					"프로그램 ID": extractProgramId(filePath),
					모듈명: getModuleName(filePath),
					담당자: getDeveloperByPath(filePath),
					타입: "클라이언트",
					테스트명: test.title,
					상태: test.status === "passed" ? "성공" : "실패",
					"실행시간(ms)": test.duration || 0,
					오류메시지: test.failureMessages
						? test.failureMessages.join("; ")
						: "",
					"테스트 경로": test.ancestorTitles.join(" > ") + " > " + test.title,
					"전체 경로": filePath,
				});
			});
		});
	}

	// 서버 데이터 로드
	if (fs.existsSync(serverJsonPath)) {
		const serverJson = JSON.parse(fs.readFileSync(serverJsonPath, "utf8"));
		serverJson.testResults.forEach((testSuite) => {
			testSuite.assertionResults.forEach((test) => {
				const filePath = testSuite.name;
				const fileName = path.basename(filePath);

				serverData.push({
					"테스트 파일명": fileName,
					"프로그램 ID": extractProgramId(filePath),
					모듈명: getModuleName(filePath),
					담당자: getDeveloperByPath(filePath),
					타입: "서버",
					테스트명: test.title,
					상태: test.status === "passed" ? "성공" : "실패",
					"실행시간(ms)": test.duration || 0,
					오류메시지: test.failureMessages
						? test.failureMessages.join("; ")
						: "",
					"테스트 경로": test.ancestorTitles.join(" > ") + " > " + test.title,
					"전체 경로": filePath,
				});
			});
		});
	}

	const allData = [...clientData, ...serverData];

	if (allData.length === 0) {
		console.error("❌ 변환할 테스트 데이터가 없습니다.");
		return false;
	}

	// 통계 계산
	const totalTests = allData.length;
	const passedTests = allData.filter((t) => t.상태 === "성공").length;
	const failedTests = allData.filter((t) => t.상태 === "실패").length;
	const successRate =
		totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;

	// 모듈별 통계
	const moduleStats = {};
	allData.forEach((test) => {
		const module = test.모듈명;
		if (!moduleStats[module]) {
			moduleStats[module] = { total: 0, passed: 0, failed: 0 };
		}
		moduleStats[module].total++;
		if (test.상태 === "성공") {
			moduleStats[module].passed++;
		} else {
			moduleStats[module].failed++;
		}
	});

	// 담당자별 통계
	const developerStats = {};
	allData.forEach((test) => {
		const developer = test.담당자;
		if (!developerStats[developer]) {
			developerStats[developer] = { total: 0, passed: 0, failed: 0 };
		}
		developerStats[developer].total++;
		if (test.상태 === "성공") {
			developerStats[developer].passed++;
		} else {
			developerStats[developer].failed++;
		}
	});

	// 워크북 생성
	const workbook = XLSX.utils.book_new();

	// 통합 테스트 결과 시트
	const testSheet = XLSX.utils.json_to_sheet(allData);
	XLSX.utils.book_append_sheet(workbook, testSheet, "통합 테스트 결과");

	// 전체 통계 시트
	const summaryData = [
		{ 구분: "전체 테스트 수", 값: totalTests },
		{ 구분: "성공 테스트 수", 값: passedTests },
		{ 구분: "실패 테스트 수", 값: failedTests },
		{ 구분: "성공률 (%)", 값: successRate },
	];
	const summarySheet = XLSX.utils.json_to_sheet(summaryData);
	XLSX.utils.book_append_sheet(workbook, summarySheet, "전체 통계");

	// 모듈별 통계 시트
	const moduleData = Object.entries(moduleStats).map(([module, stats]) => ({
		모듈명: module,
		"전체 테스트 수": stats.total,
		"성공 테스트 수": stats.passed,
		"실패 테스트 수": stats.failed,
		"성공률 (%)":
			stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(2) : 0,
	}));
	const moduleSheet = XLSX.utils.json_to_sheet(moduleData);
	XLSX.utils.book_append_sheet(workbook, moduleSheet, "모듈별 통계");

	// 담당자별 통계 시트
	const developerData = Object.entries(developerStats).map(
		([developer, stats]) => ({
			담당자: developer,
			"전체 테스트 수": stats.total,
			"성공 테스트 수": stats.passed,
			"실패 테스트 수": stats.failed,
			"성공률 (%)":
				stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(2) : 0,
		})
	);
	const developerSheet = XLSX.utils.json_to_sheet(developerData);
	XLSX.utils.book_append_sheet(workbook, developerSheet, "담당자별 통계");

	// 엑셀 파일 저장
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
	const outputPath = path.join(
		baseDir,
		`unified-test-report-${timestamp}.xlsx`
	);
	XLSX.writeFile(workbook, outputPath);
	console.log(`✅ 통합 Excel 파일 생성 완료: ${outputPath}`);

	return true;
};

// 메인 실행 로직
const main = () => {
	let success = false;

	// 타임스탬프 생성 (YYYY-MM-DD_HH-MM-SS 형식)
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

	console.log(`[LOG] 변환 모드: ${mode}`);
	console.log(`[LOG] clientJsonPath: ${clientJsonPath}`);
	console.log(`[LOG] serverJsonPath: ${serverJsonPath}`);
	console.log(`[LOG] unifiedJsonPath: ${unifiedJsonPath}`);

	switch (mode) {
		case "client":
			success = convertJsonToExcel(
				clientJsonPath,
				path.join(baseDir, `client/client-test-report-${timestamp}.xlsx`),
				"클라이언트"
			);
			break;

		case "server":
			success = convertJsonToExcel(
				serverJsonPath,
				path.join(baseDir, `server/server-test-report-${timestamp}.xlsx`),
				"서버"
			);
			break;

		case "unified":
			success = convertUnified();
			break;

		case "all":
			console.log("🔄 모든 변환을 실행합니다...");
			const clientSuccess = convertJsonToExcel(
				clientJsonPath,
				path.join(baseDir, `client/client-test-report-${timestamp}.xlsx`),
				"클라이언트"
			);
			const serverSuccess = convertJsonToExcel(
				serverJsonPath,
				path.join(baseDir, `server/server-test-report-${timestamp}.xlsx`),
				"서버"
			);
			const unifiedSuccess = convertUnified();
			success = clientSuccess || serverSuccess || unifiedSuccess;
			break;

		default:
			console.error(
				"❌ 잘못된 모드입니다. --client, --server, --unified, --all 중 하나를 선택하세요."
			);
			process.exit(1);
	}

	if (success) {
		console.log("🎉 Excel 변환이 완료되었습니다!");
	} else {
		console.error("❌ Excel 변환에 실패했습니다.");
		process.exit(1);
	}
};

// 스크립트 실행
main();
