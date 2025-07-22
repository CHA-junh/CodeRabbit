"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	UserData,
	WorkAuthData,
	UserSaveData,
	usrApiService,
	CodeData,
} from "@/modules/usr/services/usr-api.service";
import "../designs/common.css";
import COMZ100P00, { EmpSearchModalRef } from "@/app/com/COMZ100P00";
import { useToast } from "@/contexts/ToastContext";

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

const USR2010M00: React.FC = () => {
	const { showToast, showConfirm } = useToast();
	const [searchParams, setSearchParams] = useState(initialSearch);
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	const [editedUser, setEditedUser] = useState<Partial<UserSaveData>>({});
	const [workAuthList, setWorkAuthList] = useState<WorkAuthData[]>([]);
	const [selectedWorkAuthCode, setSelectedWorkAuthCode] = useState<string>("");
	const [workAuthAction, setWorkAuthAction] = useState<"1" | "0">("1");
	const [formData, setFormData] = useState(initialFormData);

	const [potentialApprovers, setPotentialApprovers] = useState<any[]>([]); // COMZ100P00 호환을 위해 any[]
	const [isApproverPopupOpen, setIsApproverPopupOpen] = useState(false);
	const empSearchModalRef = useRef<EmpSearchModalRef>(null);

	const [hqCodeList, setHqCodeList] = useState<CodeData[]>([]);
	const [deptCodeList, setDeptCodeList] = useState<CodeData[]>([]);
	const [authCodeList, setAuthCodeList] = useState<CodeData[]>([]);
	const [dutyDivCodeList, setDutyDivCodeList] = useState<CodeData[]>([]);
	const [workAuthCodeList, setWorkAuthCodeList] = useState<CodeData[]>([]);
	const [userRoleList, setUserRoleList] = useState<
		{ usrRoleId: string; usrRoleNm: string }[]
	>([]);

	const { data: userData, refetch: refetchUserList } = useQuery<UserData[]>({
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
		if (hqData) setHqCodeList(hqData);
		if (deptData) setDeptCodeList(deptData);
		if (authData) setAuthCodeList(authData);
		if (dutyDivData) setDutyDivCodeList(dutyDivData);
		if (workAuthData) setWorkAuthCodeList(workAuthData);
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
			usrApiService
				.getWorkAuthList("")
				.then((list) => {
					setWorkAuthList(list);
				})
				.catch((error) => {
					console.error("업무권한 목록 조회 실패:", error);
					// 에러 발생 시 기본 업무권한 목록 설정
					const defaultWorkAuthList = [
						{ smlCsfCd: "01", smlCsfNm: "사업관리", wrkUseYn: "0", rmk: "" },
						{
							smlCsfCd: "02",
							smlCsfNm: "프로젝트관리",
							wrkUseYn: "0",
							rmk: "",
						},
						{
							smlCsfCd: "03",
							smlCsfNm: "업무추진비관리",
							wrkUseYn: "0",
							rmk: "",
						},
						{ smlCsfCd: "05", smlCsfNm: "인사관리", wrkUseYn: "0", rmk: "" },
						{ smlCsfCd: "06", smlCsfNm: "시스템관리", wrkUseYn: "0", rmk: "" },
					];
					setWorkAuthList(defaultWorkAuthList);
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
						setDeptCodeList(deptList);
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
			showToast("수정할 업무권한을 선택하세요.", "warning");
			return;
		}

		console.log("🔍 handleWorkAuthChange 호출:");
		console.log("  - selectedWorkAuthCode:", selectedWorkAuthCode);
		console.log("  - action:", action);
		console.log("  - 현재 workAuthList:", workAuthList);

		const updatedList = workAuthList.map((auth) =>
			auth.smlCsfCd === selectedWorkAuthCode
				? { ...auth, wrkUseYn: action }
				: auth
		);

		console.log("  - 업데이트된 workAuthList:", updatedList);

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
				console.log("🔍 저장할 업무권한 목록:", currentWorkAuthList);

				const saveData: UserSaveData = {
					...selectedUser!,
					...editedUser,
					apvApofId: approver.id,
					apvApofNm: approver.name,
					workAuthList: currentWorkAuthList,
					regUserId: "SYSTEM", // TODO: 실제 로그인한 사용자 ID로 변경 필요
				};

				try {
					await usrApiService.saveUser(saveData);
					showToast("성공적으로 저장되었습니다.", "info");

					// 저장 후 사용자 목록 새로고침
					console.log("🔍 저장 후 사용자 목록 새로고침...");
					await refetchUserList();

					// 현재 선택된 사용자가 있다면 업데이트된 정보로 다시 설정
					if (selectedUser) {
						console.log("🔍 선택된 사용자 정보 업데이트...");
						const updatedUserList =
							await usrApiService.getUserList(searchParams);
						const updatedUser = updatedUserList.find(
							(u) => u.empNo === selectedUser.empNo
						);
						if (updatedUser) {
							console.log("🔍 업데이트된 사용자 정보:", updatedUser);
							handleUserSelect(updatedUser);
						}
					}
				} catch (error) {
					console.error("Failed to save user:", error);
					showToast(
						`저장 중 오류가 발생했습니다: ${(error as Error).message}`,
						"error"
					);
				}
			},
		});
	};

	const handleSave = async () => {
		if (!selectedUser || !editedUser.empNo) {
			showToast("저장할 사용자를 선택해주세요.", "warning");
			return;
		}

		if (!editedUser.apvApofNm) {
			showToast("승인결재자를 입력해 주십시요.", "warning");
			return;
		}

		if (!editedUser.authCd) {
			showToast("사용자권한을 선택해 주십시요.", "warning");
			return;
		}

		if (!editedUser.dutyDivCd) {
			showToast("직책구분을 선택해 주십시요.", "warning");
			return;
		}

		try {
			const approvers = await usrApiService.getUserList({
				hqDiv: "ALL",
				deptDiv: "ALL",
				userNm: editedUser.apvApofNm,
			});

			if (approvers.length === 0) {
				showToast(
					"사용자 정보에 미등록된 승인결재자 입니다. 승인결재자를 다시 입력해 주십시요.",
					"warning"
				);
				return;
			} else if (approvers.length === 1) {
				const approver = approvers[0];
				if (approver.authCd !== "10" && approver.authCd !== "00") {
					showToast(
						"승인결재자는 부서장 이상이어야 합니다.\n재 입력 해 주십시요.",
						"warning"
					);
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
				setIsApproverPopupOpen(true);
			}
		} catch (error) {
			console.error("Failed to search approver:", error);
			showToast(
				`승인결재자 조회 중 오류가 발생했습니다: ${(error as Error).message}`,
				"error"
			);
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
			setIsApproverPopupOpen(false);
			return;
		}

		setEditedUser((prev) => ({
			...prev,
			apvApofId: approver.empNo,
			apvApofNm: approver.empNm,
		}));
		setIsApproverPopupOpen(false); // 팝업 닫기
		// 저장 로직 진행
		proceedWithSave({ id: approver.empNo, name: approver.empNm });
	};

	const handlePasswordReset = async () => {
		if (!selectedUser) {
			showToast("비밀번호를 초기화할 사용자를 선택해주세요.", "warning");
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
					showToast(
						`비밀번호 초기화 중 오류가 발생했습니다: ${(error as Error).message}`,
						"error"
					);
				}
			},
		});
	};

	return (
		<div className='mdi'>
			{isApproverPopupOpen && (
				<COMZ100P00
					ref={empSearchModalRef}
					defaultEmpNm={editedUser.apvApofNm || ""}
					defaultEmpList={potentialApprovers}
					onSelect={handleApproverSelect}
					onClose={() => setIsApproverPopupOpen(false)}
				/>
			)}
			{/* 상단 검색 영역 */}
			<div className='search-div mb-4'>
				<table className='search-table'>
					<tbody>
						<tr className='search-tr'>
							<th className='search-th w-[70px]'>본부</th>
							<td className='search-td w-[180px]'>
								<select
									name='hqDiv'
									onChange={handleSearchParamChange}
									className='combo-base'
									id='searchHqDiv'
								>
									<option value='ALL'>전체</option>
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
									onChange={handleSearchParamChange}
									className='combo-base'
									id='searchDeptDiv'
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
									name='userNm'
									onChange={handleSearchParamChange}
									type='text'
									className='input-base input-default'
									id='searchUserNm'
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
			<div
				className='gridbox-div mb-4'
				style={{ height: "400px", overflow: "auto" }}
			>
				<table className='grid-table'>
					<thead>
						<tr>
							<th className='grid-th'>사번</th>
							<th className='grid-th'>성명</th>
							<th className='grid-th'>본부명</th>
							<th className='grid-th'>부서명</th>
							<th className='grid-th'>직급명</th>
							<th className='grid-th'>직책구분</th>
							<th className='grid-th'>사용자권한</th>
							<th className='grid-th'>사용자역할ID</th>
							<th className='grid-th'>사용자역할</th>
							<th className='grid-th'>승인결재자</th>
							<th className='grid-th'>사업</th>
							<th className='grid-th'>추진비</th>
							<th className='grid-th'>인사/복리</th>
						</tr>
					</thead>
					<tbody>
						{userData && userData.length > 0
							? userData.map((user, idx) => (
									<tr
										key={user.empNo}
										className={`grid-tr ${selectedUser?.empNo === user.empNo ? "selected" : ""}`}
										onClick={() => handleUserSelect(user)}
										style={{ cursor: "pointer" }}
									>
										<td className='grid-td'>{user.empNo}</td>
										<td className='grid-td'>{user.empNm}</td>
										<td className='grid-td'>{user.hqDivNm}</td>
										<td className='grid-td'>{user.deptDivNm}</td>
										<td className='grid-td'>{user.dutyNm}</td>
										<td className='grid-td'>{user.dutyDivCdNm}</td>
										<td className='grid-td'>{user.authCdNm}</td>
										<td className='grid-td'>{user.usrRoleId}</td>
										<td className='grid-td'>{user.usrRoleNm}</td>
										<td className='grid-td'>{user.apvApofNm}</td>
										<td className='grid-td text-center'>
											<input
												type='checkbox'
												checked={user.bsnUseYn === "1"}
												readOnly
											/>
										</td>
										<td className='grid-td text-center'>
											<input
												type='checkbox'
												checked={user.wpcUseYn === "1"}
												readOnly
											/>
										</td>
										<td className='grid-td text-center'>
											<input
												type='checkbox'
												checked={user.psmUseYn === "1"}
												readOnly
											/>
										</td>
									</tr>
								))
							: // 조회 결과가 없을 때 빈 행들을 추가하여 높이 유지
								Array.from({ length: 15 }, (_, idx) => (
									<tr key={`empty-${idx}`} className='grid-tr'>
										<td className='grid-td' colSpan={13}>
											&nbsp;
										</td>
									</tr>
								))}
					</tbody>
				</table>
			</div>

			{/* 하단: 등록/수정 영역과 업무권한 테이블을 가로 배치 */}
			<div className='flex gap-4 items-start'>
				{/* 왼쪽: 업무권한 타이틀 + 테이블 */}
				<div className='w-[30%]'>
					<div className='tit_area'>
						<h2>업무별 사용권한</h2>
					</div>
					<div className='gridbox-div'>
						<table className='grid-table'>
							<thead>
								<tr>
									<th className='grid-th'>업무구분</th>
									<th className='grid-th w-[70px]'>사용권한</th>
									<th className='grid-th'>비고</th>
								</tr>
							</thead>
							<tbody>
								{workAuthList.map((task, idx) => (
									<tr className='grid-tr' key={idx}>
										<td className='grid-td'>{task.smlCsfNm}</td>
										<td className='grid-td text-center'>
											<input
												type='checkbox'
												checked={task.wrkUseYn === "1"}
												readOnly // 직접 수정 방지
											/>
										</td>
										<td className='grid-td'>{task.rmk}</td>
									</tr>
								))}
							</tbody>
						</table>
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
									>
										<option value=''>선택</option>
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
									>
										<option value=''>선택</option>
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
									>
										<option value=''>선택</option>
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
												console.log("🔍 업무권한 콤보 변경:", e.target.value);
												setSelectedWorkAuthCode(e.target.value);
											}}
											id='workAuth'
										>
											<option value=''>== 선택 ==</option>
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
													console.log("🔍 부여 라디오 버튼 변경:", value);
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
													console.log("🔍 해제 라디오 버튼 변경:", value);
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
