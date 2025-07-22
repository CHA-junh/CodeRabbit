"use client";

import React, { useState, useEffect } from "react";
import DataGrid from "@/components/grid/DataGrid";
import "@/app/common/common.css"; // 공통 CSS 경로로 수정
import {
	TblUserRole,
	TblUserRolePgmGrp,
	TblMenuInf,
	ProgramGroupData,
} from "../../modules/sys/types"; // 타입 import
import {
	fetchUserRoles,
	saveUserRoles,
	fetchProgramGroups,
	fetchAllProgramGroups,
	saveProgramGroups,
	copyUserRole,
	fetchMenus,
} from "../../modules/sys/services"; // 서비스 import
import PgmSearchPopup from "@/app/designs/SYS1010D00"; // 프로그램 찾기 팝업 컴포넌트

// --- 공통코드 정의 ---
const useYnCodes = [
	{ code: "Y", name: "사용" },
	{ code: "N", name: "미사용" },
];

const athrGrdCodes = [
	{ code: "1", name: "1등급" },
	{ code: "2", name: "2등급" },
	{ code: "3", name: "3등급" },
	{ code: "4", name: "4등급" },
	{ code: "5", name: "5등급" },
];

const orgInqRngCodes = [
	{ code: "ALL", name: "전체" },
	{ code: "DEPT", name: "부서" },
	{ code: "TEAM", name: "팀" },
	{ code: "SELF", name: "본인" },
];
// --------------------

// 백엔드에서 camelCase로 변환된 데이터 구조에 맞는 타입 정의
type PgmGrpRow = ProgramGroupData;

