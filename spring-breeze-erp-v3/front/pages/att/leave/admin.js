// pages/att/leave/admin.js
//
// ┌────────────────────────────────────────────────────────────────┐
// │  이 페이지는 가장 복잡한 패턴이다.                              │
// │  앞의 4개 페이지에서 배운 것을 모두 조합한다:                    │
// │                                                                │
// │  1) 검색 조건(연도)을 payload로 전달                            │
// │  2) 3개의 쓰기 action (calculate, deduct, adjust)              │
// │  3) 2개의 모달 (차감, 조정) + 1개의 이력 모달                   │
// │  4) 2개의 서로 다른 reducer에서 데이터 사용                     │
// │     → state.leave (연차 데이터)                                │
// │     → 하나의 컴포넌트에서 여러 reducer 조합 가능                │
// │                                                                │
// │  [새로운 패턴]                                                  │
// │    - 하나의 success를 여러 쓰기 action이 공유                   │
// │      → calculateSuccess, deductSuccess, adjustSuccess 모두      │
// │        success=true를 세팅하므로, success 감시 useEffect에서     │
// │        어떤 작업이 성공했는지 구분하지 않고 동일하게 처리한다     │
// │      → 구분이 필요하면 별도 상태(lastAction 등)를 추가한다       │
// │                                                                │
// │    - 모달에서 다른 사원의 이력을 조회할 때                       │
// │      dispatch(fetchGrantHistoryRequest(empId))                  │
// │      → saga가 GET /api/att/leave/grant/{empId} 호출             │
// │      → grantHistory 상태에 저장                                │
// │      → 모달 닫을 때 clearLeaveDetail()로 정리                  │
// └────────────────────────────────────────────────────────────────┘

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card, Table, Tag, Button, Select, Space,
  Modal, InputNumber, Input, message,
} from "antd";
import {
  CalculatorOutlined,
  MinusCircleOutlined,
  ToolOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import moment from "moment";

import {
  fetchAllBalancesRequest,
  fetchGrantHistoryRequest,
  calculateRequest,
  deductRequest,
  adjustRequest,
  resetLeaveState,
  clearLeaveDetail,
} from "../../../reducers/att/leaveBalanceReducer";

// ── 부여 유형별 Tag 색상 ──
const GRANT_TYPE_COLOR = {
  REG: "blue",
  CAR: "cyan",
  ADJ: "orange",
  USE: "red",
};

export default function LeaveAdminPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation(["att", "common"]);

  // ── 2개 state에서 데이터를 가져온다 ──
  //
  // useSelector를 2번 호출해도 되고, 1번에 객체로 묶어도 된다.
  // 여기서는 가독성을 위해 1번으로 묶었다.
  //
  // [주의] 이렇게 객체를 반환하면 매 렌더링마다 새 객체가 만들어져서
  //        불필요한 리렌더링이 발생할 수 있다.
  //        성능 최적화가 필요하면 shallowEqual을 사용하거나
  //        useSelector를 필드별로 분리한다.
  //        지금은 학습 단계이므로 간단한 방식을 사용한다.
  //
  const { allBalances, grantHistory, loading, success } =
    useSelector((state) => state.leave);

  // ── 로컬 상태: 검색 조건 ──
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  // ── 로컬 상태: 차감 모달 ──
  const [deductTarget, setDeductTarget] = useState(null);   // 대상 사원 정보
  const [deductHalfType, setDeductHalfType] = useState(null); // null=연차, "AM", "PM"
  const [deductReason, setDeductReason] = useState("");

  // ── 로컬 상태: 조정 모달 ──
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");

  // ── 로컬 상태: 이력 모달 ──
  const [historyTarget, setHistoryTarget] = useState(null);

  // ── 마운트 시: 해당 연도 전체 연차 조회 ──
  useEffect(() => {
    loadBalances();

    return () => {
      dispatch(resetLeaveState());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── success 감시 ──
  //
  // calculate, deduct, adjust 중 어떤 것이든 성공하면
  // success=true → 메시지 표시 → 목록 새로고침 → 모달 닫기
  //
  useEffect(() => {
    if (success) {
      // 어떤 모달이 열려있는지에 따라 메시지를 구분
      if (deductTarget) {
        message.success(t("att:msg.deductSuccess"));
        setDeductTarget(null);
      } else if (adjustTarget) {
        message.success(t("att:msg.adjustSuccess"));
        setAdjustTarget(null);
      } else {
        message.success(t("att:msg.calculateSuccess"));
      }
      loadBalances(); // 목록 새로고침
      dispatch(resetLeaveState());
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBalances = () => {
    // payload 형태: { year: 2026 }
    // → leaveBalanceSaga의 fetchAllBalances에서
    //   action.payload.year 로 꺼내 쓴다
    dispatch(fetchAllBalancesRequest({ year: selectedYear }));
  };

  // ── 연차 발생 ──
  const handleCalculate = (record) => {
    Modal.confirm({
      title: t("att:leaveAdmin.confirmCalculate"),
      onOk: () => {
        // payload: { empId, year }
        dispatch(calculateRequest({
          empId: record.empId,
          year: selectedYear,
        }));
      },
    });
  };

  // ── 차감 모달 열기 ──
  const openDeductModal = (record) => {
    setDeductTarget(record);
    setDeductHalfType(null);
    setDeductReason("");
  };

  // ── 차감 실행 ──
  const handleDeduct = () => {
    if (!deductTarget) return;
    // payload가 그대로 @RequestBody LeaveGrantRequest로 전송된다
    // saga의 deductApi에서 api.post(LEAVE_API + "/deduct", data) 호출
    dispatch(deductRequest({
      empId: deductTarget.empId,
      amount: deductHalfType ? 0.5 : 1,
      halfType: deductHalfType,
      reason: deductReason,
      year: selectedYear,
    }));
  };

  // ── 조정 모달 열기 ──
  const openAdjustModal = (record) => {
    setAdjustTarget(record);
    setAdjustAmount(0);
    setAdjustReason("");
  };

  // ── 조정 실행 ──
  const handleAdjust = () => {
    if (!adjustTarget || adjustAmount === 0) return;
    dispatch(adjustRequest({
      empId: adjustTarget.empId,
      amount: adjustAmount,
      reason: adjustReason,
      year: selectedYear,
    }));
  };

  // ── 이력 모달 열기 ──
  //
  // [새로운 패턴: 모달 열 때 별도 API 호출]
  //   모달을 열면서 동시에 해당 사원의 이력을 조회한다.
  //   이 데이터는 grantHistory 상태에 저장되고,
  //   모달을 닫을 때 clearLeaveDetail()로 정리한다.
  //
  const openHistoryModal = (record) => {
    setHistoryTarget(record);
    // 이 dispatch로 saga가 GET /api/att/leave/grant/{empId} 호출
    dispatch(fetchGrantHistoryRequest(record.empId));
  };

  // ── 이력 모달용 columns ──
  const historyColumns = [
    {
      title: t("att:leaveAdmin.historyModal.table.grantDays"),
      dataIndex: "grantDays",
      key: "grantDays",
      width: 80,
      align: "center",
      render: (v) => {
        // 양수(부여)는 파란색, 음수(차감)는 빨간색
        const color = v > 0 ? "blue" : "red";
        return <Tag color={color}>{v > 0 ? `+${v}` : v}</Tag>;
      },
    },
    {
      title: t("att:leaveAdmin.historyModal.table.grantType"),
      dataIndex: "grantType",
      key: "grantType",
      width: 100,
      render: (v) => (
        <Tag color={GRANT_TYPE_COLOR[v] || "default"}>
          {t(`att:leaveAdmin.historyModal.grantType.${v}`, v)}
        </Tag>
      ),
    },
    {
      title: t("att:leaveAdmin.historyModal.table.grantedAt"),
      dataIndex: "grantedAt",
      key: "grantedAt",
      width: 160,
      render: (v) => (v ? moment(v).format("YYYY-MM-DD HH:mm") : "—"),
    },
    {
      title: t("att:leaveAdmin.historyModal.table.reason"),
      dataIndex: "reason",
      key: "reason",
      render: (v) => v || "—",
    },
  ];

  // ── 메인 테이블 columns ──
  const columns = [
    {
      title: t("att:leaveAdmin.table.empNo"),
      dataIndex: "empNo",
      key: "empNo",
      width: 100,
    },
    {
      title: t("att:leaveAdmin.table.empName"),
      dataIndex: "empName",
      key: "empName",
      width: 100,
    },
    {
      title: t("att:leaveAdmin.table.totalDays"),
      dataIndex: "totalDays",
      key: "totalDays",
      width: 100,
      align: "center",
      render: (v) => (v != null ? v : "—"),
    },
    {
      title: t("att:leaveAdmin.table.usedDays"),
      dataIndex: "usedDays",
      key: "usedDays",
      width: 100,
      align: "center",
      render: (v) => (v != null ? v : "—"),
    },
    {
      title: t("att:leaveAdmin.table.remainingDays"),
      dataIndex: "remainingDays",
      key: "remainingDays",
      width: 100,
      align: "center",
      render: (v) => {
        if (v == null) return "—";
        const color = v <= 3 ? "red" : "green";
        return <Tag color={color}>{v}</Tag>;
      },
    },
    {
      title: t("att:leaveAdmin.table.action"),
      key: "action",
      width: 280,
      // ── 한 행에 버튼 4개 ──
      //
      // 각 버튼이 서로 다른 action을 trigger한다:
      //   연차 발생 → calculateRequest → POST /calculate/{empId}
      //   차감     → deductRequest    → POST /deduct (모달 거침)
      //   조정     → adjustRequest    → POST /adjust (모달 거침)
      //   이력     → fetchGrantHistoryRequest → GET /grant/{empId} (모달)
      //
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<CalculatorOutlined />}
            onClick={() => handleCalculate(record)}
          >
            {t("att:leaveAdmin.btnCalculate")}
          </Button>
          <Button
            size="small"
            icon={<MinusCircleOutlined />}
            onClick={() => openDeductModal(record)}
          >
            {t("att:leaveAdmin.btnDeduct")}
          </Button>
          <Button
            size="small"
            icon={<ToolOutlined />}
            onClick={() => openAdjustModal(record)}
          >
            {t("att:leaveAdmin.btnAdjust")}
          </Button>
          <Button
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => openHistoryModal(record)}
          >
            {t("att:leaveAdmin.btnHistory")}
          </Button>
        </Space>
      ),
    },
  ];

  // ── 연도 선택 옵션 생성 ──
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 2; y <= currentYear + 1; y++) {
    yearOptions.push(y);
  }

  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            {t("common:breadcrumbRoot")} &gt; {t("att:breadcrumb")} &gt; {t("att:leaveAdmin.breadcrumb")}
          </div>
          <h1>{t("att:leaveAdmin.title")}</h1>
          <p>{t("att:leaveAdmin.subtitle")}</p>
        </div>
      </div>

      {/* ── 연도 선택 + 검색 ── */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>{t("att:leaveAdmin.yearSelect")}:</span>
          <Select
            value={selectedYear}
            onChange={(v) => setSelectedYear(v)}
            style={{ width: 120 }}
          >
            {yearOptions.map((y) => (
              <Select.Option key={y} value={y}>
                {y}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={loadBalances} loading={loading}>
            {t("att:admin.search.btnSearch")}
          </Button>
        </Space>
      </Card>

      {/* ── 메인 테이블 ── */}
      <Card>
        <Table
          rowKey="balanceId"
          columns={columns}
          dataSource={allBalances}
          loading={loading}
          pagination={{ pageSize: 20 }}
          locale={{ emptyText: t("att:leaveAdmin.emptyMsg") }}
        />
      </Card>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  차감 모달                                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Modal
        title={t("att:leaveAdmin.deductModal.title")}
        visible={!!deductTarget}
        onCancel={() => setDeductTarget(null)}
        onOk={handleDeduct}
        okText={t("att:leaveAdmin.deductModal.btnDeduct")}
        confirmLoading={loading}
      >
        {deductTarget && (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div>
              <label>{t("att:leaveAdmin.deductModal.halfType")}</label>
              <Select
                value={deductHalfType}
                onChange={setDeductHalfType}
                style={{ width: "100%", marginTop: 4 }}
                allowClear
                placeholder={t("att:leaveAdmin.deductModal.fullDay")}
              >
                <Select.Option value="AM">
                  {t("att:leaveAdmin.deductModal.halfAM")}
                </Select.Option>
                <Select.Option value="PM">
                  {t("att:leaveAdmin.deductModal.halfPM")}
                </Select.Option>
              </Select>
            </div>
            <div>
              <label>{t("att:leaveAdmin.deductModal.reason")}</label>
              <Input
                value={deductReason}
                onChange={(e) => setDeductReason(e.target.value)}
                style={{ marginTop: 4 }}
              />
            </div>
          </Space>
        )}
      </Modal>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  조정 모달                                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Modal
        title={t("att:leaveAdmin.adjustModal.title")}
        visible={!!adjustTarget}
        onCancel={() => setAdjustTarget(null)}
        onOk={handleAdjust}
        okText={t("att:leaveAdmin.adjustModal.btnAdjust")}
        confirmLoading={loading}
      >
        {adjustTarget && (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div>
              <label>{t("att:leaveAdmin.adjustModal.amount")}</label>
              <InputNumber
                value={adjustAmount}
                onChange={setAdjustAmount}
                step={0.5}
                style={{ width: "100%", marginTop: 4 }}
              />
              <small style={{ color: "#999" }}>
                {t("att:leaveAdmin.adjustModal.amountHint")}
              </small>
            </div>
            <div>
              <label>{t("att:leaveAdmin.adjustModal.reason")}</label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                style={{ marginTop: 4 }}
              />
            </div>
          </Space>
        )}
      </Modal>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  이력 모달                                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      {/*
        이 모달은 조회 전용이라 onOk 대신 footer에 닫기 버튼만 둔다.
        모달을 닫을 때 clearLeaveDetail()로 grantHistory를 비운다.
        → 안 비우면 다른 사원의 이력을 열었을 때 이전 데이터가 잠깐 보인다.
      */}
      <Modal
        title={
          historyTarget
            ? `${historyTarget.empName} — ${t("att:leaveAdmin.historyModal.title")}`
            : t("att:leaveAdmin.historyModal.title")
        }
        visible={!!historyTarget}
        onCancel={() => {
          setHistoryTarget(null);
          dispatch(clearLeaveDetail());
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setHistoryTarget(null);
              dispatch(clearLeaveDetail());
            }}
          >
            {t("att:admin.editModal.btnCancel")}
          </Button>,
        ]}
        width={700}
      >
        <Table
          rowKey="grantId"
          columns={historyColumns}
          dataSource={grantHistory}
          loading={loading}
          pagination={false}
          size="small"
          locale={{ emptyText: t("att:leaveAdmin.historyModal.emptyMsg") }}
        />
      </Modal>
    </div>
  );
}
