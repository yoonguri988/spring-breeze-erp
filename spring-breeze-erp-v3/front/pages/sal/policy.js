// pages/sal/policy/list.js
// 급여 계산 정책 관리 - 4대보험요율(ROOT) / 소득세구간표(ROOT) / 식대정책(ROLE_ADMIN) / 직책수당정책(ROLE_ADMIN)
// 4개 컨트롤러 모두 "등록 + 전체조회"만 있는 단순 정책 카탈로그라서 탭 하나의 화면으로 묶었다.
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Tabs,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Input,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  fetchRatePolicyRequest,
  createRatePolicyRequest,
  fetchTaxBracketRequest,
  createTaxBracketRequest,
  fetchMealPolicyRequest,
  createMealPolicyRequest,
  fetchPosAllowanceRequest,
  createPosAllowanceRequest,
  resetSalPolicyState,
} from "../../reducers/sal/salPolicyReducer";
import { formatWon, wonFormatter, wonParser } from "../../utils/currency";

const { TabPane } = Tabs;

function EffPeriodCell({ effFrom, effTo }) {
  return (
    <span>
      {effFrom} ~ {effTo || <Tag color="green">적용중</Tag>}
    </span>
  );
}

export default function SalPolicyListPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isRoot = Boolean(user?.roles?.includes("ROOT"));
  const isAdmin = Boolean(user?.roles?.includes("ROLE_ADMIN"));

  const {
    rateList,
    rateLoading,
    taxBracketList,
    taxBracketLoading,
    mealPolicyList,
    mealPolicyLoading,
    posAllowanceList,
    posAllowanceLoading,
    saving,
    success,
    error,
  } = useSelector((state) => state.salPolicy);

  const [activeTab, setActiveTab] = useState(null);
  const [modalType, setModalType] = useState(null); // "rate" | "tax" | "meal" | "pos"
  const [form] = Form.useForm();

  useEffect(() => {
    if (isRoot) {
      dispatch(fetchRatePolicyRequest());
      dispatch(fetchTaxBracketRequest());
    }
    if (isAdmin) {
      dispatch(fetchMealPolicyRequest());
      dispatch(fetchPosAllowanceRequest());
    }
    if (!activeTab) setActiveTab(isRoot ? "rate" : "meal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isRoot, isAdmin]);

  useEffect(() => {
    if (saving) return;
    if (success) {
      message.success("정책이 등록되었습니다.");
      closeModal();
      if (modalType === "rate") dispatch(fetchRatePolicyRequest());
      if (modalType === "tax") dispatch(fetchTaxBracketRequest());
      if (modalType === "meal") dispatch(fetchMealPolicyRequest());
      if (modalType === "pos") dispatch(fetchPosAllowanceRequest());
      dispatch(resetSalPolicyState());
    } else if (error) {
      message.error(error);
      dispatch(resetSalPolicyState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving, success, error]);

  const openModal = (type) => {
    setModalType(type);
    form.resetFields();
    if (type === "pos") form.setFieldsValue({ comId: user?.comId });
  };
  const closeModal = () => {
    setModalType(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === "rate") {
        dispatch(
          createRatePolicyRequest({
            plcyYear: values.plcyYear,
            pensRate: values.pensRate,
            hlthRate: values.hlthRate,
            careRate: values.careRate,
            emplRate: values.emplRate,
            effFrom: values.effFrom.format("YYYY-MM-DD"),
          }),
        );
      } else if (modalType === "tax") {
        dispatch(
          createTaxBracketRequest({
            minAmt: values.minAmt,
            maxAmt: values.maxAmt ?? null,
            taxRate: values.taxRate,
            effFrom: values.effFrom.format("YYYY-MM-DD"),
          }),
        );
      } else if (modalType === "meal") {
        dispatch(
          createMealPolicyRequest({
            amt: values.amt,
            effFrom: values.effFrom.format("YYYY-MM-DD"),
          }),
        );
      } else if (modalType === "pos") {
        dispatch(
          createPosAllowanceRequest({
            pos: values.pos,
            comId: values.comId,
            amt: values.amt,
            effFrom: values.effFrom.format("YYYY-MM-DD"),
          }),
        );
      }
    } catch (e) {
      // 폼 검증 실패
    }
  };

  const rateColumns = [
    { title: "적용연도", dataIndex: "plcyYear", key: "plcyYear", width: 90 },
    {
      title: "국민연금",
      dataIndex: "pensRate",
      key: "pensRate",
      align: "right",
    },
    {
      title: "건강보험",
      dataIndex: "hlthRate",
      key: "hlthRate",
      align: "right",
    },
    {
      title: "장기요양보험료",
      dataIndex: "careRate",
      key: "careRate",
      align: "right",
    },
    {
      title: "고용보험",
      dataIndex: "emplRate",
      key: "emplRate",
      align: "right",
    },
    {
      title: "적용기간",
      key: "period",
      render: (_, r) => <EffPeriodCell {...r} />,
    },
  ];

  const taxColumns = [
    {
      title: "구간하한",
      dataIndex: "minAmt",
      key: "minAmt",
      align: "right",
      render: formatWon,
    },
    {
      title: "구간상한",
      dataIndex: "maxAmt",
      key: "maxAmt",
      align: "right",
      render: (v) =>
        v === null || v === undefined ? "상한없음" : formatWon(v),
    },
    { title: "세율", dataIndex: "taxRate", key: "taxRate", align: "right" },
    {
      title: "적용기간",
      key: "period",
      render: (_, r) => <EffPeriodCell {...r} />,
    },
  ];

  const mealColumns = [
    {
      title: "적용범위",
      dataIndex: "comId",
      key: "comId",
      width: 120,
      render: (v) => (v ? `회사 #${v}` : <Tag color="blue">전사공통</Tag>),
    },
    {
      title: "식대",
      dataIndex: "amt",
      key: "amt",
      align: "right",
      render: formatWon,
    },
    {
      title: "적용기간",
      key: "period",
      render: (_, r) => <EffPeriodCell {...r} />,
    },
  ];

  const posColumns = [
    { title: "직급코드", dataIndex: "pos", key: "pos", width: 120 },
    {
      title: "회사",
      dataIndex: "comId",
      key: "comId",
      width: 100,
      render: (v) => `#${v}`,
    },
    {
      title: "지급액",
      dataIndex: "amt",
      key: "amt",
      align: "right",
      render: formatWon,
    },
    {
      title: "적용기간",
      key: "period",
      render: (_, r) => <EffPeriodCell {...r} />,
    },
  ];

  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">급여관리 &gt; 계산정책</div>
          <h1>급여 계산 정책 관리</h1>
          <p>
            급여 자동 산정에 사용되는 4대보험 요율, 소득세 구간표, 식대·직책수당
            정책을 관리합니다.
          </p>
        </div>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {isRoot && (
            <TabPane tab="4대보험 요율정책" key="rate">
              <div
                style={{
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openModal("rate")}
                >
                  요율정책 등록
                </Button>
              </div>
              <Table
                rowKey="rateId"
                columns={rateColumns}
                dataSource={rateList}
                loading={rateLoading}
                pagination={false}
                size="small"
                locale={{ emptyText: "등록된 요율정책이 없습니다." }}
              />
            </TabPane>
          )}
          {isRoot && (
            <TabPane tab="소득세 간이구간표" key="tax">
              <div
                style={{
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openModal("tax")}
                >
                  구간 등록
                </Button>
              </div>
              <p style={{ color: "#999", fontSize: 13 }}>
                부양가족 수 미반영, 기본급 구간별 단순 정률 근사치 구간표입니다.
              </p>
              <Table
                rowKey="brktId"
                columns={taxColumns}
                dataSource={taxBracketList}
                loading={taxBracketLoading}
                pagination={false}
                size="small"
                locale={{ emptyText: "등록된 구간표가 없습니다." }}
              />
            </TabPane>
          )}
          {isAdmin && (
            <TabPane tab="식대 정책" key="meal">
              <div
                style={{
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openModal("meal")}
                >
                  식대정책 등록
                </Button>
              </div>
              <Table
                rowKey="mealPlcyId"
                columns={mealColumns}
                dataSource={mealPolicyList}
                loading={mealPolicyLoading}
                pagination={false}
                size="small"
                locale={{ emptyText: "등록된 식대정책이 없습니다." }}
              />
            </TabPane>
          )}
          {isAdmin && (
            <TabPane tab="직책수당 정책" key="pos">
              <div
                style={{
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openModal("pos")}
                >
                  직책수당 등록
                </Button>
              </div>
              <Table
                rowKey="alwId"
                columns={posColumns}
                dataSource={posAllowanceList}
                loading={posAllowanceLoading}
                pagination={false}
                size="small"
                locale={{ emptyText: "등록된 직책수당 정책이 없습니다." }}
              />
            </TabPane>
          )}
        </Tabs>
      </Card>

      <Modal
        title={
          modalType === "rate"
            ? "4대보험 요율정책 등록"
            : modalType === "tax"
              ? "소득세 구간 등록"
              : modalType === "meal"
                ? "식대정책 등록"
                : "직책수당 정책 등록"
        }
        open={!!modalType}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText="등록"
        okButtonProps={{ loading: saving }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {modalType === "rate" && (
            <>
              <Form.Item
                name="plcyYear"
                label="적용연도"
                rules={[
                  { required: true, message: "적용연도를 입력해 주세요." },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={2000}
                  max={2100}
                  placeholder="예: 2026"
                />
              </Form.Item>
              <Form.Item
                name="pensRate"
                label="국민연금 요율"
                rules={[{ required: true, message: "요율을 입력해 주세요." }]}
                extra="소수(예: 4.5% -> 0.045)로 입력"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={1}
                  step={0.001}
                />
              </Form.Item>
              <Form.Item
                name="hlthRate"
                label="건강보험 요율"
                rules={[{ required: true, message: "요율을 입력해 주세요." }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={1}
                  step={0.001}
                />
              </Form.Item>
              <Form.Item
                name="careRate"
                label="장기요양보험료율"
                rules={[{ required: true, message: "요율을 입력해 주세요." }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={1}
                  step={0.0001}
                />
              </Form.Item>
              <Form.Item
                name="emplRate"
                label="고용보험 요율"
                rules={[{ required: true, message: "요율을 입력해 주세요." }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={1}
                  step={0.001}
                />
              </Form.Item>
              <Form.Item
                name="effFrom"
                label="적용시작일"
                rules={[
                  { required: true, message: "적용시작일을 선택해 주세요." },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
          {modalType === "tax" && (
            <>
              <Form.Item
                name="minAmt"
                label="구간 하한"
                rules={[
                  { required: true, message: "구간 하한을 입력해 주세요." },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={wonFormatter}
                  parser={wonParser}
                  addonAfter="원"
                />
              </Form.Item>
              <Form.Item
                name="maxAmt"
                label="구간 상한 (선택, 비워두면 최고구간)"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={wonFormatter}
                  parser={wonParser}
                  addonAfter="원"
                />
              </Form.Item>
              <Form.Item
                name="taxRate"
                label="세율"
                rules={[{ required: true, message: "세율을 입력해 주세요." }]}
                extra="소수(예: 6% -> 0.06)로 입력"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={1}
                  step={0.001}
                />
              </Form.Item>
              <Form.Item
                name="effFrom"
                label="적용시작일"
                rules={[
                  { required: true, message: "적용시작일을 선택해 주세요." },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
          {modalType === "meal" && (
            <>
              <p style={{ color: "#999", fontSize: 13 }}>
                회사 관리자가 등록하면 소속 회사 전용 정책으로 등록됩니다.
              </p>
              <Form.Item
                name="amt"
                label="월 식대"
                rules={[
                  { required: true, message: "식대 금액을 입력해 주세요." },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={wonFormatter}
                  parser={wonParser}
                  addonAfter="원"
                />
              </Form.Item>
              <Form.Item
                name="effFrom"
                label="적용시작일"
                rules={[
                  { required: true, message: "적용시작일을 선택해 주세요." },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
          {modalType === "pos" && (
            <>
              <Form.Item
                name="pos"
                label="직급코드"
                rules={[
                  { required: true, message: "직급코드를 입력해 주세요." },
                ]}
              >
                <Input placeholder="예: MANAGER" maxLength={30} />
              </Form.Item>
              <Form.Item
                name="comId"
                label="회사 ID"
                rules={[{ required: true, message: "회사 ID가 필요합니다." }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  disabled={!isRoot}
                />
              </Form.Item>
              <Form.Item
                name="amt"
                label="월 지급액"
                rules={[{ required: true, message: "지급액을 입력해 주세요." }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={wonFormatter}
                  parser={wonParser}
                  addonAfter="원"
                />
              </Form.Item>
              <Form.Item
                name="effFrom"
                label="적용시작일"
                rules={[
                  { required: true, message: "적용시작일을 선택해 주세요." },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
