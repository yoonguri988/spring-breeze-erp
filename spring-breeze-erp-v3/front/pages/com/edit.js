// pages/com/edit.js
// 원본: pages/com/edit.html
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Modal,
  Card,
  Row,
  Col,
  Alert,
  Tag,
  Spin,
  message,
} from "antd";
import {
  TagOutlined,
  BankOutlined,
  PictureOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
  LockOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

import {
  fetchCompanyDetailRequest,
  updateCompanyRequest,
  deleteCompanyRequest,
  resetCompanyState,
} from "../../reducers/com/companyReducer";
import { GRP_OPTIONS, getCodeOptions } from "../../constants/industryCode";
import resolveFileUrl from "../../constants/resolveFileUrl";

export default function ComEditPage() {
  const router = useRouter();
  const { comId } = router.query;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // companyReducer: detail = ComDetailResponse { com, deptStats, deptList }
  // update/delete는 loading/error/success/message를 공용으로 사용하므로
  // 화면에서는 어떤 액션을 기다리는 중인지(submitting/deleting)를 로컬 state로 구분한다.
  const { loading, error, success, message: apiMessage, detail } = useSelector(
    (state) => state.company,
  );
  const com = detail?.com;

  const [industryGrpCode, setIndustryGrpCode] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 삭제 확인 모달
  const [delOpen, setDelOpen] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [delPwError, setDelPwError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const codeOptions = useMemo(() => getCodeOptions(industryGrpCode), [industryGrpCode]);

  // 상세 조회
  useEffect(() => {
    if (!comId) return;
    dispatch(fetchCompanyDetailRequest(comId));
    return () => dispatch(resetCompanyState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comId]);

  // 조회된 값으로 폼 초기화
  useEffect(() => {
    if (!com) return;
    form.setFieldsValue({
      industryGrpCode: com.industryGrpCode || "",
      industryCode: com.industryCode || "",
      comName: com.comName || "",
      comCeo: com.comCeo || "",
      comTel: com.comTel || "",
    });
    setIndustryGrpCode(com.industryGrpCode || "");
    setLogoPreview(resolveFileUrl(com.comLogo));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [com]);

  // 수정 성공/실패 처리
  useEffect(() => {
    if (!submitting || loading) return;
    if (success) {
      message.success(apiMessage || "회사 정보가 수정되었습니다.");
      setSubmitting(false);
      dispatch(resetCompanyState());
      router.push("/com/list");
    } else if (error) {
      message.error(error);
      setSubmitting(false);
      dispatch(resetCompanyState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, submitting]);

  // 삭제 성공/실패 처리 (update와 loading/success/error를 공용으로 사용)
  useEffect(() => {
    if (!deleting || loading) return;
    if (success) {
      message.success(apiMessage || "회사가 삭제되었습니다.");
      setDeleting(false);
      setDelOpen(false);
      dispatch(resetCompanyState());
      router.push("/com/list");
    } else if (error) {
      setDeleting(false);
      setDelPwError(error || "비밀번호가 올바르지 않습니다.");
      dispatch(resetCompanyState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, deleting]);

  const handleLogoChange = (info) => {
    const file = info.file?.originFileObj || info.file;
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      message.error("파일 크기는 2MB 이하여야 합니다.");
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    if (!com) return;
    form.setFieldsValue({
      industryGrpCode: com.industryGrpCode || "",
      industryCode: com.industryCode || "",
      comName: com.comName || "",
      comCeo: com.comCeo || "",
      comTel: com.comTel || "",
    });
    setIndustryGrpCode(com.industryGrpCode || "");
    setLogoFile(null);
    setLogoPreview(resolveFileUrl(com.comLogo));
  };

  const onFinish = (values) => {
    const dto = {
      industryGrpCode: values.industryGrpCode,
      industryCode: values.industryCode,
      comName: values.comName,
      comCeo: values.comCeo,
      comTel: values.comTel,
      bizNo: com?.bizNo,
    };
    setSubmitting(true);
    dispatch(updateCompanyRequest({ comId, dto, logoFile }));
  };

  const openDeleteModal = () => {
    setAdminPw("");
    setDelPwError("");
    setDelOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDelOpen(false);
  };

  const handleDeleteConfirm = () => {
    // 관리자 비밀번호는 서버(DeleteCompanyRequest.password)에서 검증한다.
    if (!adminPw) {
      setDelPwError("관리자 비밀번호를 입력하세요.");
      return;
    }
    setDeleting(true);
    dispatch(deleteCompanyRequest({ comId, password: adminPw }));
  };

  if (!com && loading) {
    return (
      <div className="sb-page" style={{ textAlign: "center", padding: "80px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="sb-page">
      {/* 페이지 헤더 */}
      <div
        className="sb-page-head"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <span>&gt;</span>{" "}
            <Link href="/com/list">회사 관리</Link> <span>&gt;</span> 수정{" "}
            <Tag color="blue">관리자</Tag>
          </div>
          <h1>{com ? `${com.comName} · 수정` : "회사 수정"}</h1>
          <p>회사 정보를 수정합니다.</p>
        </div>
        <div className="sb-page-head__actions" style={{ display: "flex", gap: 8 }}>
          <Button danger icon={<DeleteOutlined />} onClick={openDeleteModal}>
            삭제
          </Button>
          <Link href="/com/list">
            <Button icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
        </div>
      </div>

      {error && !submitting && (
        <Alert type="error" message={error} showIcon closable style={{ marginBottom: 16 }} />
      )}

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* PK: comId (수정 대상 식별, 화면에 노출하지 않고 dispatch 시 사용) */}

        {/* ① 업종 분류 */}
        <Card
          className="sb-card mb-3"
          title={
            <span>
              <TagOutlined className="me-2 text-soft" /> 업종 분류
            </span>
          }
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="업종"
                name="industryGrpCode"
                rules={[{ required: true, message: "업종을 선택하세요." }]}
              >
                <Select
                  placeholder="-- 업종 선택 --"
                  options={GRP_OPTIONS}
                  onChange={(v) => {
                    setIndustryGrpCode(v);
                    form.setFieldsValue({ industryCode: undefined });
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="세부 업종"
                name="industryCode"
                rules={[{ required: true, message: "세부 업종을 선택하세요." }]}
              >
                <Select
                  placeholder={
                    industryGrpCode ? "-- 세부업종 선택 --" : "-- 업종을 먼저 선택하세요 --"
                  }
                  disabled={!industryGrpCode}
                  options={codeOptions}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ② 기본 정보 */}
        <Card
          className="sb-card mb-3"
          title={
            <span>
              <BankOutlined className="me-2 text-soft" /> 기본 정보
            </span>
          }
          extra={com ? <Tag>COM-{String(com.comId).padStart(3, "0")}</Tag> : null}
        >
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                label="회사명"
                name="comName"
                rules={[{ required: true, message: "회사명은 필수입니다. (최대 100자)" }]}
              >
                <Input placeholder="예: (주)선빈테크놀로지" maxLength={100} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="대표자"
                name="comCeo"
                rules={[{ required: true, message: "대표자명은 필수입니다." }]}
              >
                <Input placeholder="대표자명" maxLength={100} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="사업자등록번호">
                <Input
                  value={com?.bizNo}
                  readOnly
                  prefix={<LockOutlined className="text-faint" />}
                  style={{ background: "#fafbfc", color: "rgba(0,0,0,0.45)" }}
                />
                <div className="text-faint mt-1" style={{ fontSize: 12 }}>
                  사업자번호는 수정할 수 없습니다.
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="대표 전화" name="comTel" extra="선택 입력">
                <Input placeholder="02-0000-0000" maxLength={100} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ③ 회사 로고 */}
        <Card
          className="sb-card mb-3"
          title={
            <span>
              <PictureOutlined className="me-2 text-soft" /> 회사 로고
            </span>
          }
          extra={<span className="sub">PNG · JPG · SVG · WEBP, 최대 2MB</span>}
        >
          <div className="logo-zone" style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              className="logo-preview"
              style={{
                width: 72,
                height: 72,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #eee",
                borderRadius: 8,
                overflow: "hidden",
                fontSize: 28,
              }}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="로고 미리보기"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <BankOutlined />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <Upload
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleLogoChange}
              >
                <Button icon={<UploadOutlined />}>로고 파일 선택</Button>
              </Upload>
              <div className="text-faint mt-1" style={{ fontSize: 12 }}>
                파일을 선택하지 않으면 기존 로고가 유지됩니다.
              </div>
            </div>
          </div>
        </Card>

        {/* 폼 버튼 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={handleReset}>초기화</Button>
          <Link href="/com/list">
            <Button>목록</Button>
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={submitting && loading}
          >
            저장
          </Button>
        </div>
      </Form>

      {/* 삭제 확인 모달 (관리자 비밀번호) */}
      <Modal
        title={
          <span style={{ color: "#cf1322" }}>
            <ExclamationCircleFilled /> 회사 삭제
          </span>
        }
        open={delOpen}
        onCancel={closeDeleteModal}
        destroyOnClose
        footer={[
          <Button key="cancel" onClick={closeDeleteModal} disabled={deleting}>
            취소
          </Button>,
          <Button
            key="confirm"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            loading={deleting && loading}
            onClick={handleDeleteConfirm}
          >
            삭제 확인
          </Button>,
        ]}
      >
        <div style={{ textAlign: "center", fontSize: 32, marginBottom: 8, color: "#cf1322" }}>
          <BankOutlined />
        </div>
        <div style={{ textAlign: "center", fontWeight: 600, marginBottom: 12 }}>
          {com?.comName}
        </div>
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="삭제 시 연결된 부서·사원 데이터에 영향을 줄 수 있습니다."
          description="계속하려면 관리자 비밀번호를 입력하세요."
        />
        <div className="sb-form-label">
          관리자 비밀번호 <span style={{ color: "#cf1322" }}>*</span>
        </div>
        <Input.Password
          placeholder="비밀번호 입력"
          autoComplete="new-password"
          value={adminPw}
          status={delPwError ? "error" : ""}
          onChange={(e) => {
            setAdminPw(e.target.value);
            setDelPwError("");
          }}
          onPressEnter={handleDeleteConfirm}
        />
        {delPwError && (
          <div style={{ color: "#cf1322", fontSize: 12.5, marginTop: 6 }}>
            <ExclamationCircleFilled /> {delPwError}
          </div>
        )}
      </Modal>
    </div>
  );
}