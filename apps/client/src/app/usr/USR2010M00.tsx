/**
 * USR2010M00 - 사용자 관리 화면
 *
 * 주요 기능:
 * - 사용자 목록 조회 및 검색 (본부/부서/사용자명 조건)
 * - 사용자 정보 신규 등록 및 수정
 * - 사용자 업무권한 관리 (라디오 버튼으로 권한 부여/해제)
 * - 사용자 역할 할당 (콤보박스)
 * - 승인결재자 검색 및 선택
 * - 비밀번호 초기화
 *
 * API 연동:
 * - GET /api/usr/list - 사용자 목록 조회
 * - GET /api/usr/work-auth/:userId - 사용자 업무권한 조회
 * - POST /api/usr/save - 사용자 정보 저장
 * - POST /api/usr/password-init - 비밀번호 초기화
 * - GET /api/usr/approver-search - 승인결재자 검색
 * - GET /api/usr/roles - 사용자 역할 목록 조회
 * - GET /api/common/search - 공통 코드 조회 (본부, 부서, 권한, 직책 등)
 * - GET /api/common/dept-div-codes - 부서구분코드 조회
 *
 * 상태 관리:
 * - 사용자 목록 및 선택된 사용자
 * - 폼 데이터 (신규/수정용)
 * - 업무권한 목록 및 선택 상태
 * - 콤보박스 데이터 (본부, 부서, 권한, 직책, 역할 등)
 * - 로딩 상태 및 에러 처리
 *
 * 사용자 인터페이스:
 * - 검색 조건 입력 (본부, 부서, 사용자명)
 * - 사용자 목록 테이블 (선택 가능)
 * - 사용자 정보 입력 폼 (신규/수정)
 * - 업무권한 관리 그리드 (라디오 버튼)
 * - 승인결재자 검색 팝업
 * - 저장/초기화/비밀번호 초기화 버튼
 *
 * 연관 화면:
 * - SYS1003M00: 사용자 역할 관리 (역할 정보 연동)
 */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../../contexts/ToastContext";
import { usePopup } from "../../modules/com/hooks/usePopup";
import { usrApiService } from "../../modules/usr/services/usr-api.service";
import {
	UserData,
	WorkAuthData,
	CodeData,
	UserSaveData,
} from "../../modules/usr/services/usr-api.service";
import "../common/common.css";
import COMZ100P00, { EmpSearchModalRef } from "@/app/com/COMZ100P00";
import { useAuth } from "../../modules/auth/hooks/useAuth";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

/**
 * USR2010M00 - 사용자 관리 화면
 *
 * 주요 기능:
 * - 사용자 조회 및 등록/수정
 * - 본부/부서별 사용자 필터링
 * - 사용자 권한 및 직책 관리
 * - 업무별 사용권한 설정
 * - 승인결재자 지정
 * - 비밀번호 초기화
 *
 * 연관 테이블:
 * - 사용자 정보 (사번, 성명, 본부, 부서, 직급, 직책 등)
 * - 사용자 권한 (사용자권한, 사용자역할)
 * - 업무별 사용권한 (사업관리, 프로젝트관리, 업무추진비관리, 인사관리, 시스템관리)
 * - 승인결재자 정보
 *
 * 연관 프로시저:
 * - USR_01_0201_S: 사용자 목록 조회 (본부/부서/사용자명 조건)
 * - USR_01_0202_S: 업무별 사용권한 목록 조회 (사용자ID 기준)
 * - USR_01_0203_T: 사용자 정보 저장 (신규/수정)
 * - USR_01_0104_T: 비밀번호 초기화
 * - COM_03_0101_S: 공통코드 조회 (본부, 부서, 권한, 직책구분, 업무권한 등)
 * - COM_03_0201_S: 부서코드 조회 (본부별 부서 목록)
 */

const initialSearch = { hqDiv: "ALL", deptDiv: "ALL", userNm: "" };

const initialFormData = {
	empNo: "",
	empNm: "",
	authCd: "",
	dutyDivCd: "",
	apvApofId: "",
	apvApofNm: "",
	usrRoleId: "",
};

// API 응답을 CodeData로 매핑
function mapCodeApiToCodeData(apiData: any[]): CodeData[] {
	return apiData.map((item) => ({
		data: item.codeId,
		label: item.codeNm,
	}));
}

