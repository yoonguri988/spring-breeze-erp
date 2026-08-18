// pages/dept/edit.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import {
  ApartmentOutlined,
  ArrowLeftOutlined,
  BlockOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  RightOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

import {
  updateDeptRequest,
  checkDeptCodeRequest,
  deleteDeptRequest,
  fetchDeptDetailRequest,
  fetchDeptFlatRequest,
  resetDeptState,
} from "../../reducers/dept/deptReducer";
import { listEmpRequest, resetEmpState } from "../../reducers/emp/empReducer";
import { fetchCompanyDetailRequest, resetCompanyState } from "../../reducers/com/companyReducer";
import DeptDeleteModal from "../../components/DeptDeleteModal";

const DEPTH_LABELS = ["", "본부", "팀", "셀", "파트"];

export default function DeptEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { detail: companyDetail } = useSelector((state) => state.company);
  const {
    flatList: depts,
    detail,
    deptCodeCheck,
    loading,
    error,
    success,
    pendingTransfer,
  } = useSelector((state) => state.dept);
  const { empList } = useSelector((state) => state.emp);

  const deptId = router.query.deptId ? String(router.query.deptId) : "";
  const comId = router.query.comId
    ? String(router.query.comId)
    : detail?.dept?.comId
      ? String(detail.dept.comId)
      : "";
  const returnUrl = router.query.returnUrl || "";
  const backUrl =
    returnUrl || (comId ? `/dept/list?comId=${comId}` : "/dept/list");

  // 화면에 소속 회사명만 보여주면 되므로, 회사 전체 목록을 가져올 필요 없이
  // comId 단건 상세(GET /api/com/{comId})만 조회한다.
  const com = companyDetail?.com;

  const dept = detail?.dept || null;

  console.log(empList)
  const deptEmpList = useMemo(
    () =>
      (empList?.list || []).filter(
        (e) => dept && String(e.deptId) === String(dept.deptId),
      ),
    [empList, dept],
  );

  const [parentId, setParentId] = useState("0");
  const [depth, setDepth] = useState(1);
  const [deptName, setDeptName] = useState("");
  const [leaderName, setLeaderName] = useState(null);
  const [leaderPos, setLeaderPos] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const prevLoading = useRef(false);

  useEffect(() => {
    dispatch(listEmpRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady || !deptId) return;
    dispatch(fetchDeptDetailRequest(deptId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, deptId]);

  useEffect(() => {
    if (!comId) return;
    dispatch(fetchCompanyDetailRequest(comId));
    dispatch(fetchDeptFlatRequest(comId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, comId]);

  // 상세 로드 후 폼 초기값 세팅
  useEffect(() => {
    if (!dept) return;
    form.setFieldsValue({
      deptName: dept.deptName,
      deptCode: dept.deptCode,
      parentId: dept.parentId ? String(dept.parentId) : "0",
      sortOrder: dept.sortOrder || 1,
      empId: dept.leaderId ? String(dept.leaderId) : undefined,
    });
    setDeptName(dept.deptName || "");
    setParentId(dept.parentId ? String(dept.parentId) : "0");
    setDepth(dept.depth || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept]);

  useEffect(() => {
    if (!dept?.leaderId) return;
    const emp = deptEmpList.find(
      (e) => String(e.empId) === String(dept.leaderId),
    );
    if (emp) {
      setLeaderName(emp.empName);
      setLeaderPos(emp.posName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept, deptEmpList]);

  useEffect(() => {
    if (!submitting) return;
    if (success) {
      message.success("변경사항이 저장되었습니다.");
      setSubmitting(false);
      dispatch(resetDeptState());
      router.push(backUrl);
    } else if (error) {
      message.error(error);
      setSubmitting(false);
      dispatch(resetDeptState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, submitting]);

  useEffect(() => {
    if (!deleting) return;
    if (success) {
      if (pendingTransfer) {
        message.info("소속 사원 이관이 필요합니다.");
        setConfirmOpen(false);
        setDeleting(false);
        dispatch(resetDeptState());
        router.push({ pathname: "/dept/transfer/list", query: { deptId } });
        return;
      }
      message.success("삭제 처리되었습니다.");
      setConfirmOpen(false);
      setDeleting(false);
      dispatch(resetDeptState());
      router.push(backUrl);
    } else if (error) {
      message.error(error);
      setDeleting(false);
      dispatch(resetDeptState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, deleting]);

  useEffect(() => {
    return () => {
      dispatch(resetDeptState());
      dispatch(resetEmpState());
      dispatch(resetCompanyState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectableParents = useMemo(
    () => (depts || []).filter((d) => String(d.deptId) !== deptId),
    [depts, deptId],
  );

  const parentOptions = useMemo(
    () => [
      { value: "0", label: "없음 (최상위 본부)" },
      ...selectableParents.map((d) => ({
        value: String(d.deptId),
        label: `${"　".repeat(d.depth || 0)}${d.depth > 0 ? "└ " : ""}${d.deptName} (${d.deptCode})`,
      })),
    ],
    [selectableParents],
  );

  const handleParentChange = (value) => {
    setParentId(value);
    const opt = selectableParents.find((d) => String(d.deptId) === value);
    const parentDepth = opt ? opt.depth : 0;
    const nextDepth = !value || value === "0" ? 1 : parentDepth + 1;
    setDepth(nextDepth);
  };

  const handleLeaderChange = (value) => {
    const emp = deptEmpList.find((e) => String(e.empId) === value);
    if (!emp) {
      setLeaderName(null);
      setLeaderPos(null);
      return;
    }
    setLeaderName(emp.empName);
    setLeaderPos(emp.posName);
  };

  const handleCodeBlur = () => {
    const code = form.getFieldValue("deptCode");
    if (!code || !comId) return;
    if (dept && code === dept.deptCode) return;
    dispatch(checkDeptCodeRequest({ comId, deptCode: code, deptId }));
  };

  // 계층 경로: 선택된 상위부서부터 parentId 체인을 따라 회사명까지 역순으로 구성
  const hierNodes = useMemo(() => {
    const chain = [];
    let curId = parentId;
    let guard = 0;
    while (curId && curId !== "0" && guard < 20) {
      const opt = selectableParents.find((d) => String(d.deptId) === curId);
      if (!opt) break;
      chain.unshift(`${opt.deptName} (${opt.deptCode})`);
      curId = opt.parentId ? String(opt.parentId) : "0";
      guard++;
    }
    return [com?.comName || "회사", ...chain];
  }, [parentId, selectableParents, com]);

  const onFinish = (values) => {
    if (deptCodeCheck?.checked && deptCodeCheck?.duplicate) {
      message.error("이미 사용 중인 부서코드입니다.");
      return;
    }
    setSubmitting(true);
    dispatch(
      updateDeptRequest({
        deptId,
        dto: {
          comId,
          deptName: values.deptName,
          deptCode: (values.deptCode || "").toUpperCase(),
          parentId: parentId && parentId !== "0" ? parentId : null,
          depth,
          sortOrder: values.sortOrder,
          empId: values.empId || null,
          returnUrl: returnUrl || undefined,
        },
      }),
    );
  };

  const confirmDelete = () => {
    setDeleting(true);
    dispatch(deleteDeptRequest(deptId));
  };

  const statusBadgeClass = (status) => {
    if (status === "재직") return "sb-badge sb-badge--green";
    if (status === "휴직") return "sb-badge sb-badge--amber";
    if (status === "퇴직") return "sb-badge sb-badge--cyan";
    return "sb-badge sb-badge--gray";
  };

  if (router.isReady && !dept && !loading) {
    return (
      <div className="sb-content">
        <div className="sb-page-head">
          <div className="sb-page-head__txt">
            <div className="sb-breadcrumb">
              <Link href="/">홈</Link> <RightOutlined />{" "}
              <Link href="/dept/list">부서 관리</Link> <RightOutlined /> 수정
            </div>
            <h1>부서 수정</h1>
          </div>
        </div>
        <div className="sb-card">
          <div className="sb-empty">
            <ExclamationCircleOutlined style={{ fontSize: 34, opacity: 0.5 }} />
            <p>해당 부서를 찾을 수 없습니다.</p>
            <Link href="/dept/list">
              <Button className="mt-2">
                목록으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sb-content">
      {/* 페이지 헤더 */}
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <RightOutlined />{" "}
            <Link href={backUrl}>부서 관리</Link> <RightOutlined /> 수정{" "}
            <span className="admin-tag ms-2">관리자</span>
          </div>
          <h1>{dept ? `${dept.deptName} · 수정` : "부서 수정"}</h1>
          <p>
            {dept &&
              `DEPT-${String(dept.deptId).padStart(3, "0")} · 부서 정보를 수정합니다.`}
          </p>
        </div>
        <div className="sb-page-head__actions">
          <Link href={backUrl}>
            <Button icon={<ArrowLeftOutlined />}>
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      {dept && (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={(changed) => {
            if ("deptName" in changed) setDeptName(changed.deptName);
          }}
          className="form-wide"
        >
          {/* ① 기본 정보 */}
          <div className="sb-card mb-3">
            <div className="sb-card__head">
              <h2>
                <ApartmentOutlined className="me-2 text-soft" />
                기본 정보
              </h2>
              <div className="right">
                <span className="sb-badge sb-badge--gray">
                  DEPT-{String(dept.deptId).padStart(3, "0")}
                </span>
              </div>
            </div>
            <div className="sb-card__body">
              <div className="row g-3">
                <div className="col-md-8">
                  <Form.Item
                    label="부서명"
                    name="deptName"
                    rules={[
                      { required: true, message: "부서명을 입력하세요." },
                    ]}
                  >
                    <Input maxLength={100} />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    label="부서코드"
                    name="deptCode"
                    rules={[
                      { required: true, message: "부서코드를 입력하세요." },
                    ]}
                    validateStatus={
                      deptCodeCheck?.checked && deptCodeCheck?.duplicate
                        ? "error"
                        : undefined
                    }
                    help={
                      deptCodeCheck?.checked && deptCodeCheck?.duplicate
                        ? "이미 사용 중인 부서코드입니다."
                        : undefined
                    }
                  >
                    <Input
                      maxLength={45}
                      style={{ textTransform: "uppercase" }}
                      onChange={(e) =>
                        form.setFieldsValue({
                          deptCode: e.target.value.toUpperCase(),
                        })
                      }
                      onBlur={handleCodeBlur}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          {/* ② 소속 및 계층 */}
          <div className="sb-card mb-3">
            <div className="sb-card__head">
              <h2>
                <ApartmentOutlined className="me-2 text-soft" />
                소속 및 계층
              </h2>
            </div>
            <div className="sb-card__body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="sb-form-label">소속 회사</label>
                  <Input
                    value={com?.comName || ""}
                    readOnly
                    style={{
                      background: "#fafbfc",
                      color: "var(--sb-ink-soft)",
                    }}
                  />
                  <div className="text-faint mt-1" style={{ fontSize: 12 }}>
                    소속 회사는 변경할 수 없습니다.
                  </div>
                </div>

                <div className="col-md-6">
                  <Form.Item label="상위 부서" name="parentId">
                    <Select
                      options={parentOptions}
                      onChange={handleParentChange}
                    />
                  </Form.Item>
                  <div className="text-faint mt-1" style={{ fontSize: 12 }}>
                    <InfoCircleOutlined className="me-1" />
                    자기 자신/하위 부서는 선택할 수 없습니다. 변경 시 하위
                    부서의 depth가 함께 갱신됩니다.
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="sb-form-label">계층 깊이</label>
                  <div className="depth-info-box">
                    <BlockOutlined className="text-faint" />
                    <span>depth</span>
                    <span className="depth-val">{depth}</span>
                    <span className="text-faint">
                      · {DEPTH_LABELS[depth] || "하위"}
                    </span>
                  </div>
                </div>

                <div className="col-md-4">
                  <Form.Item label="정렬 순서" name="sortOrder">
                    <InputNumber min={1} max={999} style={{ width: "100%" }} />
                  </Form.Item>
                </div>

                <div className="col-12">
                  <label className="sb-form-label">계층 미리보기</label>
                  <div className="hier-preview">
                    {hierNodes.map((n, i) => (
                      <React.Fragment key={i}>
                        <span className="hier-node">{n}</span>
                        <RightOutlined className="hier-sep" />
                      </React.Fragment>
                    ))}
                    {deptName ? (
                      <span className="hier-node hier-node--new">
                        {deptName}
                      </span>
                    ) : (
                      <span className="text-faint" style={{ fontSize: 12.5 }}>
                        부서명 입력 중…
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ③ 부서장 */}
          <div className="sb-card mb-3">
            <div className="sb-card__head">
              <h2>
                <UserSwitchOutlined className="me-2 text-soft" />
                부서장
              </h2>
              <span className="sub">선택 사항</span>
            </div>
            <div className="sb-card__body">
              <div className="row g-3 align-items-center">
                <div className="col-md-6">
                  <Form.Item label="부서장 사원 선택" name="empId">
                    <Select
                      allowClear
                      placeholder="지정 안 함"
                      onChange={handleLeaderChange}
                      options={deptEmpList.map((e) => ({
                        value: String(e.empId),
                        label: `${e.empName} (${e.posName})`,
                      }))}
                    />
                  </Form.Item>
                </div>
                {leaderName && (
                  <div className="col-md-6">
                    <label className="sb-form-label">&nbsp;</label>
                    <div>
                      <span className="lead-chip">
                        <span className="sb-avatar">
                          {leaderName.charAt(0)}
                        </span>
                        <span>
                          {leaderName} · {leaderPos}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 소속 사원 현황 (읽기전용) */}
          <div className="sb-card mb-3">
            <div className="sb-card__head">
              <h2>
                <TeamOutlined className="me-2 text-soft" />
                소속 사원 현황
              </h2>
              <span className="sub">총 {deptEmpList.length}명</span>
            </div>
            <div className="sb-card__body--flush">
              {deptEmpList.length > 0 ? (
                <table className="sb-table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>사번</th>
                      <th>이름</th>
                      <th style={{ width: 100 }}>직급</th>
                      <th style={{ width: 160 }}>이메일</th>
                      <th style={{ width: 90 }}>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptEmpList.map((e) => (
                      <tr key={e.empId}>
                        <td className="sb-hr-cell tnum">{e.empNo}</td>
                        <td>
                          <div className="sb-rowuser">
                            <span
                              className="sb-avatar"
                              style={{ width: 28, height: 28, fontSize: 12 }}
                            >
                              {(e.empName || "").charAt(0)}
                            </span>
                            <span className="sb-table__name">{e.empName}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className="sb-badge sb-badge--gray"
                            style={{ fontSize: 11.5 }}
                          >
                            {e.posName}
                          </span>
                        </td>
                        <td className="sb-hr-cell" style={{ fontSize: 12.5 }}>
                          {e.empEmail}
                        </td>
                        <td>
                          <span className={statusBadgeClass(e.empStatus)}>
                            {e.empStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="sb-empty">
                  <TeamOutlined style={{ fontSize: 30, opacity: 0.5 }} />
                  <p>소속 사원이 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-between">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setConfirmOpen(true)}
            >
              부서 삭제
            </Button>
            <div className="d-flex gap-2">
              <Link href={backUrl}>
                <Button>취소</Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />}
                loading={submitting && loading}
              >
                변경사항 저장
              </Button>
            </div>
          </div>
        </Form>
      )}

      <DeptDeleteModal
        target={
          dept
            ? {
                deptId: dept.deptId,
                deptName: dept.deptName,
                deptCode: dept.deptCode,
                empCount: deptEmpList.length,
                childCount: (depts || []).filter(
                  (d) => String(d.parentId) === String(dept.deptId),
                ).length,
              }
            : null
        }
        open={confirmOpen}
        loading={deleting && loading}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}