export default function RoleManagementPage() {
	const [rowData, setRowData] = useState<TblUserRole[]>([]);
	const [selectedRole, setSelectedRole] = useState<TblUserRole | null>(null);
	const [pgmGrpRowData, setPgmGrpRowData] = useState<PgmGrpRow[]>([]);
	const [isPgmSearchPopupOpen, setIsPgmSearchPopupOpen] = useState(false); // 팝업 상태 추가
	const [menuList, setMenuList] = useState<TblMenuInf[]>([]); // 메뉴 목록 상태 추가

	// 버튼 활성화/비활성화 상태 추가
	const [isNewMode, setIsNewMode] = useState(false); // 신규 모드 상태
	const [isCopyButtonEnabled, setIsCopyButtonEnabled] = useState(false); // 역할복사 버튼 활성화 상태

	// 조회 조건 상태 추가
	const [searchConditions, setSearchConditions] = useState({
		usrRoleId: "",
		useYn: "",
	});

	// 조회 조건 변경 핸들러
	const handleSearchChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setSearchConditions((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	// 엔터키 입력 시 자동조회
	const handleKeyPress = (
		e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		if (e.key === "Enter") {
			loadData();
		}
	};

	// 사용자역할 목록 컬럼 정의 (공통 유틸리티 함수 사용)
	const [colDefs] = useState([
		{ headerName: "사용자역할코드", field: "usrRoleId" },
		{ headerName: "사용자역할명", field: "usrRoleNm" },
		{ headerName: "메뉴", field: "menuNm" },
		{ headerName: "사용여부", field: "useYn" },
		{ headerName: "사용자수", field: "cnt", type: "numericColumn" },
	]);

	// 프로그램 그룹 목록 컬럼 정의 (공통 유틸리티 함수 사용)
	const [pgmGrpColDefs] = useState([
		{
			headerName: " ",
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 50,
			suppressMenu: true,
			sortable: false,
			filter: false,
		},
		{ headerName: "프로그램그룹 코드", field: "pgmGrpId" },
		{ headerName: "프로그램그룹명", field: "pgmGrpNm" },
		{ headerName: "사용여부", field: "pgmGrpUseYn" },
		{ headerName: "사용자수", field: "cnt", type: "numericColumn" },
	]);

	const loadData = async () => {
		try {
			const data = await fetchUserRoles(searchConditions);
			setRowData(data);

			// 기존 시스템과 동일하게 조회 시에도 프로그램 그룹 목록 조회
			try {
				const allPgmGrps = await fetchAllProgramGroups();
				setPgmGrpRowData(allPgmGrps);
			} catch (error) {
				console.error(error);
				setPgmGrpRowData([]);
			}
		} catch (error) {
			console.error(error);
			alert("데이터를 불러오는 중 오류가 발생했습니다.");
		}
	};

	useEffect(() => {
		loadData();
		// 메뉴 목록 조회
		const loadMenus = async () => {
			try {
				const menus = await fetchMenus();
				setMenuList(menus);
			} catch (error) {
				console.error(error);
				alert("메뉴 목록을 불러오는 중 오류가 발생했습니다.");
			}
		};
		loadMenus();
	}, []);

	const handleSave = async () => {
		if (!selectedRole) {
			alert("저장할 역할을 선택해주세요.");
			return;
		}

		// 유효성 검사
		if (!selectedRole.usrRoleNm) {
			alert("사용자역할명을 입력해주세요.");
			return;
		}
		if (!selectedRole.useYn) {
			alert("사용여부를 선택해주세요.");
			return;
		}
		if (!selectedRole.menuId) {
			alert("메뉴를 선택해주세요.");
			return;
		}
		if (!selectedRole.athrGrdCd) {
			alert("등급을 선택해주세요.");
			return;
		}
		if (!selectedRole.orgInqRngCd) {
			alert("조직조회범위를 선택해주세요.");
			return;
		}

		// 저장 확인 메시지
		if (!window.confirm("저장하시겠습니까?")) {
			return;
		}

		// 역할 정보와 프로그램 그룹 정보를 함께 저장
		try {
			// 디버깅: 저장할 데이터 로그 출력
			console.log("=== 저장할 역할 데이터 ===");
			console.log("selectedRole:", selectedRole);
			console.log("usrRoleId:", selectedRole.usrRoleId);
			console.log("usrRoleNm:", selectedRole.usrRoleNm);
			console.log("athrGrdCd:", selectedRole.athrGrdCd);
			console.log("orgInqRngCd:", selectedRole.orgInqRngCd);
			console.log("menuId:", selectedRole.menuId);
			console.log("useYn:", selectedRole.useYn);

			// 1. 역할 상세 정보 저장
			// usrRoleId가 빈 문자열이면 신규 저장, 아니면 수정
			const isNewRole =
				!selectedRole.usrRoleId || selectedRole.usrRoleId.trim() === "";

			console.log("isNewRole:", isNewRole);

			const saveResult = await saveUserRoles({
				createdRows: isNewRole ? [selectedRole] : [],
				updatedRows: isNewRole ? [] : [selectedRole],
				deletedRows: [],
			});

			// 2. 프로그램 그룹 정보 저장
			// TODO: 프로그램 그룹 선택 상태를 관리하여 저장 로직 구현
			/*
			if (pgmGrpGridRef.current?.api) {
				const selectedPgmGrps = pgmGrpGridRef.current.api
					.getSelectedRows()
					.map((row) => ({
						usrRoleId: selectedRole.usrRoleId || "", // 신규 시에는 빈 문자열
						pgmGrpId: row.pgmGrpId,
						useYn: row.useYn || "Y", // 기본값 설정
					}));

				// 신규 저장 시에는 저장 후 반환된 역할 ID를 사용
				const roleIdToUse =
					isNewRole && saveResult.savedRoles.length > 0
						? saveResult.savedRoles[0].usrRoleId
						: selectedRole.usrRoleId;

				// 선택된 프로그램 그룹이 있는 경우에만 저장
				if (selectedPgmGrps.length > 0) {
					await saveProgramGroups(roleIdToUse, selectedPgmGrps);
				}
			}
			*/

			alert("성공적으로 저장되었습니다.");

			// 저장 후 버튼 상태 업데이트
			setIsNewMode(false);
			setIsCopyButtonEnabled(false);

			// 기존 시스템과 동일하게 전체 화면 초기화 (프로그램 그룹 목록도 재조회)
			handleSaveInitialize();
		} catch (error) {
			console.error(error);
			alert((error as Error).message);
		}
	};

	// 전체 화면 초기화 함수 (기존 시스템의 fn_init과 동일)
	const handleInitialize = () => {
		// 좌측 그리드 선택 해제
		if (userRoleGridRef.current?.api) {
			userRoleGridRef.current.api.deselectAll();
		}

		// 우측 영역 완전 초기화
		setSelectedRole(null);
		setPgmGrpRowData([]);

		// 버튼 상태 초기화
		setIsNewMode(false);
		setIsCopyButtonEnabled(false);

		// 데이터 재조회
		loadData();
	};

	// 저장 후 초기화 함수 (기존 시스템의 fn_srch와 동일)
	const handleSaveInitialize = async () => {
		// 우측 영역 완전 초기화
		setSelectedRole(null);

		// 버튼 상태 초기화
		setIsNewMode(false);
		setIsCopyButtonEnabled(false);

		// 기존 시스템과 동일하게 프로그램 그룹 목록도 재조회
		try {
			const allPgmGrps = await fetchAllProgramGroups();
			setPgmGrpRowData(allPgmGrps);
		} catch (error) {
			console.error(error);
			setPgmGrpRowData([]);
		}

		// 데이터 재조회
		loadData();
	};

	const handleNew = async () => {
		// 기존 시스템과 동일하게 신규 버튼 클릭 시 사용여부는 "사용"으로 기본 설정
		const newRole: TblUserRole = {
			usrRoleId: "",
			usrRoleNm: "",
			useYn: "Y", // 기본값을 "사용"으로 설정
			athrGrdCd: "",
			orgInqRngCd: "",
			menuId: "",
			baseOutputScrnPgmIdCtt: "",
		};

		// 모든 프로그램 그룹 목록 조회 (체크박스로 선택 가능한 상태)
		try {
			const allPgmGrps = await fetchAllProgramGroups();
			setPgmGrpRowData(allPgmGrps);
		} catch (error) {
			console.error(error);
			alert("프로그램 그룹 목록을 불러오는 중 오류가 발생했습니다.");
		}

		// 상태를 마지막에 업데이트 (다른 함수 호출 후)
		setSelectedRole(newRole);
		setIsNewMode(true); // 신규 모드로 설정
		setIsCopyButtonEnabled(false); // 신규 모드에서는 역할복사 버튼 비활성화
	};

	// 역할 선택 시 프로그램 그룹 조회
	const onSelectionChanged = async (selectedRows: TblUserRole[]) => {
		if (selectedRows.length > 0) {
			const role = selectedRows[0];

			// 백엔드 키명을 프론트엔드 키명으로 매핑
			const roleWithDefaults = {
				...role,
				// 백엔드: athtGrdCd -> 프론트엔드: athrGrdCd
				athrGrdCd: role.athtGrdCd || role.athrGrdCd || "1",
				// 백엔드: orgInqRangCd -> 프론트엔드: orgInqRngCd
				orgInqRngCd: role.orgInqRangCd || role.orgInqRngCd || "ALL",
				useYn: role.useYn || "Y",
				menuId: role.menuId || "",
				usrRoleNm: role.usrRoleNm || "",
				baseOutputScrnPgmIdCtt: role.baseOutputScrnPgmIdCtt || "",
			};

			console.log("=== 선택된 역할 데이터 ===");
			console.log("원본 데이터:", role);
			console.log("키명 매핑 후:", roleWithDefaults);

			setSelectedRole(roleWithDefaults);
			setIsNewMode(false); // 기존 역할 선택 시 신규 모드 해제
			setIsCopyButtonEnabled(true); // 기존 역할 선택 시 역할복사 버튼 활성화

			try {
				const pgmGrps = await fetchProgramGroups(role.usrRoleId);
				setPgmGrpRowData(pgmGrps); // 변환 없이 그대로 할당
			} catch (error) {
				console.error(error);
				alert("프로그램 그룹을 불러오는 중 오류가 발생했습니다.");
			}
		} else {
			setSelectedRole(null);
			setPgmGrpRowData([]);
			setIsNewMode(false);
			setIsCopyButtonEnabled(false);
		}
	};

	// 상세 폼 입력 변경 핸들러
	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		// selectedRole이 null이면 빈 객체로 초기화 (기본값 설정하지 않음)
		const currentRole = selectedRole || {
			usrRoleId: "",
			menuId: "",
			usrRoleNm: "",
			athrGrdCd: "",
			orgInqRngCd: "",
			baseOutputScrnPgmIdCtt: "",
			useYn: "",
		};

		setSelectedRole({
			...currentRole,
			[e.target.name]: e.target.value,
		});
	};

	// 기본출력화면 필드 초기화 핸들러
	const handleClearBaseOutput = () => {
		if (!selectedRole) return;
		setSelectedRole({
			...selectedRole,
			baseOutputScrnPgmIdCtt: "",
			// baseOutputScrnPgmNmCtt 필드가 있다면 같이 초기화해야 합니다.
			// 현재 타입 정의에 없어 우선 ID 필드만 초기화합니다.
		});
	};

	// 역할 복사 핸들러
	const handleCopyRole = async () => {
		if (!selectedRole) {
			alert("복사할 역할을 선택해주세요.");
			return;
		}
		if (
			window.confirm(`'${selectedRole.usrRoleNm}' 역할을 복사하시겠습니까?`)
		) {
			try {
				await copyUserRole(selectedRole.usrRoleId);
				alert("역할이 복사되었습니다.");
				loadData(); // 목록 새로고침
			} catch (error) {
				console.error(error);
				alert((error as Error).message);
			}
		}
	};

	return (
		<div className='mdi'>
			{/* 🔍 조회 영역 */}
			<div className='search-div mb-4'>
				<table className='search-table w-full'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[130px]'>사용자역할코드명</th>
							<td className='search-td w-[20%]'>
								<input
									type='text'
									name='usrRoleId'
									value={searchConditions.usrRoleId}
									onChange={handleSearchChange}
									onKeyPress={handleKeyPress}
									className='input-base input-default w-full'
									aria-label='사용자역할코드명 입력'
									placeholder='코드 또는 명 입력'
								/>
							</td>
							<th className='search-th w-[100px]'>사용여부</th>
							<td className='search-td w-[10%]'>
								<select
									name='useYn'
									value={searchConditions.useYn}
									onChange={handleSearchChange}
									onKeyPress={handleKeyPress}
									className='combo-base w-full min-w-[80px]'
									aria-label='사용여부 선택'
								>
									<option value=''>전체</option>
									{useYnCodes.map((item) => (
										<option key={item.code} value={item.code}>
											{item.name}
										</option>
									))}
								</select>
							</td>
							<td className='search-td text-right' colSpan={1}>
								<button
									type='button'
									className='btn-base btn-search'
									onClick={loadData}
								>
									조회
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* 📋 좌우 2단 */}
			<div className='flex gap-4 flex-1 overflow-auto'>
				{/* ◀ 좌측 */}
				<div className='w-1/2 flex flex-col'>
					<div className='tit_area mb-2'>
						<h3>사용자역할 목록</h3>
					</div>
					<DataGrid
						rowData={rowData}
						columnDefs={colDefs}
						height='400px'
						enableSelection={true}
						enableAutoSize={true}
						enableSizeToFit={true}
						onRowSelected={onSelectionChanged}
					/>
				</div>

				{/* ▶ 우측 상세 폼 */}
				<div className='w-1/2 flex flex-col'>
					<div className='tit_area mb-2'>
						<h3>사용자역할 정보</h3>
					</div>
					<table className='form-table mb-2'>
						<tbody>
							<tr className='form-tr'>
								<th className='form-th required w-[120px]'>사용자역할명</th>
								<td className='form-td'>
									<input
										type='text'
										name='usrRoleNm'
										value={selectedRole?.usrRoleNm || ""}
										onChange={handleFormChange}
										className='input-base input-default w-full'
										aria-label='상세 사용자역할명'
									/>
								</td>
								<th className='form-th required w-[100px]'>사용여부</th>
								<td className='form-td'>
									<select
										name='useYn'
										value={selectedRole ? selectedRole.useYn : "Y"}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='상세 사용여부'
									>
										{useYnCodes.map((item) => (
											<option key={item.code} value={item.code}>
												{item.name}
											</option>
										))}
									</select>
								</td>
								<th className='form-th w-[80px]'>등급</th>
								<td className='form-td'>
									<select
										name='athrGrdCd'
										value={selectedRole ? selectedRole.athrGrdCd : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='상세 등급'
									>
										<option value=''>선택</option>
										{athrGrdCodes.map((item) => (
											<option key={item.code} value={item.code}>
												{item.name}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th required'>조직조회범위</th>
								<td className='form-td'>
									<select
										name='orgInqRngCd'
										value={selectedRole ? selectedRole.orgInqRngCd : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='상세 조직조회범위'
									>
										<option value=''>선택</option>
										{orgInqRngCodes.map((item) => (
											<option key={item.code} value={item.code}>
												{item.name}
											</option>
										))}
									</select>
								</td>
								<th className='form-th required'>메뉴</th>
								<td className='form-td' colSpan={3}>
									<select
										name='menuId'
										value={selectedRole ? selectedRole.menuId : ""}
										onChange={handleFormChange}
										className='combo-base w-full'
										aria-label='상세 메뉴'
									>
										<option value=''>선택</option>
										{menuList.map((menu) => (
											<option key={menu.menuId} value={menu.menuId}>
												{menu.menuNm}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>기본출력화면</th>
								<td className='form-td' colSpan={4}>
									<input
										type='text'
										name='baseOutputScrnPgmIdCtt'
										value={selectedRole?.baseOutputScrnPgmIdCtt || ""}
										onChange={handleFormChange}
										className='input-base input-default w-full'
										aria-label='상세 기본출력화면'
										readOnly
									/>
								</td>
								<td className='form-td'>
									<div className='flex gap-1'>
										<button
											type='button'
											className='btn-base btn-etc text-xs px-3 py-1'
											onClick={() => setIsPgmSearchPopupOpen(true)}
										>
											+ 추가
										</button>
										<button
											type='button'
											className='text-xl text-gray-400 px-2'
											onClick={handleClearBaseOutput}
										>
											×
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					{/* ➕ 버튼 영역 - 원본에 없으므로 제거 */}
					{/*
					<div className='flex justify-between items-center mb-2 px-1'>
						<div></div>
						<div className='flex gap-1'>
							<button
								type='button'
								className='btn-base btn-etc text-xs px-3 py-1'
							>
								+ 추가
							</button>
							<button
								type='button'
								className='text-xl text-gray-400 px-2'
								onClick={handleDeletePgmGrp}
							>
								×
							</button>
						</div>
					</div>
					*/}

					{/* 프로그램 그룹 목록 */}
					<div className='tit_area mb-2'>
						<h3>사용자역할 프로그램그룹 목록</h3>
					</div>
					<DataGrid
						rowData={pgmGrpRowData}
						columnDefs={pgmGrpColDefs}
						height='300px'
						enableSelection={true}
						enableAutoSize={true}
						enableSizeToFit={true}
						selectionMode='multiple'
					/>
				</div>
			</div>

			{/* ⬇ 하단 버튼 */}
			<div className='flex justify-end gap-2 mt-4'>
				<button
					type='button'
					className='btn-base btn-etc'
					onClick={handleCopyRole}
					disabled={!isCopyButtonEnabled}
				>
					역할복사
				</button>
				<button type='button' className='btn-base btn-etc' onClick={handleNew}>
					신규
				</button>
				<button
					type='button'
					className='btn-base btn-act'
					onClick={handleSave}
					disabled={!isNewMode && !selectedRole}
				>
					저장
				</button>
			</div>

			{/* 프로그램 찾기 팝업 */}
			{isPgmSearchPopupOpen && (
				<div className='popup-overlay'>
					<div className='popup-content w-[800px] bg-white rounded-lg shadow-xl'>
						<PgmSearchPopup />
						<div className='flex justify-end p-4'>
							<button
								type='button'
								className='btn-base btn-cancel'
								onClick={() => setIsPgmSearchPopupOpen(false)}
							>
								닫기
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
