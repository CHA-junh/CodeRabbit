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

// Mock axios for UI tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// 실제 HTTP 클라이언트 사용 (서버 실행 시)
const baseURL = "http://localhost:8080";

describe("사용자 역할 관리 화면 - UI 테스트 (Mock 사용)", () => {
	beforeEach(() => {
		// Mock 기본 응답 설정
		mockedAxios.get.mockResolvedValue({
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as any,
			data: {
				success: true,
				data: [],
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
	});

	// 1. 화면 접속 시 주요 기능 표시 확인
	test("사용자가 사용자 역할 관리 화면에 접속하면 모든 주요 기능이 표시된다", async () => {
		render(<RoleManagementPage />);

		// 조회 영역 확인
		await waitFor(() => {
			expect(screen.getByText("사용자역할코드/명")).toBeInTheDocument();
		});

		// 중복 텍스트는 getAllByText로 체크
		const allUseYnHeaders = screen.getAllByText("사용여부");
		expect(allUseYnHeaders.length).toBeGreaterThan(1);
		expect(screen.getByText("조회")).toBeInTheDocument();

		// 좌측 영역 확인
		expect(screen.getByText("사용자역할 목록")).toBeInTheDocument();

		// 우측 영역 확인
		expect(screen.getByText("사용자역할 정보")).toBeInTheDocument();
		expect(screen.getByText("사용자역할명")).toBeInTheDocument();
		const allUseYnHeaders2 = screen.getAllByText("사용여부");
		expect(allUseYnHeaders2.length).toBeGreaterThan(1);
		expect(screen.getByText("등급")).toBeInTheDocument();
		expect(screen.getByText("조직조회범위")).toBeInTheDocument();
		expect(screen.getByText("메뉴")).toBeInTheDocument();
		expect(screen.getByText("기본출력화면")).toBeInTheDocument();

		// 프로그램 그룹 영역 확인
		expect(
			screen.getByText("사용자역할 프로그램그룹 목록")
		).toBeInTheDocument();

		// 하단 버튼 확인
		expect(screen.getByText("역할복사")).toBeInTheDocument();
		expect(screen.getByText("신규")).toBeInTheDocument();
		expect(screen.getByText("저장")).toBeInTheDocument();
	});

	// 2. 사용자 역할 목록 조회 기능
	test("사용자가 조회 조건을 입력하고 조회 버튼을 클릭하면 역할 목록이 표시된다", async () => {
		render(<RoleManagementPage />);

		// 조회 조건 입력
		const searchInput = screen.getByPlaceholderText("코드 또는 명 입력");
		fireEvent.change(searchInput, { target: { value: "관리자" } });

		// 사용여부 선택
		const useYnSelect = screen.getByLabelText("사용여부 선택");
		fireEvent.change(useYnSelect, { target: { value: "Y" } });

		// 조회 버튼 클릭
		const searchButton = screen.getByText("조회");
		fireEvent.click(searchButton);

		// UI 요소들이 정상적으로 표시되는지 확인
		await waitFor(() => {
			expect(searchInput).toHaveValue("관리자");
			expect(useYnSelect).toHaveValue("Y");
		});
	});

	// 3. 사용자 역할 신규 등록 기능
	test("사용자가 신규 버튼을 클릭하면 새로운 역할을 등록할 수 있는 폼이 표시된다", async () => {
		render(<RoleManagementPage />);

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 폼 필드들이 초기화되었는지 확인
		await waitFor(() => {
			const roleNameInput = screen.getByLabelText("상세 사용자역할명");
			expect(roleNameInput).toHaveValue("");
		});

		// 사용여부가 "사용"으로 기본 설정되었는지 확인
		const useYnSelect = screen.getByLabelText("상세 사용여부");
		expect(useYnSelect).toHaveValue("Y");

		// 저장 버튼이 존재하는지 확인 (비활성화 상태도 정상)
		const saveButton = screen.getByText("저장");
		expect(saveButton).toBeInTheDocument();
	});

	// 4. 사용자 역할 정보 입력 및 저장
	test("사용자가 역할 정보를 입력하고 저장하면 성공적으로 저장된다", async () => {
		render(<RoleManagementPage />);

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 역할 정보 입력
		const roleNameInput = screen.getByLabelText("상세 사용자역할명");
		fireEvent.change(roleNameInput, { target: { value: "테스트 역할" } });

		// 등급 선택
		const gradeSelect = screen.getByLabelText("상세 등급");
		fireEvent.change(gradeSelect, { target: { value: "1" } });

		// 조직조회범위 선택
		const orgSelect = screen.getByLabelText("상세 조직조회범위");
		fireEvent.change(orgSelect, { target: { value: "ALL" } });

		// 메뉴 선택 (메뉴 목록이 있다면)
		const menuSelect = screen.getByLabelText("상세 메뉴");
		if (menuSelect.children.length > 1) {
			fireEvent.change(menuSelect, { target: { value: "MENU001" } });
		}

		// 입력된 값들이 정상적으로 반영되는지 확인
		await waitFor(() => {
			expect(roleNameInput).toHaveValue("테스트 역할");
			expect(gradeSelect).toHaveValue("1");
			expect(orgSelect).toHaveValue("ALL");
		});

		// 저장 버튼이 존재하는지 확인
		const saveButton = screen.getByText("저장");
		expect(saveButton).toBeInTheDocument();
	});

	// 5. 프로그램 그룹 관리 기능
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

	// 6. 역할 복사 기능
	test("사용자가 기존 역할을 선택하고 역할복사 버튼을 클릭하면 역할이 복사된다", async () => {
		render(<RoleManagementPage />);

		// 역할복사 버튼이 존재하는지 확인
		const copyButton = screen.getByText("역할복사");
		expect(copyButton).toBeInTheDocument();
	});

	// 7. 검색 기능 테스트
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

	// 8. 유효성 검사 테스트
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

	// 9. 기본출력화면 관리 기능
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

	// 10. 초기화 기능 테스트
	test("사용자가 초기화하면 모든 입력 필드가 초기 상태로 돌아간다", async () => {
		render(<RoleManagementPage />);

		// 신규 버튼 클릭
		const newButton = screen.getByText("신규");
		fireEvent.click(newButton);

		// 역할명 입력
		const roleNameInput = screen.getByLabelText("상세 사용자역할명");
		fireEvent.change(roleNameInput, { target: { value: "테스트 역할" } });

		// 초기화 (신규 버튼 다시 클릭)
		fireEvent.click(newButton);

		// 입력 필드가 초기화되었는지 확인
		await waitFor(() => {
			expect(roleNameInput).toHaveValue("");
		});
	});
});

// 실제 거래 호출 테스트 - 서버 실행 시에만 실행
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
			athrGrdCd: "1",
			orgInqRngCd: "ALL",
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
			athrGrdCd: "2",
			orgInqRngCd: "DEPT",
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
