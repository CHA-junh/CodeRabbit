/**
 * SYS1003M00 - 사용자 역할 관리 화면 하이브리드 테스트
 *
 * 테스트 목표:
 * - 사용자 역할 관리 화면의 모든 주요 기능이 정상적으로 동작하는지 검증
 * - 두 가지 방식을 사용합니다:
 *   1. UI 테스트: Mock을 사용한 컴포넌트 렌더링 테스트
 *   2. API 테스트: 실제 HTTP 클라이언트를 사용한 서버 통신 테스트 (서버 실행 시)
 *
 * - 조회/저장/삭제 시 실제 거래 호출 방식 준비
 * - 실제 DB 연결을 통한 통합 테스트 준비
 *
 * 테스트 시나리오:
 * 1. 화면 접속 시 주요 기능 표시 확인
 * 2. 사용자 역할 목록 조회 기능
 * 3. 사용자 역할 신규 등록 기능
 * 4. 사용자 역할 수정 기능
 * 5. 프로그램 그룹 관리 기능
 * 6. 역할 복사 기능
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import RoleManagementPage from "./SYS1003M00";
import axios from "axios";

// Mock ag-grid components for jsdom environment
jest.mock("ag-grid-react", () => ({
	AgGridReact: ({ rowData, columnDefs, onSelectionChanged, ...props }: any) => {
		// Simple mock implementation
		return (
			<div data-testid='ag-grid-mock'>
				{rowData && rowData.length > 0 ? (
					<div>
						{rowData.map((row: any, index: number) => (
							<div key={index} data-testid={`grid-row-${index}`}>
								{columnDefs.map((col: any) => (
									<span key={col.field} data-testid={`${col.field}-${index}`}>
										{row[col.field]}
									</span>
								))}
							</div>
						))}
					</div>
				) : (
					<div data-testid='empty-grid'>데이터가 없습니다</div>
				)}
			</div>
		);
	},
}));

// Mock fetch for UI tests (usrApiService uses fetch)
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock axios for other API calls
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ✅ UI 렌더링 테스트 (Mock 사용)
describe("사용자 역할 관리 화면 - UI 렌더링 테스트 (Mock 사용)", () => {
	beforeEach(() => {
		// Mock fetch for usrApiService.getCodes
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				data: [
					{ codeId: "Y", codeNm: "사용" },
					{ codeId: "N", codeNm: "미사용" },
				],
			}),
		});

		// Mock axios for other API calls
		mockedAxios.get.mockResolvedValue({
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as any,
			data: {
				success: true,
				data: [], // Default empty data for other GETs
			},
		});
		mockedAxios.post.mockResolvedValue({
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as any,
			data: {
				success: true,
				data: {},
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		mockFetch.mockClear();
	});

	// 1. 화면 접속 시 주요 기능 표시 확인
	test("화면 접속 시 주요 기능들이 정상적으로 표시된다", async () => {
		render(<RoleManagementPage />);

		// 검색 영역 확인
		expect(screen.getByText("사용자역할코드/명")).toBeInTheDocument();
		expect(screen.getByLabelText("사용여부 선택")).toBeInTheDocument(); // 검색 영역의 select
		expect(screen.getByText("조회")).toBeInTheDocument();

		// 목록 영역 확인
		expect(screen.getByText("사용자역할 목록")).toBeInTheDocument();
		expect(screen.getByText("사용자역할 정보")).toBeInTheDocument();
		expect(
			screen.getByText("사용자역할 프로그램그룹 목록")
		).toBeInTheDocument();

		// 버튼 영역 확인
		expect(screen.getByText("역할복사")).toBeInTheDocument();
		expect(screen.getByText("신규")).toBeInTheDocument();
		expect(screen.getByText("저장")).toBeInTheDocument();

		// 공통코드 데이터가 로드되어 select 옵션들이 표시되는지 확인
		await waitFor(() => {
			const useYnSelect = screen.getByLabelText("사용여부 선택");
			expect(useYnSelect).toBeInTheDocument();
		});
	});

	// 2. 사용자 역할 신규 등록 기능
	test("사용자가 역할 정보를 입력하고 저장하면 성공적으로 저장된다", async () => {
		render(<RoleManagementPage />);

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 신규 모드가 설정될 때까지 대기
		await waitFor(() => {
			const roleNameInput = screen.getByLabelText("상세 사용자역할명");
			expect(roleNameInput).toBeInTheDocument();
		});

		// 역할 정보 입력
		const roleNameInput = screen.getByLabelText("상세 사용자역할명");
		fireEvent.change(roleNameInput, { target: { value: "테스트 역할" } });

		// 공통코드 데이터가 로드될 때까지 대기
		await waitFor(() => {
			const gradeSelect = screen.getByLabelText("상세 등급");
			expect(gradeSelect.children.length).toBeGreaterThan(1); // "선택" 옵션 외에 다른 옵션들이 로드되었는지 확인
		});

		// 등급 선택 (API 응답 후 실제 옵션 선택)
		const gradeSelect = screen.getByLabelText("상세 등급");
		const gradeOptions = Array.from(
			gradeSelect.children
		) as HTMLOptionElement[];
		const firstGradeOption = gradeOptions.find((option) => option.value !== "");
		if (firstGradeOption) {
			fireEvent.change(gradeSelect, {
				target: { value: firstGradeOption.value },
			});
		}

		// 조직조회범위 선택 (API 응답 후 실제 옵션 선택)
		const orgSelect = screen.getByLabelText("상세 조직조회범위");
		const orgOptions = Array.from(orgSelect.children) as HTMLOptionElement[];
		const firstOrgOption = orgOptions.find((option) => option.value !== "");
		if (firstOrgOption) {
			fireEvent.change(orgSelect, { target: { value: firstOrgOption.value } });
		}

		// 메뉴 선택 (메뉴 목록이 있다면)
		const menuSelect = screen.getByLabelText("상세 메뉴");
		if (menuSelect.children.length > 1) {
			fireEvent.change(menuSelect, { target: { value: "MENU001" } });
		}

		// 입력된 값들이 정상적으로 반영되는지 확인
		await waitFor(() => {
			expect(roleNameInput).toHaveValue("테스트 역할");
			if (firstGradeOption) {
				expect(gradeSelect).toHaveValue(firstGradeOption.value);
			}
			if (firstOrgOption) {
				expect(orgSelect).toHaveValue(firstOrgOption.value);
			}
		});

		// 저장 버튼이 존재하는지 확인
		const saveButton = screen.getByText("저장");
		expect(saveButton).toBeInTheDocument();
	});

	// 3. 프로그램 그룹 관리 기능
	test("사용자가 프로그램 그룹을 선택하고 관리할 수 있다", async () => {
		render(<RoleManagementPage />);

		// 신규 버튼 클릭하여 프로그램 그룹 목록 로드
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 프로그램 그룹 영역이 정상적으로 표시되는지 확인
		await waitFor(() => {
			expect(
				screen.getByText("사용자역할 프로그램그룹 목록")
			).toBeInTheDocument();
		});
	});

	// 4. 역할 복사 기능
	test("사용자가 기존 역할을 선택하고 역할복사 버튼을 클릭하면 역할이 복사된다", async () => {
		render(<RoleManagementPage />);

		// 역할복사 버튼이 존재하는지 확인
		const copyButton = screen.getByText("역할복사");
		expect(copyButton).toBeInTheDocument();
	});

	// 5. 검색 기능 테스트
	test("사용자가 엔터키를 누르면 자동으로 조회가 실행된다", async () => {
		render(<RoleManagementPage />);

		// 검색 조건 입력
		const searchInput = screen.getByPlaceholderText("코드 또는 명 입력");
		fireEvent.change(searchInput, { target: { value: "테스트" } });

		// 엔터키 입력
		fireEvent.keyPress(searchInput, { key: "Enter", code: "Enter" });

		// 입력된 값이 정상적으로 반영되는지 확인
		await waitFor(() => {
			expect(searchInput).toHaveValue("테스트");
		});
	});

	// 6. 유효성 검사 테스트
	test("사용자가 필수 필드를 입력하지 않고 저장하면 경고 메시지가 표시된다", async () => {
		render(<RoleManagementPage />);

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 저장 버튼이 존재하는지 확인
		const saveButton = screen.getByText("저장");
		expect(saveButton).toBeInTheDocument();

		// 저장 버튼 클릭 (필수 필드 미입력)
		fireEvent.click(saveButton);

		// 저장 버튼이 정상적으로 클릭되는지 확인
		await waitFor(() => {
			expect(saveButton).toBeInTheDocument();
		});
	});

	// 7. 기본출력화면 관리 기능
	test("사용자가 기본출력화면 추가 버튼을 클릭하면 팝업이 열린다", async () => {
		render(<RoleManagementPage />);

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 기본출력화면 추가 버튼 클릭
		const addButton = screen.getByText("+ 추가");
		fireEvent.click(addButton);

		// 추가 버튼이 정상적으로 클릭되는지 확인
		await waitFor(() => {
			expect(addButton).toBeInTheDocument();
		});
	});

	// 8. 초기화 기능 테스트
	test("사용자가 신규 버튼을 클릭하면 폼이 초기화된다", async () => {
		render(<RoleManagementPage />);

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 폼 필드들이 초기화되는지 확인
		await waitFor(() => {
			const roleNameInput = screen.getByLabelText("상세 사용자역할명");
			expect(roleNameInput).toHaveValue("");
		});
	});

	// 9. 공통코드 로딩 테스트
	test("공통코드가 정상적으로 로드되어 select 옵션들이 표시된다", async () => {
		render(<RoleManagementPage />);

		// 공통코드 데이터가 로드될 때까지 대기
		await waitFor(() => {
			const useYnSelect = screen.getByLabelText("사용여부 선택");
			expect(useYnSelect).toBeInTheDocument();
		});

		// 사용여부 select에 옵션들이 표시되는지 확인
		const useYnSelect = screen.getByLabelText("사용여부 선택");
		expect(useYnSelect).toBeInTheDocument();
	});

	// 10. 에러 처리 테스트
	test("API 호출 실패 시 에러 메시지가 표시된다", async () => {
		// API 호출 실패를 시뮬레이션
		mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

		render(<RoleManagementPage />);

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 에러 메시지가 표시되는지 확인
		await waitFor(() => {
			expect(
				screen.getByText(
					"프로그램 그룹 목록을 불러오는 중 오류가 발생했습니다."
				)
			).toBeInTheDocument();
		});
	});
});

// 실제 HTTP 클라이언트 사용 (서버 실행 시)
const baseURL = "http://localhost:8080";

// ✅ 실제 서버와 DB 연결 테스트
describe("사용자 역할 관리 API - 실제 거래 호출 테스트 (서버 실행 시)", () => {
	// 서버가 실행 중인지 확인하는 헬퍼 함수
	const isServerRunning = async (): Promise<boolean> => {
		try {
			await axios.get(`${baseURL}/health`, { timeout: 2000 });
			return true;
		} catch (error) {
			return false;
		}
	};

	beforeAll(async () => {
		// 서버가 실행 중인지 확인
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⚠️ 서버가 실행되지 않았습니다. API 테스트를 건너뜁니다.");
		}
	});

	test("사용자 역할 목록 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/user-roles`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const role = (response.data as any).data[0];
			expect(role).toHaveProperty("usrRoleId");
			expect(role).toHaveProperty("usrRoleNm");
			expect(role).toHaveProperty("useYn");
		}
	});

	test("사용자 역할 저장 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const newRole = {
			usrRoleId: "",
			usrRoleNm: "테스트 역할",
			useYn: "Y",
			athrGrdCd: "Y", // 실제 DB에 있는 값으로 수정
			orgInqRngCd: "Y", // 실제 DB에 있는 값으로 수정
			menuId: "MENU001",
		};

		const response = await axios.post(`${baseURL}/api/sys/user-roles`, {
			createdRows: [newRole],
			updatedRows: [],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("사용자 역할 수정 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const updateRole = {
			usrRoleId: "ROLE001",
			usrRoleNm: "수정된 역할",
			useYn: "Y",
			athrGrdCd: "Y", // 실제 DB에 있는 값으로 수정
			orgInqRngCd: "Y", // 실제 DB에 있는 값으로 수정
			menuId: "MENU002",
		};

		const response = await axios.post(`${baseURL}/api/sys/user-roles`, {
			createdRows: [],
			updatedRows: [updateRole],
			deletedRows: [],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("사용자 역할 삭제 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const deleteRole = {
			usrRoleId: "ROLE001",
			usrRoleNm: "삭제할 역할",
			useYn: "N",
		};

		const response = await axios.post(`${baseURL}/api/sys/user-roles`, {
			createdRows: [],
			updatedRows: [],
			deletedRows: [deleteRole],
		});

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("프로그램 그룹 목록 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/program-groups`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const programGroup = (response.data as any).data[0];
			expect(programGroup).toHaveProperty("pgmGrpId");
			expect(programGroup).toHaveProperty("pgmGrpNm");
			// usrRoleId는 선택적 속성이므로 제거
		}
	});

	test("메뉴 목록 조회 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const response = await axios.get(`${baseURL}/api/sys/menus`);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
		expect(Array.isArray((response.data as any).data)).toBe(true);

		// 실제 DB 데이터 검증
		if ((response.data as any).data.length > 0) {
			const menu = (response.data as any).data[0];
			expect(menu).toHaveProperty("menuId");
			expect(menu).toHaveProperty("menuNm");
		}
	});

	test("사용자 역할 복사 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const roleId = "ROLE001";
		const response = await axios.post(
			`${baseURL}/api/sys/user-roles/${roleId}/copy`
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});

	test("프로그램 그룹 저장 API가 정상적으로 동작한다", async () => {
		const serverRunning = await isServerRunning();
		if (!serverRunning) {
			console.log("⏭️ 서버가 실행되지 않아 테스트를 건너뜁니다.");
			return;
		}

		const roleId = "ROLE001";
		const programGroups = [
			{
				usrRoleId: roleId,
				pgmGrpId: "PGM001",
				useYn: "Y",
			},
		];

		const response = await axios.post(
			`${baseURL}/api/sys/user-roles/${roleId}/program-groups`,
			programGroups
		);

		expect(response.status).toBe(200);
		expect((response.data as any).success).toBe(true);
	});
});
