/**
 * Playwright JSON 결과를 엑셀로 변환하는 최신 스크립트 (이미지 미포함)
 * - 중첩 suites 재귀 파싱, 테스트 스텝 한 셀에 줄바꿈, 개발담당자 매핑 포함
 */

const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const developerMapping = require("./developer-mapping.json");

const resultDir = path.join(__dirname, "../test-results");
const jsonPath = path.join(resultDir, "results.json");

if (!fs.existsSync(jsonPath)) {
  console.error(`[ERROR] Playwright 결과 파일이 존재하지 않습니다: ${jsonPath}`);
  process.exit(1);
}

console.log(`📊 Playwright JSON을 Excel(이미지 미포함)로 변환 중...`);

function extractProgramId(filePath) {
  const fileName = filePath.replace(/\\/g, "/").split("/").pop();
  return fileName ? fileName.replace(/\.(test|spec)\.(tsx?|jsx?)$/, "") : '';
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
function getBrowser(result, test, spec, suite) {
  return result.projectName || test.projectName || spec.projectName || suite.projectName || '';
}
function collectSpecs(suite, rows) {
  if (suite.specs && suite.specs.length > 0) {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        test.results.forEach(result => {
          const isFail = result.status !== 'passed';
          const browser = getBrowser(result, test, spec, suite);
          const developer = getDeveloperByPath(spec.file);
          let stepTitles = [];
          if (Array.isArray(result.steps) && result.steps.length > 0) {
            stepTitles = result.steps.map(s => s.title);
          } else {
            stepTitles = ['(스텝 없음)'];
          }
          rows.push({
            파일: spec.file,
            시나리오: spec.title,
            테스트스텝: stepTitles.join('\n'),
            브라우저: browser,
            상태: result.status,
            실행시간: `${(result.duration/1000).toFixed(1)}s`,
            에러메시지: isFail && result.error ? result.error.message : '',
            개발담당자: developer,
          });
        });
      });
    });
  }
  if (suite.suites && suite.suites.length > 0) {
    suite.suites.forEach(childSuite => collectSpecs(childSuite, rows));
  }
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const rows = [];
collectSpecs(data.suites[0], rows);

const ws = XLSX.utils.json_to_sheet(rows);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Playwright 상세 리포트');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outputPath = path.join(resultDir, `playwright-detailed-report-${timestamp}.xlsx`);
XLSX.writeFile(wb, outputPath);

console.log(`엑셀 리포트(이미지 미포함)가 생성되었습니다: ${outputPath}`); 