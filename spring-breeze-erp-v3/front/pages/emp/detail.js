// pages/emp/detail.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Row, Col, Card, Button, Tag, Avatar, Descriptions, Modal, Form, Input, message, } from "antd";
import { ArrowLeftOutlined, EditOutlined, KeyOutlined, SafetyCertificateOutlined, } from "@ant-design/icons";

import {
  detailEmpRequest, updatePasswordRequest, resetPasswordRequest,
  resetEmpState,
} from "../../reducers/emp/empReducer";

const STATUS_TAG = { 재직: "green", 휴직: "orange", 퇴직: "red" };
const SENTIMENT = {
  POSITIVE: { color: "green", label: "긍정적" },
  NEUTRAL: { color: "default", label: "중립적" },
  NEGATIVE: { color: "red", label: "부정적" },
};

export default function EmpDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { empId } = router.query;
  const [passForm] = Form.useForm();

  const { currentEmp, latestReport, loading, passwordSuccess, error } =
    useSelector((state) => state.emp);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isSelf = user?.empId === Number(empId);

  // 비밀번호 모달
  const [passModal, setPassModal] = useState(null); // "change" | "reset" | null
  const [passSaving, setPassSaving] = useState(false);

  // ─── 데이터 로드 ───
  useEffect(() => {
    if (!empId) return;
    dispatch(detailEmpRequest(Number(empId)));
    return () => { dispatch(resetEmpState()); };
  }, [dispatch, empId]);

  // ─── 비밀번호 결과 처리 ───
  useEffect(() => {
    if (!passSaving) return;
    if (passwordSuccess) {
      message.success(
        passModal === "change"
          ? "비밀번호가 변경되었습니다."
          : "비밀번호가 초기화되었습니다."
      );
      setPassModal(null);
      setPassSaving(false);
      passForm.resetFields();
      dispatch(resetEmpState());
    } else if (error) {
      message.error(error);
      setPassSaving(false);
      dispatch(resetEmpState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordSuccess, error]);

  // ─── 비밀번호 변경 ───
  const handleChangePassword = async () => {
    try {
      const values = await passForm.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        message.warning("새 비밀번호가 일치하지 않습니다.");
        return;
      }
      setPassSaving(true);
      dispatch(
        updatePasswordRequest({
          empId: Number(empId),
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      );
    } catch (e) {}
  };

  // ─── 비밀번호 초기화 ───
  const handleResetPassword = () => {
    setPassSaving(true);
    dispatch(resetPasswordRequest(Number(empId)));
  };

  const emp = currentEmp;

  //////
  return (
    <div className="sb-page">
      {/* 페이지 헤더 */}
      <div
        className="sb-page-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            조직 관리 &gt; 사원관리 &gt; 상세정보
          </div>
          <h1>{emp?.empName || "..."}</h1>
          {emp && (
            <p>
              {emp.deptName} · {emp.posName}
            </p>
          )}
        </div>
        <div className="sb-page-head__actions">
          <Link href="/emp/list">
            <Button icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
        </div>
      </div>

      {/* 프로필 + AI 리포트 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {/* 좌: 프로필 카드 */}
        <Col xs={24} lg={8}>
          <Card style={{ height: "100%" }} loading={loading && !emp}>
            {emp && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar size={64} style={{ marginBottom: 8 }}>
                    {emp.empName?.charAt(0)}
                  </Avatar>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "4px 0" }}>
                    {emp.empName}
                  </h3>
                  <p style={{ color: "#999" }}>
                    {emp.deptName} · {emp.posName}
                  </p>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Tag>{emp.empNo}</Tag>
                    <Tag color={STATUS_TAG[emp.empStatus]}>{emp.empStatus}</Tag>
                  </div>
                </div>

                <hr style={{ margin: "16px 0", borderColor: "#f0f0f0" }} />

                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ color: "#999", fontSize: 12 }}>이메일</div>
                    <div style={{ fontSize: 13, wordBreak: "break-all" }}>
                      {emp.empEmail}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ color: "#999", fontSize: 12 }}>연락처</div>
                    <div style={{ fontSize: 13 }}>{emp.empMobile}</div>
                  </Col>
                  <Col span={8}>
                    <div style={{ color: "#999", fontSize: 12 }}>입사일</div>
                    <div style={{ fontSize: 13 }}>{emp.hireDate}</div>
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Col>

        {/* 우: AI 리포트 */}
        <Col xs={24} lg={16}>
          <Card style={{ height: "100%" }}>
            {latestReport ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>최근 AI 리포트</span>
                  {isAdmin && (
                    <Link
                      href={{
                        pathname: "/eval/report/detail",
                        query: { reportId: latestReport.reportId },
                      }}
                    >
                      <Button size="small">상세 보기</Button>
                    </Link>
                  )}
                </div>
                <Row gutter={16}>
                  <Col span={8} style={{ textAlign: "center" }}>
                    <div style={{ color: "#999", marginBottom: 4 }}>종합 등급</div>
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color:
                          latestReport.grade === "A"
                            ? "#52c41a"
                            : latestReport.grade === "B"
                              ? "#1890ff"
                              : "#fa8c16",
                      }}
                    >
                      {latestReport.grade}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <div style={{ color: "#999", fontSize: 12 }}>종합 점수</div>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>
                        {latestReport.overallScore?.toFixed(2)}
                      </div>
                    </div>
                    {latestReport.sentimentLabel && (
                      <div style={{ marginTop: 8 }}>
                        <Tag color={SENTIMENT[latestReport.sentimentLabel]?.color}>
                          {SENTIMENT[latestReport.sentimentLabel]?.label}
                        </Tag>
                      </div>
                    )}
                  </Col>
                  <Col span={16}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ color: "#999", fontSize: 12 }}>평가 회차</div>
                      <div>
                        {latestReport.periodTitle}{" "}
                        <Tag>{latestReport.generatedAt}</Tag>
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#999", fontSize: 12 }}>요약</div>
                      <div style={{ whiteSpace: "pre-line" }}>
                        {latestReport.aiSummary || "요약문이 아직 생성되지 않았습니다."}
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#999",
                }}
              >
                <p style={{ fontSize: 28, opacity: 0.5 }}>📄</p>
                <p>아직 생성된 AI 리포트가 없습니다.</p>
                <p style={{ fontSize: 13 }}>
                  평가 회차가 마감되고 리포트가 생성되면 여기에 표시됩니다.
                </p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 상세 정보 */}
      {emp && (
        <Card style={{ marginBottom: 16 }} title="상세 정보">
          <Descriptions column={{ xs: 1, sm: 2, lg: 4 }}>
            <Descriptions.Item label="사번">{emp.empNo}</Descriptions.Item>
            <Descriptions.Item label="이름">{emp.empName}</Descriptions.Item>
            <Descriptions.Item label="부서">{emp.deptName}</Descriptions.Item>
            <Descriptions.Item label="직급">{emp.posName}</Descriptions.Item>
            <Descriptions.Item label="이메일">{emp.empEmail}</Descriptions.Item>
            <Descriptions.Item label="연락처">{emp.empMobile}</Descriptions.Item>
            <Descriptions.Item label="입사일">{emp.hireDate}</Descriptions.Item>
            <Descriptions.Item label="재직상태">
              <Tag color={STATUS_TAG[emp.empStatus]}>{emp.empStatus}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="등록일">{emp.createdAt}</Descriptions.Item>
            <Descriptions.Item label="최근 수정일">
              {emp.updatedAt}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* 하단 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        {isAdmin && (
          <>
            <Link
              href={{
                pathname: "/perm/empAuth",
                query: { empId },
              }}
            >
              <Button icon={<SafetyCertificateOutlined />}>권한 관리</Button>
            </Link>
            <Button
              icon={<KeyOutlined />}
              onClick={() => setPassModal("reset")}
            >
              비밀번호 초기화
            </Button>
          </>
        )}
        {isSelf && (
          <Button
            icon={<KeyOutlined />}
            onClick={() => {
              setPassModal("change");
              passForm.resetFields();
            }}
          >
            비밀번호 수정
          </Button>
        )}
        <Link
          href={{ pathname: "/emp/edit", query: { empId } }}
        >
          <Button type="primary" icon={<EditOutlined />}>
            정보 수정
          </Button>
        </Link>
      </div>

      {/* ── 비밀번호 변경 모달 (본인) ── */}
      <Modal
        title="비밀번호 수정"
        open={passModal === "change"}
        onCancel={() => setPassModal(null)}
        onOk={handleChangePassword}
        okText="변경"
        okButtonProps={{ loading: passSaving }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={passForm} layout="vertical">
          <Form.Item
            name="currentPassword"
            label="현재 비밀번호"
            rules={[{ required: true, message: "현재 비밀번호를 입력하세요." }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="새 비밀번호"
            rules={[{ required: true, message: "새 비밀번호를 입력하세요." }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="새 비밀번호 확인"
            rules={[{ required: true, message: "비밀번호를 다시 입력하세요." }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── 비밀번호 초기화 모달 (관리자) ── */}
      <Modal
        title="비밀번호 초기화"
        open={passModal === "reset"}
        onCancel={() => setPassModal(null)}
        onOk={handleResetPassword}
        okText="초기화"
        okButtonProps={{ danger: true, loading: passSaving }}
        cancelText="취소"
        destroyOnClose
      >
        <p>
          <b>{emp?.empName}</b> 사원의 비밀번호를 초기화하시겠습니까?
        </p>
        <p style={{ color: "#999", fontSize: 13 }}>
          비밀번호가 기본값으로 재설정됩니다.
        </p>
      </Modal>
    </div>
  );
}
