// pages/com/add.js
// 원본: pages/com/form.html + pages/com/util/ocrModal.html
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  Modal,
  Card,
  Row,
  Col,
  Alert,
  Spin,
  message,
} from "antd";
import {
  TagOutlined,
  BankOutlined,
  PictureOutlined,
  ArrowLeftOutlined,
  CameraOutlined,
  CheckOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  CheckCircleFilled,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  addCompanyRequest,
  checkBizNoRequest,
  resetCompanyState,
} from "../../reducers/com/companyReducer";
import {
  verifyBizNoRequest,
  processOcrRequest,
  resetApiUtilState,
} from "../../reducers/api/apiUtilReducer";
import {
  GRP_OPTIONS,
  getCodeOptions,
  matchGrpFromText,
  matchCodeFromText,
} from "../../constants/industryCode";

const BIZNO_PATTERN = /^\d{3}-\d{2}-\d{5}$/;

export default function ComAddPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { loading, error, success, bizNoCheck } = useSelector(
    (state) => state.company,
  );
  const {
    loading: utilLoading,
    bizNoVerifyResult,
    ocrResult,
  } = useSelector((state) => state.apiUtil);

  const [industryGrpCode, setIndustryGrpCode] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 진위확인 스냅샷: 마지막으로 성공한 bizNo/startDt/ceoName. null이면 미확인/무효화 상태.
  const [verifiedSnapshot, setVerifiedSnapshot] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // OCR 모달
  const [ocrOpen, setOcrOpen] = useState(false);
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrLoadingLocal, setOcrLoadingLocal] = useState(false);
  const [ocrForm, setOcrForm] = useState(null); // { bizNo, comName, comCeo, startDt, industryGrpCode, industryCode, grpRaw, codeRaw }

  const codeOptions = useMemo(() => getCodeOptions(industryGrpCode), [industryGrpCode]);
  const ocrCodeOptions = useMemo(
    () => getCodeOptions(ocrForm?.industryGrpCode),
    [ocrForm?.industryGrpCode],
  );

  // 등록 성공/실패 처리
  useEffect(() => {
    if (!submitting || loading) return;
    if (success) {
      message.success("회사 등록에 성공하였습니다.");
      dispatch(resetCompanyState());
      setSubmitting(false);
      router.push("/com/list");
    } else if (error) {
      message.error(error);
      setSubmitting(false);
      dispatch(resetCompanyState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, submitting]);

  // 사업자번호 중복확인 결과 반영
  useEffect(() => {
    if (!bizNoCheck.checked) return;
    if (bizNoCheck.duplicate) {
      form.setFields([
        { name: "bizNo", errors: ["이미 사용 중인 사업자번호입니다."] },
      ]);
    } else {
      form.setFields([{ name: "bizNo", errors: [] }]);
    }
  }, [bizNoCheck]); // eslint-disable-line react-hooks/exhaustive-deps

  // 국세청 진위확인 결과 반영
  useEffect(() => {
    if (!verifying || utilLoading) return;
    setVerifying(false);
    const fields = form.getFieldsValue();
    const item = bizNoVerifyResult?.data?.[0];

    if (bizNoVerifyResult?.status_code === "OK" && item?.valid === "01") {
      setVerifiedSnapshot({
        bizNo: fields.bizNo,
        startDt: fields.startDt ? fields.startDt.format("YYYY-MM-DD") : "",
        ceoName: fields.comCeo,
      });
      message.success("국세청에 등록된 사업자 정보와 일치합니다.");
    } else {
      setVerifiedSnapshot(null);
      message.error(item?.valid_msg || "입력하신 정보와 일치하는 사업자를 찾을 수 없습니다.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilLoading, verifying, bizNoVerifyResult]);

  // OCR 결과 반영
  useEffect(() => {
    // 요청이 아직 진행중(utilLoading)이면 대기 - ocrResult가 아직 초기화(null)된
    // 상태에서 effect가 먼저 실행되어 "실패"로 오판하는 것을 방지
    if (!ocrLoadingLocal || utilLoading) return;
    setOcrLoadingLocal(false);
    if (!ocrResult) {
      message.warning("OCR 인식에 실패했습니다.");
      return;
    }
    const grpCode = matchGrpFromText(ocrResult.industryGrpText);
    const detailCode = matchCodeFromText(grpCode, ocrResult.industryCodeText);
    setOcrForm({
      bizNo: ocrResult.bizNo || "",
      comName: ocrResult.comName || "",
      comCeo: ocrResult.comCeo || "",
      startDt: ocrResult.startDt || "",
      industryGrpCode: grpCode,
      industryCode: detailCode,
      grpRaw: ocrResult.industryGrpText || "",
      codeRaw: ocrResult.industryCodeText || "",
    });
    message.success("사업자등록증 인식이 완료되었습니다. 내용을 확인해주세요.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocrLoadingLocal, utilLoading, ocrResult]);

  const isVerified = (fields) =>
    verifiedSnapshot !== null &&
    verifiedSnapshot.bizNo === fields.bizNo &&
    verifiedSnapshot.startDt ===
      (fields.startDt ? fields.startDt.format("YYYY-MM-DD") : "") &&
    verifiedSnapshot.ceoName === fields.comCeo;

  const handleBizFieldsChange = () => {
    // 진위확인 대상 필드가 바뀌면 스냅샷 무효화 (재확인 유도)
    if (verifiedSnapshot === null) return;
    const fields = form.getFieldsValue();
    if (!isVerified(fields)) setVerifiedSnapshot(null);
  };

  const handleBizNoBlur = () => {
    const bizNo = form.getFieldValue("bizNo");
    if (bizNo && BIZNO_PATTERN.test(bizNo)) {
      dispatch(checkBizNoRequest(bizNo));
    }
  };

  const handleVerifyBizNo = () => {
    const fields = form.getFieldsValue();
    if (!BIZNO_PATTERN.test(fields.bizNo || "")) {
      message.error("사업자등록번호 형식을 먼저 확인해주세요. (예: 123-45-67890)");
      return;
    }
    if (!fields.startDt) {
      message.error("개업일자를 입력해주세요.");
      return;
    }
    if (!fields.comCeo) {
      message.error("대표자명을 먼저 입력해주세요.");
      return;
    }
    setVerifying(true);
    dispatch(
      verifyBizNoRequest({
        bizNo: fields.bizNo,
        startDt: fields.startDt.format("YYYY-MM-DD"),
        ceoName: fields.comCeo,
      }),
    );
  };

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
    form.resetFields();
    setIndustryGrpCode("");
    setLogoFile(null);
    setLogoPreview("");
    setVerifiedSnapshot(null);
    dispatch(resetApiUtilState());
  };

  const handleOcrFileChange = (info) => {
    const file = info.file?.originFileObj || info.file;
    if (!file) return;
    setOcrFile(file);
    setOcrLoadingLocal(true);
    dispatch(processOcrRequest(file));
  };

  const applyOcrToForm = () => {
    if (!ocrForm) return;
    form.setFieldsValue({
      bizNo: ocrForm.bizNo,
      comName: ocrForm.comName,
      comCeo: ocrForm.comCeo,
      startDt: ocrForm.startDt ? moment(ocrForm.startDt, "YYYY-MM-DD") : null,
      industryGrpCode: ocrForm.industryGrpCode,
      industryCode: ocrForm.industryCode,
    });
    setIndustryGrpCode(ocrForm.industryGrpCode);
    setVerifiedSnapshot(null);
    setOcrOpen(false);
    setOcrForm(null);
    setOcrFile(null);
  };

  const closeOcrModal = () => {
    setOcrOpen(false);
    setOcrForm(null);
    setOcrFile(null);
    dispatch(resetApiUtilState());
  };

  const onFinish = (values) => {
    if (!isVerified(values)) {
      message.error("사업자등록번호 진위확인을 먼저 완료해주세요.");
      return;
    }
    const dto = {
      industryGrpCode: values.industryGrpCode,
      industryCode: values.industryCode,
      comName: values.comName,
      comCeo: values.comCeo,
      bizNo: values.bizNo,
      comTel: values.comTel,
    };
    setSubmitting(true);
    dispatch(addCompanyRequest({ dto, logoFile }));
  };

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
            <Link href="/com/list">회사 관리</Link> <span>&gt;</span> 등록
          </div>
          <h1>회사 등록</h1>
          <p>새로운 회사를 시스템에 등록합니다.</p>
        </div>
        <div className="sb-page-head__actions" style={{ display: "flex", gap: 8 }}>
          <Button icon={<CameraOutlined />} onClick={() => setOcrOpen(true)}>
            사업자등록증으로 자동입력
          </Button>
          <Link href="/com/list">
            <Button icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleBizFieldsChange}
        initialValues={{ industryGrpCode: "", industryCode: "" }}
      >
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
              <Form.Item
                label="사업자등록번호"
                name="bizNo"
                validateTrigger="onBlur"
                rules={[
                  {
                    pattern: BIZNO_PATTERN,
                    message: "사업자번호 형식이 올바르지 않습니다. (예: 123-45-67890)",
                  },
                  { required: true, message: "사업자등록번호는 필수입니다." },
                ]}
                extra="형식: 123-45-67890"
              >
                <Input placeholder="000-00-00000" maxLength={45} onBlur={handleBizNoBlur} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="대표 전화" name="comTel" extra="선택 입력">
                <Input placeholder="02-0000-0000" maxLength={100} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="개업일자"
                name="startDt"
                rules={[{ required: true, message: "개업일자는 필수입니다." }]}
                extra="진위확인 시에만 사용되며 DB에는 저장되지 않습니다."
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} style={{ display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", marginBottom: 24 }}>
                <Button
                  block
                  icon={<SafetyCertificateOutlined />}
                  onClick={handleVerifyBizNo}
                  loading={verifying && utilLoading}
                  danger={verifiedSnapshot === null && verifying === false && bizNoVerifyResult != null}
                >
                  국세청 진위확인
                </Button>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  {verifiedSnapshot ? (
                    <span style={{ color: "#389e0d" }}>
                      <CheckCircleFilled /> 국세청에 등록된 사업자 정보와 일치합니다.
                    </span>
                  ) : (
                    <span className="text-faint">
                      <InfoCircleOutlined /> 등록하려면 진위확인이 필요합니다.
                    </span>
                  )}
                </div>
              </div>
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
                정사각형 이미지 권장 · 미입력 시 기본 이미지 사용
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
          <Button type="primary" htmlType="submit" icon={<CheckOutlined />} loading={submitting && loading}>
            등록하기
          </Button>
        </div>
      </Form>

      {/* OCR 자동입력 모달 */}
      <Modal
        title={
          <span>
            <CameraOutlined /> 사업자등록증 자동입력
          </span>
        }
        open={ocrOpen}
        onCancel={closeOcrModal}
        width={720}
        footer={[
          <Button key="cancel" onClick={closeOcrModal}>
            취소
          </Button>,
          <Button
            key="apply"
            type="primary"
            icon={<CheckOutlined />}
            disabled={!ocrForm}
            onClick={applyOcrToForm}
          >
            폼에 적용
          </Button>,
        ]}
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>이미지 업로드 (JPG · PNG · PDF)</div>
          <Upload
            accept="image/*,.pdf"
            showUploadList={ocrFile ? [{ uid: "-1", name: ocrFile.name, status: "done" }] : false}
            fileList={ocrFile ? [{ uid: "-1", name: ocrFile.name, status: "done" }] : []}
            beforeUpload={() => false}
            onChange={handleOcrFileChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>파일 선택</Button>
          </Upload>
        </div>

        {ocrLoadingLocal && (
          <div style={{ marginBottom: 16 }}>
            <Spin size="small" /> 인식 중입니다...
          </div>
        )}

        {ocrForm && (
          <Row gutter={16}>
            <Col span={12}>
              <div className="sb-form-label">사업자등록번호</div>
              <Input
                value={ocrForm.bizNo}
                onChange={(e) => setOcrForm({ ...ocrForm, bizNo: e.target.value })}
                placeholder="000-00-00000"
              />
            </Col>
            <Col span={12}>
              <div className="sb-form-label">회사명</div>
              <Input
                value={ocrForm.comName}
                onChange={(e) => setOcrForm({ ...ocrForm, comName: e.target.value })}
              />
            </Col>
            <Col span={12} style={{ marginTop: 12 }}>
              <div className="sb-form-label">대표자</div>
              <Input
                value={ocrForm.comCeo}
                onChange={(e) => setOcrForm({ ...ocrForm, comCeo: e.target.value })}
              />
            </Col>
            <Col span={12} style={{ marginTop: 12 }}>
              <div className="sb-form-label">개업일자</div>
              <DatePicker
                style={{ width: "100%" }}
                value={ocrForm.startDt ? moment(ocrForm.startDt, "YYYY-MM-DD") : null}
                onChange={(d) =>
                  setOcrForm({ ...ocrForm, startDt: d ? d.format("YYYY-MM-DD") : "" })
                }
              />
            </Col>
            <Col span={24} style={{ marginTop: 12 }}>
              <div className="sb-form-label">
                업종 <span className="field-hint">(OCR 인식 텍스트로 자동 매칭 · 틀리면 직접 선택)</span>
              </div>
              <Select
                style={{ width: "100%" }}
                placeholder="-- 업종 선택 --"
                options={GRP_OPTIONS}
                value={ocrForm.industryGrpCode || undefined}
                onChange={(v) => setOcrForm({ ...ocrForm, industryGrpCode: v, industryCode: "" })}
              />
              {(ocrForm.grpRaw || ocrForm.codeRaw) && (
                <div className="field-hint mt-1" style={{ fontSize: 12, color: "#999" }}>
                  {ocrForm.grpRaw && (
                    <div>
                      업종 인식 원문: "{ocrForm.grpRaw}"
                      {!ocrForm.industryGrpCode && " (자동 매칭 실패 - 직접 선택해주세요)"}
                    </div>
                  )}
                  {ocrForm.codeRaw && (
                    <div>
                      세부업종 인식 원문: "{ocrForm.codeRaw}"
                      {!ocrForm.industryCode && " (자동 매칭 실패 - 직접 선택해주세요)"}
                    </div>
                  )}
                </div>
              )}
            </Col>
            <Col span={24} style={{ marginTop: 12 }}>
              <div className="sb-form-label">세부 업종</div>
              <Select
                style={{ width: "100%" }}
                placeholder="-- 업종을 먼저 선택하세요 --"
                disabled={!ocrForm.industryGrpCode}
                options={ocrCodeOptions}
                value={ocrForm.industryCode || undefined}
                onChange={(v) => setOcrForm({ ...ocrForm, industryCode: v })}
              />
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
}