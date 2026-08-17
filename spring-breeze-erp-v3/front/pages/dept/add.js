// pages/dept/add.js
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
  RightOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

import {
  addDeptRequest,
  checkDeptCodeRequest,
  fetchDeptFlatRequest,
  resetDeptState,
} from "../../reducers/dept/deptReducer";
import { listEmpRequest, resetEmpState } from "../../reducers/emp/empReducer";
import { fetchCompanyListRequest } from "../../reducers/com/companyReducer";

const DEPTH_LABELS = ["", "본부", "팀", "셀", "파트"];

export default function DeptAddPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { list: companies } = useSelector((state) => state.company);
  const {
    flatList: depts,
    deptCodeCheck,
    loading,
    error,
    success,
  } = useSelector((state) => state.dept);
  const { empList: employees } = useSelector((state) => state.emp);

  const comId = router.query.comId ? String(router.query.comId) : "";
  const parentIdQuery = router.query.parentId
    ? String(router.query.parentId)
    : "";
  const returnUrl = router.query.returnUrl || "";
  const backUrl =
    returnUrl || (comId ? `/dept/list?comId=${comId}` : "/dept/list");

  const com = useMemo(
    () => (companies || []).find((c) => String(c.comId) === comId),
    [companies, comId],
  );

  const [parentId, setParentId] = useState(parentIdQuery || "0");
  const [depth, setDepth] = useState(1);
  const [deptName, setDeptName] = useState("");
  const [leaderName, setLeaderName] = useState(null);
  const [leaderPos, setLeaderPos] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const prevLoading = useRef(false);

  useEffect(() => {
    dispatch(fetchCompanyListRequest({ onepagelist: 100 }));
    dispatch(listEmpRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!comId) return;
    dispatch(fetchDeptFlatRequest(comId));
    form.setFieldsValue({ sortOrder: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, comId]);

  useEffect(() => {
    if (depts && depts.length) {
      form.setFieldsValue({ sortOrder: depts.length + 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depts]);

  useEffect(() => {
    prevLoading.current = loading;
  }, [loading]);

  useEffect(() => {
    if (!submitting) return;
    if (prevLoading.current && !loading) {
      if (success) {
        message.success("부서가 등록되었습니다.");
        setSubmitting(false);
        dispatch(resetDeptState());
        router.push(backUrl);
      } else if (error) {
        message.error(error);
        setSubmitting(false);
        dispatch(resetDeptState());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, submitting]);

  useEffect(() => {
    return () => {
      dispatch(resetDeptState());
      dispatch(resetEmpState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parentOptions = useMemo(
    () => [
      { value: "0", label: "없음 (최상위 본부)", depth: 0 },
      ...(depts || []).map((d) => ({
        value: String(d.deptId),
        label: `${"　".repeat(d.depth || 0)}${d.depth > 0 ? "└ " : ""}${d.deptName} (${d.deptCode})`,
        depth: d.depth,
      })),
    ],
    [depts],
  );

  const handleParentChange = (value) => {
    setParentId(value);
    const opt = (depts || []).find((d) => String(d.deptId) === value);
    const parentDepth = opt ? opt.depth : 0;
    const nextDepth = !value || value === "0" ? 1 : parentDepth + 1;
    setDepth(nextDepth);
  };

  const handleLeaderChange = (value) => {
    const emp = (employees || []).find((e) => String(e.empId) === value);
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
    dispatch(checkDeptCodeRequest({ comId, deptCode: code }));
  };

  // 계층 미리보기 노드 목록: [회사명, (상위부서명), (입력중인 부서명)]
  const hierNodes = useMemo(() => {
    const nodes = [com?.comName || "회사"];
    if (parentId && parentId !== "0") {
      const opt = parentOptions.find((o) => o.value === parentId);
      if (opt) nodes.push(opt.label.replace(/^[\s└]+/, "").trim());
    }
    return nodes;
  }, [com, parentId, parentOptions]);

  const onFinish = (values) => {
    if (!comId) {
      message.error(
        "소속 회사 정보가 없습니다. 목록 화면에서 다시 진입해주세요.",
      );
      return;
    }
    if (deptCodeCheck?.checked && deptCodeCheck?.duplicate) {
      message.error("이미 사용 중인 부서코드입니다.");
      return;
    }
    setSubmitting(true);
    dispatch(
      addDeptRequest({
        comId,
        deptName: values.deptName,
        deptCode: (values.deptCode || "").toUpperCase(),
        parentId: parentId && parentId !== "0" ? parentId : null,
        depth,
        sortOrder: values.sortOrder,
        empId: values.empId || null,
        returnUrl: returnUrl || undefined,
      }),
    );
  };

  return (
    <div className="sb-content">
      {/* 페이지 헤더 */}
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <RightOutlined />{" "}
            <Link href={backUrl}>부서 관리</Link> <RightOutlined /> 등록
          </div>
          <h1>부서 등록</h1>
          <p>새로운 부서를 시스템에 등록합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href={backUrl}>
            <Button icon={<ArrowLeftOutlined />} size="small">
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(changed) => {
          if ("deptName" in changed) setDeptName(changed.deptName);
        }}
        initialValues={{ parentId: parentIdQuery || "0", sortOrder: 1 }}
      >
        {/* ① 기본 정보 */}
        <div className="sb-card mb-3">
          <div className="sb-card__head">
            <h2>
              <ApartmentOutlined className="me-2 text-soft" />
              기본 정보
            </h2>
          </div>
          <div className="sb-card__body">
            <div className="row g-3">
              <div className="col-md-8">
                <Form.Item
                  label="부서명"
                  name="deptName"
                  rules={[{ required: true, message: "부서명을 입력하세요." }]}
                >
                  <Input placeholder="예: 플랫폼개발팀" maxLength={100} />
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
                      : "영문 대문자 · 숫자 권장"
                  }
                >
                  <Input
                    placeholder="예: PLT"
                    maxLength={45}
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase();
                      form.setFieldsValue({ deptCode: upper });
                    }}
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
                  style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
                />
              </div>

              <div className="col-md-6">
                <Form.Item label="상위 부서" name="parentId">
                  <Select
                    options={parentOptions}
                    onChange={handleParentChange}
                  />
                </Form.Item>
                <div className="text-faint mt-1" style={{ fontSize: 12 }}>
                  비워두면 최상위 본부(depth 1)로 등록됩니다.
                </div>
              </div>

              <div className="col-md-6">
                <div className="row g-3">
                  <div className="col-6">
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
                  <div className="col-6">
                    <Form.Item label="정렬 순서" name="sortOrder">
                      <InputNumber
                        min={1}
                        max={999}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <label className="sb-form-label">계층 미리보기</label>
                <div className="hier-preview">
                  {hierNodes.map((n, i) => (
                    <React.Fragment key={i}>
                      <span className="hier-node">{n}</span>
                      <RightOutlined className="hier-sep" />
                    </React.Fragment>
                  ))}
                  {deptName ? (
                    <span className="hier-node hier-node--new">{deptName}</span>
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
                    options={(employees || []).map((e) => ({
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
                      <span className="sb-avatar">{leaderName.charAt(0)}</span>
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

        <div className="d-flex gap-2 justify-content-end">
          <Link href={backUrl}>
            <Button>취소</Button>
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckOutlined />}
            loading={submitting && loading}
          >
            등록하기
          </Button>
        </div>
      </Form>
    </div>
  );
}
