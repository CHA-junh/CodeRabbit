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
	const [searchParams, setSearchParams] = useState(initialSearch);
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	const [editedUser, setEditedUser] = useState<Partial<UserSaveData>>({});
	// 업무권한 목록 상태
	const [workAuthList, setWorkAuthList] = useState<WorkAuthData[]>([]);
	const [workAuthLoading, setWorkAuthLoading] = useState(false);
	const [workAuthError, setWorkAuthError] = useState<string | null>(null);
	const [selectedWorkAuthCode, setSelectedWorkAuthCode] = useState<string>("");
	const [workAuthAction, setWorkAuthAction] = useState<"1" | "0">("1");
	const [formData, setFormData] = useState(initialFormData);

	const [potentialApprovers, setPotentialApprovers] = useState<any[]>([]); // COMZ100P00 호환을 위해 any[]
	const { openPopup } = usePopup();

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

	const handleSearchParamChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setSearchParams((prev) => ({ ...prev, [name]: value }));

		// 본부 변경 시 부서 콤보 업데이트
		if (name === "hqDiv") {
			// 부서를 'ALL'로 초기화
			setSearchParams((prev) => ({ ...prev, deptDiv: "ALL" }));

			if (value === "ALL") {
				// 본부가 "전체"일 때는 부서 콤보에 "전체"만 표시
				setDeptCodeList([{ data: "ALL", label: "전체" }]);
			} else {
				// 특정 본부 선택 시 해당 본부의 부서 목록 조회
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

	const handleSearch = () => {
		refetchUserList();
	};

	const handleUserSelect = (user: UserData) => {
		setSelectedUser(user);
		setFormData({
			empNo: user.empNo,
			empNm: user.empNm,
			authCd: user.authCd,
			dutyDivCd: user.dutyDivCd,
			apvApofId: user.apvApofId,
			apvApofNm: user.apvApofNm,
			usrRoleId: user.usrRoleId,
		});
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

		usrApiService.getWorkAuthList(user.empNo).then((list) => {
			setWorkAuthList(list);
			setEditedUser({ ...initialEditedUser, workAuthList: list });
			// 업무권한 콤보박스 초기값 설정
			if (list.length > 0) {
				setSelectedWorkAuthCode(list[0].smlCsfCd);
			}
		});
	};

	const handleUserInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setEditedUser((prev) => ({ ...prev, [name]: value }));
	};

	const handleWorkAuthChange = (action: "1" | "0") => {
		if (!selectedWorkAuthCode) {
			showConfirm({
				message: "수정할 업무권한을 선택하세요.",
				type: "warning",
				onConfirm: () => {},
				confirmOnly: true,
			});
			return;
		}

		const updatedList = workAuthList.map((auth) =>
			auth.smlCsfCd === selectedWorkAuthCode
				? { ...auth, wrkUseYn: action }
				: auth
		);

		setWorkAuthList(updatedList);
		setEditedUser((prev) => ({ ...prev, workAuthList: updatedList }));
	};

	// useEffect 제거 - 무한 루프 방지

	const proceedWithSave = async (approver: { id: string; name: string }) => {
		showConfirm({
			message: "저장하시겠습니까?",
			type: "info",
			onConfirm: async () => {
				// 현재 업무권한 목록에서 부여된 권한만 필터링
				const currentWorkAuthList = editedUser.workAuthList || workAuthList;

				const saveData: UserSaveData = {
					...selectedUser!,
					...editedUser,
					apvApofId: approver.id,
					apvApofNm: approver.name,
					workAuthList: currentWorkAuthList,
					regUserId: user && "empNo" in user ? (user as any).empNo : "",
				};

				try {
					await usrApiService.saveUser(saveData);
					showToast("성공적으로 저장되었습니다.", "info");

					// 저장 후 사용자 목록 새로고침
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
	};

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
				// 여러 명일 경우 팝업 열기
				setPotentialApprovers(
					approvers.map((a, i) => ({ ...a, LIST_NO: i + 1 }))
				);
				openPopup({
					url: "/com/COMZ100P00",
					size: "medium",
					position: "center",
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

	const handleApproverSelect = (approver: {
		empNo: string;
		empNm: string;
		authCd: string;
	}) => {
		if (approver.authCd !== "10" && approver.authCd !== "00") {
			showToast(
				"승인결재자는 부서장 이상이어야 합니다.\n다른 사람을 선택해주세요.",
				"warning"
			);
			// COMZ100P00에서는 팝업을 닫지 않고 다시 선택을 유도하기 어려우므로,
			// 일단 팝업을 닫고 사용자에게 재시도를 안내합니다.
			return;
		}

		setEditedUser((prev) => ({
			...prev,
			apvApofId: approver.empNo,
			apvApofNm: approver.empNm,
		}));
		proceedWithSave({ id: approver.empNo, name: approver.empNm });
	};

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