const USR2010M00: React.FC = () => {
	const { showToast, showConfirm } = useToast();
	const { user } = useAuth();

	// 검색 조건 상태 관리 (ASIS: txtHqDiv.text, txtDeptDiv.text, txtUserNm.text)
	const [searchParams, setSearchParams] = useState(initialSearch);
	// 선택된 사용자 상태 관리 (ASIS: grdUser.selectedItem)
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	// 편집 중인 사용자 정보 상태 관리 (ASIS: 폼 필드들의 값들)
	const [editedUser, setEditedUser] = useState<Partial<UserSaveData>>({});

	// 업무권한 목록 상태 관리 (ASIS: grdWorkAuth.dataProvider)
	const [workAuthList, setWorkAuthList] = useState<WorkAuthData[]>([]);
	// 업무권한 로딩 상태 관리 (ASIS: showBusyCursor="true")
	const [workAuthLoading, setWorkAuthLoading] = useState(false);
	// 업무권한 에러 상태 관리 (ASIS: Alert.show() 메시지)
	const [workAuthError, setWorkAuthError] = useState<string | null>(null);
	// 선택된 업무권한 코드 상태 관리 (ASIS: cboWorkAuth.selectedItem)
	const [selectedWorkAuthCode, setSelectedWorkAuthCode] = useState<string>("");
	// 업무권한 액션 상태 관리 (ASIS: rdoGrant.selected, rdoRevoke.selected)
	const [workAuthAction, setWorkAuthAction] = useState<"1" | "0">("1");
	// 폼 데이터 상태 관리 (ASIS: 폼 필드들의 초기값)
	const [formData, setFormData] = useState(initialFormData);

	// 승인결재자 후보 목록 상태 관리 (ASIS: COMZ100P00 팝업에서 사용)
	const [potentialApprovers, setPotentialApprovers] = useState<any[]>([]);
	// 팝업 관리 훅 (ASIS: PopUpManager와 동일한 역할)
	const { openPopup } = usePopup();

	// postMessage 이벤트 리스너 추가
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data.type === "EMP_SELECTED") {
				const empData = event.data.data;
				handleApproverSelect(empData);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []); // handleApproverSelect는 useCallback으로 메모이제이션되어 있어서 의존성에서 제거

	const [hqCodeList, setHqCodeList] = useState<CodeData[]>([]);
	const [deptCodeList, setDeptCodeList] = useState<CodeData[]>([]);
	const [authCodeList, setAuthCodeList] = useState<CodeData[]>([]);
	const [dutyDivCodeList, setDutyDivCodeList] = useState<CodeData[]>([]);
	const [workAuthCodeList, setWorkAuthCodeList] = useState<CodeData[]>([]);
	const [userRoleList, setUserRoleList] = useState<
		{ usrRoleId: string; usrRoleNm: string }[]
	>([]);

	const {
		data: userData,
		refetch: refetchUserList,
		isLoading,
		error,
	} = useQuery<UserData[]>({
		queryKey: ["userList", searchParams],
		queryFn: () => usrApiService.getUserList(searchParams),
	});

	const { data: hqData } = useQuery<CodeData[]>({
		queryKey: ["hqCodes"],
		queryFn: () => usrApiService.getHqDivCodes(),
	});
	const { data: deptData } = useQuery<CodeData[]>({
		queryKey: ["deptCodes"],
		queryFn: () => Promise.resolve([{ data: "ALL", label: "전체" }]),
	});
	const { data: authData } = useQuery<CodeData[]>({
		queryKey: ["authCodes"],
		queryFn: () => usrApiService.getAuthCodes(),
	});
	const { data: dutyDivData } = useQuery<CodeData[]>({
		queryKey: ["dutyDivCodes"],
		queryFn: () => usrApiService.getDutyDivCodes(),
	});
	const { data: workAuthData } = useQuery<CodeData[]>({
		queryKey: ["workAuthCodes"],
		queryFn: () => usrApiService.getCodes("991"),
	});
	const { data: rolesData } = useQuery({
		queryKey: ["userRoles"],
		queryFn: () => usrApiService.getUserRoles(),
	});

	useEffect(() => {
		if (hqData) setHqCodeList(mapCodeApiToCodeData(hqData));
		if (deptData) setDeptCodeList(deptData); // 이미 올바른 형태이므로 변환하지 않음
		if (authData) setAuthCodeList(mapCodeApiToCodeData(authData));
		if (dutyDivData) setDutyDivCodeList(mapCodeApiToCodeData(dutyDivData));
		if (workAuthData) setWorkAuthCodeList(mapCodeApiToCodeData(workAuthData));
		if (rolesData) setUserRoleList(rolesData);
	}, [hqData, deptData, authData, dutyDivData, workAuthData, rolesData]);

	useEffect(() => {
		if (userData) {
			// 사용자 조회 결과가 있을 때
			if (userData.length === 0) {
				setSelectedUser(null);
				setFormData(initialFormData);
				setEditedUser({});
			}

			// Flex 소스와 동일하게 사용자 조회 결과와 관계없이 항상 업무권한 조회
			setWorkAuthLoading(true);
			setWorkAuthError(null);

			usrApiService
				.getWorkAuthList("")
				.then((list: WorkAuthData[]) => {
					setWorkAuthList(list);
					setWorkAuthLoading(false);
				})
				.catch((error: any) => {
					console.error("업무권한 목록 조회 실패:", error);
					setWorkAuthError("업무권한 목록을 불러올 수 없습니다.");
					setWorkAuthLoading(false);
				});
		}
	}, [userData]);

	// 업무권한 콤보박스 변경 시 라디오 버튼 상태 동기화
	useEffect(() => {
		if (selectedWorkAuthCode) {
			const selectedAuth = workAuthList.find(
				(auth) => auth.smlCsfCd === selectedWorkAuthCode
			);
			if (selectedAuth) {
				setWorkAuthAction(selectedAuth.wrkUseYn as "1" | "0");
			}
		}
	}, [selectedWorkAuthCode, workAuthList]);

	/**
	 * 검색 조건 변경 핸들러
	 * ASIS: txtHqDiv_change(), txtDeptDiv_change(), txtUserNm_change() 함수와 동일한 역할
	 * 검색 조건 입력 시 상태를 업데이트하고, 본부 변경 시 부서 콤보를 동적으로 업데이트
	 * @param e 입력 이벤트
	 */
	const handleSearchParamChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setSearchParams((prev) => ({ ...prev, [name]: value }));

		// 본부 변경 시 부서 콤보 업데이트 (ASIS: cboHqDiv_change() 함수와 동일)
		if (name === "hqDiv") {
			// 부서를 'ALL'로 초기화 (ASIS: cboDeptDiv.selectedIndex = 0)
			setSearchParams((prev) => ({ ...prev, deptDiv: "ALL" }));

			if (value === "ALL") {
				// 본부가 "전체"일 때는 부서 콤보에 "전체"만 표시
				setDeptCodeList([{ data: "ALL", label: "전체" }]);
			} else {
				// 특정 본부 선택 시 해당 본부의 부서 목록 조회 (ASIS: COM_03_0201_S 프로시저 호출)
				usrApiService
					.getDeptDivCodesByHq(value)
					.then((deptList) => {
						const mappedList = mapCodeApiToCodeData(deptList);
						setDeptCodeList(mappedList);
					})
					.catch((error) => {
						console.error("본부별 부서 조회 실패:", error);
						// 실패 시 "전체"만 표시
						setDeptCodeList([{ data: "ALL", label: "전체" }]);
					});
			}
		}
	};

	/**
	 * 사용자 검색 실행 함수
	 * ASIS: btnSearch_click() 함수와 동일한 역할
	 * 현재 검색 조건으로 사용자 목록을 조회
	 */
	const handleSearch = () => {
		refetchUserList();
	};

	/**
	 * 사용자 선택 처리 함수
	 * ASIS: grdUser_change() 함수와 동일한 역할
	 * 사용자 목록에서 사용자를 선택했을 때 폼에 사용자 정보를 설정하고 업무권한 목록을 조회
	 * @param user 선택된 사용자 정보
	 */
	const handleUserSelect = (user: UserData) => {
		// 선택된 사용자 상태 설정 (ASIS: grdUser.selectedItem = user)
		setSelectedUser(user);

		// 폼 데이터 설정 (ASIS: 폼 필드들에 사용자 정보 설정)
		setFormData({
			empNo: user.empNo,
			empNm: user.empNm,
			authCd: user.authCd,
			dutyDivCd: user.dutyDivCd,
			apvApofId: user.apvApofId,
			apvApofNm: user.apvApofNm,
			usrRoleId: user.usrRoleId,
		});

		// 편집용 사용자 정보 초기화 (ASIS: 편집 모드 진입)
		const initialEditedUser: Partial<UserSaveData> = {
			empNo: user.empNo,
			empNm: user.empNm,
			authCd: user.authCd,
			dutyDivCd: user.dutyDivCd,
			apvApofId: user.apvApofId,
			apvApofNm: user.apvApofNm, // 승인결재자 추가
			emailAddr: user.emailAddr,
			usrRoleId: user.usrRoleId,
		};

		// 사용자별 업무권한 목록 조회 (ASIS: USR_01_0202_S 프로시저 호출)
		usrApiService.getWorkAuthList(user.empNo).then((list) => {
			setWorkAuthList(list);
			setEditedUser({ ...initialEditedUser, workAuthList: list });
			// 업무권한 콤보박스 초기값 설정 (ASIS: cboWorkAuth.selectedIndex = 0)
			if (list.length > 0) {
				setSelectedWorkAuthCode(list[0].smlCsfCd);
			}
		});
	};

	/**
	 * 사용자 정보 입력 변경 핸들러
	 * ASIS: 폼 필드들의 change 이벤트 핸들러와 동일한 역할
	 * 사용자 정보 입력 시 편집 상태를 업데이트
	 * @param e 입력 이벤트
	 */
	const handleUserInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setEditedUser((prev) => ({ ...prev, [name]: value }));
	};

	/**
	 * 업무권한 변경 처리 함수
	 * ASIS: rdoGrant_click(), rdoRevoke_click() 함수와 동일한 역할
	 * 선택된 업무권한에 대해 부여/해제 액션을 적용
	 * @param action 권한 액션 ("1": 부여, "0": 해제)
	 */
	const handleWorkAuthChange = (action: "1" | "0") => {
		// 업무권한이 선택되지 않은 경우 경고 메시지 표시
		if (!selectedWorkAuthCode) {
			showConfirm({
				message: "수정할 업무권한을 선택하세요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		// 업무권한 목록에서 선택된 항목의 권한 상태를 업데이트 (ASIS: grdWorkAuth 데이터 업데이트)
		const updatedList = workAuthList.map((auth) =>
			auth.smlCsfCd === selectedWorkAuthCode
				? { ...auth, wrkUseYn: action }
				: auth
		);

		// 업데이트된 목록으로 상태 갱신
		setWorkAuthList(updatedList);
		setEditedUser((prev) => ({ ...prev, workAuthList: updatedList }));
	};

	// useEffect 제거 - 무한 루프 방지

	/**
	 * 사용자 정보 저장 진행 함수
	 * ASIS: fnUserInfoSave() 함수와 동일한 역할
	 * 승인결재자 정보와 함께 사용자 정보를 저장하고 결과를 처리
	 * @param approver 승인결재자 정보 (id: 승인결재자ID, name: 승인결재자명)
	 */
	const proceedWithSave = useCallback(
		async (approver: { id: string; name: string }) => {
			// 저장 확인 메시지 표시 (ASIS: Alert.show("저장하시겠습니까?"))
			showConfirm({
				message: "저장하시겠습니까?",
				type: "info",
				onConfirm: async () => {
					// 현재 업무권한 목록에서 부여된 권한만 필터링
					const currentWorkAuthList = editedUser.workAuthList || workAuthList;

					// 저장할 데이터 구성 (ASIS: 저장할 객체 구성)
					const saveData: UserSaveData = {
						...selectedUser!,
						...editedUser,
						apvApofId: approver.id, // 승인결재자ID
						apvApofNm: approver.name, // 승인결재자명
						workAuthList: currentWorkAuthList,
						regUserId: user && "empNo" in user ? (user as any).empNo : "",
					};

					try {
						// 사용자 정보 저장 (ASIS: USR_01_0203_T 프로시저 호출)
						await usrApiService.saveUser(saveData);
						showToast("성공적으로 저장되었습니다.", "info");

						// 저장 후 사용자 목록 새로고침 (ASIS: fn_srch() 호출)
						await refetchUserList();

						// 현재 선택된 사용자가 있다면 업데이트된 정보로 다시 설정
						if (selectedUser) {
							const updatedUserList =
								await usrApiService.getUserList(searchParams);
							const updatedUser = updatedUserList.find(
								(u) => u.empNo === selectedUser.empNo
							);
							if (updatedUser) {
								handleUserSelect(updatedUser);
							}
						}
					} catch (error) {
						console.error("Failed to save user:", error);
						showConfirm({
							message: `저장 중 오류가 발생했습니다: ${(error as Error).message}`,
							type: "error",
							onConfirm: () => {},
							confirmOnly: true,
						});
					}
				},
			});
		},
		[
			editedUser,
			workAuthList,
			selectedUser,
			user,
			searchParams,
			showConfirm,
			showToast,
			refetchUserList,
		]
	);

	/**
	 * 사용자 정보 저장 함수
	 * ASIS: btnSave_click() 함수와 동일한 역할
	 * 사용자 정보 유효성 검사 후 승인결재자 검색 및 저장 진행
	 */
	const handleSave = async () => {
		if (!selectedUser || !editedUser.empNo) {
			showConfirm({
				message: "저장할 사용자를 선택해주세요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		if (!editedUser.apvApofNm) {
			showConfirm({
				message: "승인결재자를 입력해 주십시요.",
				type: "warning",
				onConfirm: () => {
					// 승인결재자 입력 필드에 포커스
					const apvApofInput = document.getElementById(
						"apvApofNm"
					) as HTMLInputElement;
					if (apvApofInput) {
						apvApofInput.focus();
					}
				},
				confirmOnly: true,
			});
			return;
		}

		if (!editedUser.authCd) {
			showConfirm({
				message: "사용자권한을 선택해 주십시요.",
				type: "warning",
				onConfirm: () => {
					// 사용자권한 콤보박스에 포커스
					const authSelect = document.getElementById(
						"authCd"
					) as HTMLSelectElement;
					if (authSelect) {
						authSelect.focus();
					}
				},
				confirmOnly: true,
			});
			return;
		}

		if (!editedUser.dutyDivCd) {
			showConfirm({
				message: "직책구분을 선택해 주십시요.",
				type: "warning",
				onConfirm: () => {
					// 직책구분 콤보박스에 포커스
					const dutyDivSelect = document.getElementById(
						"dutyDivCd"
					) as HTMLSelectElement;
					if (dutyDivSelect) {
						dutyDivSelect.focus();
					}
				},
				confirmOnly: true,
			});
			return;
		}

		try {
			const approvers = await usrApiService.getUserList({
				hqDiv: "ALL",
				deptDiv: "ALL",
				userNm: editedUser.apvApofNm,
			});

			if (approvers.length === 0) {
				showConfirm({
					message:
						"사용자 정보에 미등록된 승인결재자 입니다. 승인결재자를 다시 입력해 주십시요.",
					type: "warning",
					onConfirm: () => {
						// 승인결재자 입력 필드에 포커스
						const apvApofInput = document.getElementById(
							"apvApofNm"
						) as HTMLInputElement;
						if (apvApofInput) {
							apvApofInput.focus();
						}
					},
					confirmOnly: true,
				});
				return;
			} else if (approvers.length === 1) {
				const approver = approvers[0];
				if (approver.authCd !== "10" && approver.authCd !== "00") {
					showConfirm({
						message:
							"승인결재자는 부서장 이상이어야 합니다.\n재 입력 해 주십시요.",
						type: "warning",
						onConfirm: () => {
							// 승인결재자 입력 필드에 포커스
							const apvApofInput = document.getElementById(
								"apvApofNm"
							) as HTMLInputElement;
							if (apvApofInput) {
								apvApofInput.focus();
							}
						},
						confirmOnly: true,
					});
					return;
				}
				// 승인자 정보 업데이트 및 저장 진행
				setEditedUser((prev) => ({
					...prev,
					apvApofId: approver.empNo,
					apvApofNm: approver.empNm,
				}));
				proceedWithSave({ id: approver.empNo, name: approver.empNm });
			} else {
				// 여러 명일 경우 팝업 열기 (ASIS: COM_02_0600 팝업과 동일)
				// ASIS: var reg:COM_02_0600 = COM_02_0600(PopUpManager.createPopUp( this, COM_02_0600 , true));
				// ASIS: reg.choiceEmpInit(txtApvNm.text, event.result.result_set.record);

				// 승인결재자 후보 목록을 COMZ100P00 형식으로 변환
				const empList = approvers.map((approver, index) => ({
					LIST_NO: String(index + 1),
					EMP_NO: approver.empNo,
					EMP_NM: approver.empNm,
					HQ_DIV_NM: approver.hqDivNm,
					DEPT_DIV_NM: approver.deptDivNm,
					DUTY_NM: approver.dutyNm,
					AUTH_CD_NM: approver.authCdNm,
					BSN_USE_YN: approver.bsnUseYn,
					WPC_USE_YN: approver.wpcUseYn,
					PSM_USE_YN: approver.psmUseYn,
					RMK: "",
					HQ_DIV_CD: approver.hqDivCd,
					DEPT_DIV_CD: approver.deptDivCd,
					DUTY_CD: approver.dutyCd,
					DUTY_DIV_CD: approver.dutyDivCd,
					AUTH_CD: approver.authCd,
					APV_APOF_ID: approver.apvApofId,
					EMAIL_ADDR: approver.emailAddr,
				}));

				// 팝업 열기 (ASIS: PopUpManager.createPopUp와 동일)
				const popupInstance = openPopup({
					url: "/popup/com/COMZ100P00",
					size: "medium",
					position: "center",
					onOpen: (popup) => {
						// ASIS: reg.choiceEmpInit(txtApvNm.text, event.result.result_set.record);
						// 팝업이 열린 후 postMessage로 choiceEmpInit 데이터 전송
						setTimeout(() => {
							if (popup) {
								popup.postMessage(
									{
										type: "CHOICE_EMP_INIT",
										data: {
											empNm: editedUser.apvApofNm || "",
											empList: empList,
										},
									},
									"*"
								);
							}
						}, 100);
					},
				});
			}
		} catch (error) {
			console.error("Failed to search approver:", error);
			showConfirm({
				message: `승인결재자 조회 중 오류가 발생했습니다: ${(error as Error).message}`,
				type: "error",
				onConfirm: () => {},
				confirmOnly: true,
			});
		}
	};

	/**
	 * 팝업에서 승인결재자 선택 시 처리 함수
	 * ASIS: DblClick_COM_02_0600_Save() 함수와 동일한 로직
	 * COMZ100P00 팝업에서 직원을 더블클릭하여 선택했을 때 호출되는 함수
	 * 승인결재자 권한 체크 후 사용자 정보 저장을 진행
	 * @param approver 선택된 승인결재자 정보 (empNo: 사번, empNm: 성명, authCd: 권한코드)
	 */
	const handleApproverSelect = useCallback(
		(approver: { empNo: string; empNm: string; authCd: string }) => {
			// ASIS: arr[0]: 직원번호, arr[1]: 직원명, arr[2]: 권한코드
			// 권한 체크 (ASIS: fnApvNmAuthorityYn)
			if (approver.authCd !== "10" && approver.authCd !== "00") {
				showConfirm({
					message:
						"승인결재자는 부서장 이상이어야 합니다.\n재 입력 해 주십시요.",
					type: "warning",
					onConfirm: () => {
						// 승인결재자 입력 필드에 포커스
						const apvApofInput = document.getElementById(
							"apvApofNm"
						) as HTMLInputElement;
						if (apvApofInput) {
							apvApofInput.focus();
						}
					},
					confirmOnly: true,
				});
				return;
			}

			// ASIS: txtApvId.text = arr[0]; txtApvNm.text = arr[1];
			setEditedUser((prev) => ({
				...prev,
				apvApofId: approver.empNo, // 승인결재자ID
				apvApofNm: approver.empNm, // 승인결재자명
			}));

			// ASIS: fnUserInfoSave() 호출
			proceedWithSave({ id: approver.empNo, name: approver.empNm });
		},
		[showConfirm, proceedWithSave]
	);

	/**
	 * 비밀번호 초기화 함수
	 * ASIS: btnPasswordInit_click() 함수와 동일한 역할
	 * 선택된 사용자의 비밀번호를 초기화하고 결과를 처리
	 */
	const handlePasswordReset = async () => {
		if (!selectedUser) {
			showConfirm({
				message: "비밀번호를 초기화할 사용자를 선택해주세요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		showConfirm({
			message: `'${selectedUser.empNm}'님의 비밀번호를 초기화하시겠습니까?`,
			type: "info",
			onConfirm: async () => {
				try {
					const resultMessage = await usrApiService.initPassword(
						selectedUser.empNo
					);
					showToast(resultMessage, "info");
				} catch (error) {
					console.error("Failed to reset password:", error);
					showConfirm({
						message: `비밀번호 초기화 중 오류가 발생했습니다: ${(error as Error).message}`,
						type: "error",
						onConfirm: () => {},
						confirmOnly: true,
					});
				}
			},
		});
	};

	// 사용자 목록 컬럼 정의
	const userColumnDefs: ColDef[] = [
		{
			headerName: "사번",
			field: "empNo",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "성명",
			field: "empNm",
			width: 90,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "본부명",
			field: "hqDivNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "부서명",
			field: "deptDivNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "직급명",
			field: "dutyNm",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "직책구분",
			field: "dutyDivCdNm",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "사용자권한",
			field: "authCdNm",
			width: 110,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "사용자역할ID",
			field: "usrRoleId",
			width: 120,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "사용자역할",
			field: "usrRoleNm",
			width: 130,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "승인결재자",
			field: "apvApofNm",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "사업",
			field: "bsnUseYn",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
			cellRenderer: (params: any) => (
				<input type='checkbox' checked={params.value === "1"} readOnly />
			),
		},
		{
			headerName: "추진비",
			field: "wpcUseYn",
			width: 80,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
			cellRenderer: (params: any) => (
				<input type='checkbox' checked={params.value === "1"} readOnly />
			),
		},
		{
			headerName: "인사/복리",
			field: "psmUseYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
			cellRenderer: (params: any) => (
				<input type='checkbox' checked={params.value === "1"} readOnly />
			),
		},
	];

	// 업무별 사용권한 컬럼 정의
	const workAuthColumnDefs: ColDef[] = [
		{
			headerName: "업무구분",
			field: "smlCsfNm",
			width: 200,
			flex: 2,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
		{
			headerName: "사용권한",
			field: "wrkUseYn",
			width: 100,
			flex: 0,
			cellStyle: { textAlign: "center" },
			headerClass: "ag-center-header",
			cellRenderer: (params: any) => (
				<input type='checkbox' checked={params.value === "1"} readOnly />
			),
		},
		{
			headerName: "비고",
			field: "rmk",
			width: 150,
			flex: 1,
			cellStyle: { textAlign: "left" },
			headerClass: "ag-center-header",
		},
	];

	return (
		<div className='mdi'>
			{/* 상단 검색 영역 */}
			<div className='search-div mb-4'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[70px]'>본부</th>
							<td className='search-td w-[180px]'>
								<select
									name='hqDiv'
									value={searchParams.hqDiv}
									onChange={handleSearchParamChange}
									className='combo-base'
									id='hqDiv'
									title='본부 선택'
								>
									<option key='ALL' value='ALL'>
										전체
									</option>
									{hqCodeList.map((item) => (
										<option key={item.data} value={item.data}>
											{item.label}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[70px]'>부서</th>
							<td className='search-td w-[180px]'>
								<select
									name='deptDiv'
									value={searchParams.deptDiv}
									onChange={handleSearchParamChange}
									className='combo-base'
									id='deptDiv'
									title='부서 선택'
								>
									{deptCodeList.map((item) => (
										<option key={item.data} value={item.data}>
											{item.label}
										</option>
									))}
								</select>
							</td>
							<th className='search-th w-[90px]'>사용자명</th>
							<td className='search-td w-[180px]'>
								<input
									type='text'
									name='userNm'
									value={searchParams.userNm}
									onChange={handleSearchParamChange}
									className='input-base'
									id='userNm'
									placeholder='사용자명 입력'
									title='사용자명 입력'
									maxLength={20}
								/>
							</td>
							<td className='search-td text-right' colSpan={2}>
								<button onClick={handleSearch} className='btn-base btn-search'>
									조회
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* 사용자 목록 그리드 */}
			<div className='ag-theme-alpine' style={{ height: 400, width: "100%" }}>
				<AgGridReact
					rowData={userData || []}
					columnDefs={userColumnDefs}
					onRowClicked={(event) => handleUserSelect(event.data)}
					rowSelection='single'
					getRowClass={(params: any) =>
						selectedUser?.empNo === params.data.empNo ? "selected" : ""
					}
					defaultColDef={{
						resizable: true,
						sortable: true,
					}}
					components={{
						agColumnHeader: (props: any) => (
							<div style={{ textAlign: "center", width: "100%" }}>
								{props.displayName}
							</div>
						),
					}}
				/>
			</div>

			{/* 하단: 등록/수정 영역과 업무권한 테이블을 가로 배치 */}
			<div className='flex gap-4 items-start'>
				{/* 왼쪽: 업무권한 타이틀 + 테이블 */}
				<div className='w-[30%]'>
					<div className='tit_area'>
						<h2>업무별 사용권한</h2>
					</div>
					<div
						className='ag-theme-alpine'
						style={{ height: 300, width: "100%" }}
					>
						<AgGridReact
							rowData={workAuthList}
							columnDefs={workAuthColumnDefs}
							defaultColDef={{
								resizable: true,
								sortable: true,
							}}
							components={{
								agColumnHeader: (props: any) => (
									<div style={{ textAlign: "center", width: "100%" }}>
										{props.displayName}
									</div>
								),
							}}
						/>
					</div>
				</div>

				{/* 오른쪽: 사용자 등록 및 수정 */}
				<div className='flex-1'>
					<div className='tit_area'>
						<h2>사용자 등록 및 수정</h2>
					</div>
					<table className='form-table'>
						<tbody>
							<tr className='form-tr'>
								<th className='form-th w-[80px]'>사번</th>
								<td className='form-td w-[200px]'>
									<input
										name='empNo'
										value={formData.empNo}
										readOnly
										type='text'
										className='input-base input-default'
										id='empNo'
										title='사번 입력'
									/>
								</td>
								<th className='form-th w-[80px]'>성명</th>
								<td className='form-td !w-[150px]'>
									<input
										name='empNm'
										value={formData.empNm}
										readOnly
										type='text'
										className='input-base input-default'
										id='empNm'
										title='성명 입력'
									/>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>사용자권한</th>
								<td className='form-td'>
									<select
										name='authCd'
										value={editedUser?.authCd || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='authCd'
										title='사용자권한 선택'
									>
										<option key='auth-empty' value=''>
											선택
										</option>
										{authCodeList.map((code) => (
											<option key={code.data} value={code.data}>
												{code.label}
											</option>
										))}
									</select>
								</td>
								<th className='form-th'>직책구분</th>
								<td className='form-td'>
									<select
										name='dutyDivCd'
										value={editedUser?.dutyDivCd || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='dutyDivCd'
										title='직책구분 선택'
									>
										<option key='duty-empty' value=''>
											선택
										</option>
										{dutyDivCodeList.map((code) => (
											<option key={code.data} value={code.data}>
												{code.label}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>승인결재자</th>
								<td className='form-td'>
									<div className='flex items-center'>
										<input
											name='apvApofNm'
											value={editedUser?.apvApofNm || ""}
											onChange={handleUserInputChange}
											className='input-base input-default'
											id='apvApofNm'
											placeholder='승인결재자명을 입력하세요'
											title='승인결재자명 입력'
											maxLength={20}
										/>
									</div>
								</td>
								<th className='form-th'>사용자역할</th>
								<td className='form-td'>
									<select
										name='usrRoleId'
										value={editedUser?.usrRoleId || ""}
										onChange={handleUserInputChange}
										className='combo-base'
										id='usrRoleId'
										title='사용자 역할 선택'
									>
										<option key='role-empty' value=''>
											선택
										</option>
										{userRoleList.map((role) => (
											<option key={role.usrRoleId} value={role.usrRoleId}>
												{role.usrRoleNm}
											</option>
										))}
									</select>
								</td>
							</tr>
							<tr className='form-tr'>
								<th className='form-th'>업무권한</th>
								<td className='form-td' colSpan={3}>
									<div className='flex items-center gap-2 text-sm leading-none'>
										<select
											className='combo-base !w-[200px]'
											value={selectedWorkAuthCode}
											onChange={(e) => {
												setSelectedWorkAuthCode(e.target.value);
											}}
											id='workAuth'
											title='업무권한 선택'
										>
											<option key='work-auth-empty' value=''>
												== 선택 ==
											</option>
											{workAuthList.map((auth) => (
												<option key={auth.smlCsfCd} value={auth.smlCsfCd}>
													{auth.smlCsfNm}
												</option>
											))}
										</select>
										<label htmlFor='workAuthAction_1'>
											<input
												id='workAuthAction_1'
												type='radio'
												name='workAuthAction'
												value='1'
												checked={workAuthAction === "1"}
												onChange={(e) => {
													const value = e.target.value as "1";
													setWorkAuthAction(value);
													// 즉시 업무권한 변경 적용
													if (selectedWorkAuthCode) {
														handleWorkAuthChange(value);
													}
												}}
											/>{" "}
											부여
										</label>
										<label htmlFor='workAuthAction_0'>
											<input
												id='workAuthAction_0'
												type='radio'
												name='workAuthAction'
												value='0'
												checked={workAuthAction === "0"}
												onChange={(e) => {
													const value = e.target.value as "0";
													setWorkAuthAction(value);
													// 즉시 업무권한 변경 적용
													if (selectedWorkAuthCode) {
														handleWorkAuthChange(value);
													}
												}}
											/>{" "}
											해제
										</label>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					{/* 하단 버튼 영역 */}
					<div className='flex justify-end mt-4'>
						<button
							onClick={handlePasswordReset}
							className='btn-base btn-etc mr-2'
						>
							비밀번호 초기화
						</button>
						<button onClick={handleSave} className='btn-base btn-act'>
							저장
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default USR2010M00;
