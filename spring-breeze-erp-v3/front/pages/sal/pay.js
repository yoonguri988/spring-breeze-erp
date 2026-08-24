// pages/sal/pay/list.js
// 급여지급 관리 (ROLE_ADMIN) - /api/salpay 전체 CRUD + 상태변경 + 항목조정
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card, Table, Button, Tag, Modal, Form, Input, InputNumber, DatePicker,
  Select, Pagination, message, Drawer, Descriptions, Divider,
} from "antd";
import {
  PlusOutlined, SearchOutlined, EyeOutlined, SyncOutlined,
  SwapOutlined, DeleteOutlined, EditOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  listSalPayRequest, createSalPayRequest, recalcSalPayRequest,
  adjustSalPayItemRequest, changeSalPayStatusRequest, deleteSalPayRequest,
  resetSalPayState, clearCurrentSalPay,
} from "../../reducers/sal/salPayReducer";
import EmployeePicker from "../../components/sal/EmployeePicker";
import { formatWon, wonFormatter, wonParser } from "../../utils/currency";

const STATUS_LABEL = {
  PENDING: { text: "대기", color: "gold" },
  APPROVED: { text: "승인", color: "blue" },
  PAID: { text: "지급완료", color: "green" },
  REJECTED: { text: "반려", color: "red" },
};

const NEXT_STATUS = {
  PENDING: ["APPROVED", "REJECTED"],
  APPROVED: ["PAID", "REJECTED"],
  PAID: [],
  REJECTED: [],
};

function StatusTag({ stat }) {
  const info = STATUS_LABEL[stat] || { text: stat, color: "default" };
  return <Tag color={info.color}>{info.text}</Tag>;
}

export default function SalPayListPage() {
  const dispatch = useDispatch();
  const [regForm] = Form.useForm();
  const [statusForm] = Form.useForm();
  const [recalcForm] = Form.useForm();
  const [adjustForm] = Form.useForm();

  const { payList, paging, current, loading, success, error } = useSelector((state) => state.salPay);

  const [filters, setFilters] = useState({ empName: "", department: "", paymentMonth: null, status: "" });
  const [page, setPage] = useState(1);

  const [regOpen, setRegOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [detailTarget, setDetailTarget] = useState(null); // list row 또는 current
  const [statusTarget, setStatusTarget] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);
  const [recalcTarget, setRecalcTarget] = useState(null);
  const [recalculating, setRecalculating] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState(null); // { payId, itemId, itemName, amt }
  const [adjusting, setAdjusting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const runSearch = (nextPage = 1) => {
    setPage(nextPage);
    dispatch(listSalPayRequest({
      empName: filters.empName,
      department: filters.department,
      paymentMonth: filters.paymentMonth ? filters.paymentMonth.startOf("month").format("YYYY-MM-DD") : undefined,
      status: filters.status || undefined,
      page: nextPage - 1,
      size: 10,
    }));
  };

  useEffect(() => {
    runSearch(1);
    return () => dispatch(resetSalPayState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // 상세 드로어가 열려있는 동안 목록이 갱신되면 최신 데이터로 동기화
  useEffect(() => {
    if (!detailTarget) return;
    const fresh = payList.find((p) => p.payId === detailTarget.payId);
    if (fresh) setDetailTarget(fresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payList]);

  useEffect(() => {
    if (!(registering || changingStatus || recalculating || adjusting || deleting) || loading) return;
    if (success) {
      if (registering) {
        message.success("급여가 산정되어 등록되었습니다.");
        setRegOpen(false);
        regForm.resetFields();
        setRegistering(false);
      }
      if (changingStatus) {
        message.success("급여 지급 상태가 변경되었습니다.");
        setStatusTarget(null);
        setChangingStatus(false);
        if (current) setDetailTarget(current);
      }
      if (recalculating) {
        message.success("급여가 재산정되었습니다.");
        setRecalcTarget(null);
        setRecalculating(false);
        if (current) setDetailTarget(current);
      }
      if (adjusting) {
        message.success("항목 금액이 조정되었습니다.");
        setAdjustTarget(null);
        setAdjusting(false);
        if (current) setDetailTarget(current);
      }
      if (deleting) {
        message.success("급여 지급 내역이 삭제(취소)되었습니다.");
        setDeleteTarget(null);
        setDeleting(false);
        setDetailTarget(null);
      }
      dispatch(resetSalPayState());
      dispatch(clearCurrentSalPay());
      runSearch(page);
    } else if (error) {
      message.error(error);
      setRegistering(false);
      setChangingStatus(false);
      setRecalculating(false);
      setAdjusting(false);
      setDeleting(false);
      dispatch(resetSalPayState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, dispatch]);

  const handleRegister = async () => {
    try {
      const values = await regForm.validateFields();
      if (!values.empId) {
        message.warning("사원을 선택해 주세요.");
        return;
      }
      setRegistering(true);
      dispatch(createSalPayRequest({
        empId: values.empId,
        payMonth: values.payMonth.startOf("month").format("YYYY-MM-DD"),
      }));
    } catch (e) {
      // 폼 검증 실패
    }
  };

  const openStatusModal = (record) => {
    setStatusTarget(record);
    statusForm.resetFields();
  };
  const handleChangeStatus = async () => {
    try {
      const values = await statusForm.validateFields();
      setChangingStatus(true);
      dispatch(changeSalPayStatusRequest({
        payId: statusTarget.payId,
        stat: values.stat,
        rejRsn: values.stat === "REJECTED" ? values.rejRsn : undefined,
      }));
    } catch (e) {
      // 폼 검증 실패
    }
  };

  const openRecalcModal = (record) => {
    setRecalcTarget(record);
    recalcForm.resetFields();
  };
  const handleRecalc = async () => {
    const values = await recalcForm.validateFields().catch(() => null);
    if (values === null) return;
    setRecalculating(true);
    dispatch(recalcSalPayRequest({ payId: recalcTarget.payId, reason: values.reason }));
  };

  const openAdjustModal = (payId, item) => {
    setAdjustTarget({ payId, itemId: item.itemId, itemName: item.itemName, amt: item.amt });
    adjustForm.setFieldsValue({ amt: item.amt, reason: "" });
  };
  const handleAdjust = async () => {
    try {
      const values = await adjustForm.validateFields();
      setAdjusting(true);
      dispatch(adjustSalPayItemRequest({
        payId: adjustTarget.payId,
        itemId: adjustTarget.itemId,
        amt: values.amt,
        reason: values.reason,
      }));
    } catch (e) {
      // 폼 검증 실패
    }
  };

  const confirmDelete = () => {
    setDeleting(true);
    dispatch(deleteSalPayRequest(deleteTarget.payId));
  };

  const columns = [
    { title: "사원명", dataIndex: "empName", key: "empName", width: 120, render: (v) => <b>{v}</b> },
    { title: "지급월", dataIndex: "payMonth", key: "payMonth", width: 100,
      render: (v) => (v ? moment(v).format("YYYY-MM") : "-") },
    { title: "기본급", dataIndex: "baseSal", key: "baseSal", width: 120, align: "right", render: formatWon },
    { title: "수당합계", dataIndex: "allowTotal", key: "allowTotal", width: 120, align: "right", render: formatWon },
    { title: "공제합계", dataIndex: "dedtTotal", key: "dedtTotal", width: 120, align: "right", render: formatWon },
    { title: "실지급액", dataIndex: "netPay", key: "netPay", width: 130, align: "right",
      render: (v) => <b>{formatWon(v)}</b> },
    { title: "상태", dataIndex: "stat", key: "stat", width: 90, align: "center",
      render: (v) => <StatusTag stat={v} /> },
    {
      title: "관리", key: "actions", width: 190, align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
          <Button type="text" size="small" icon={<EyeOutlined />} title="상세"
            onClick={() => setDetailTarget(record)} />
          {record.stat === "PENDING" && (
            <Button type="text" size="small" icon={<SyncOutlined />} title="재산정"
              onClick={() => openRecalcModal(record)} />
          )}
          {NEXT_STATUS[record.stat]?.length > 0 && (
            <Button type="text" size="small" icon={<SwapOutlined />} title="상태변경"
              onClick={() => openStatusModal(record)} />
          )}
          {record.stat !== "PAID" && (
            <Button type="text" size="small" danger icon={<DeleteOutlined />} title="삭제(취소)"
              onClick={() => setDeleteTarget(record)} />
          )}
        </div>
      ),
    },
  ];

  const itemColumns = [
    { title: "구분", dataIndex: "itemType", key: "itemType", width: 70,
      render: (v) => (v === "ALLOWANCE" ? <Tag color="blue">수당</Tag> : <Tag color="volcano">공제</Tag>) },
    { title: "항목명", dataIndex: "itemName", key: "itemName" },
    { title: "금액", dataIndex: "amt", key: "amt", align: "right", render: formatWon },
    detailTarget?.stat === "PENDING"
      ? {
          title: "", key: "adjust", width: 70, align: "center",
          render: (_, item) => (
            <Button type="text" size="small" icon={<EditOutlined />} title="조정"
              onClick={() => openAdjustModal(detailTarget.payId, item)} />
          ),
        }
      : null,
  ].filter(Boolean);

  const nextStatusOptions = useMemo(() => {
    if (!statusTarget) return [];
    return (NEXT_STATUS[statusTarget.stat] || []).map((s) => ({ value: s, label: STATUS_LABEL[s].text }));
  }, [statusTarget]);

  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">급여관리 &gt; 급여지급 &gt; 목록</div>
          <h1>급여지급 관리</h1>
          <p>급여를 산정·등록하고, 승인/지급/반려 상태를 관리합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setRegOpen(true)}>
            급여 산정(등록)
          </Button>
        </div>
      </div>

      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            style={{ width: 160 }}
            placeholder="사원 이름"
            value={filters.empName}
            onChange={(e) => setFilters((f) => ({ ...f, empName: e.target.value }))}
            onPressEnter={() => runSearch(1)}
          />
          <Input
            style={{ width: 140 }}
            placeholder="부서명"
            value={filters.department}
            onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
            onPressEnter={() => runSearch(1)}
          />
          <DatePicker
            picker="month"
            placeholder="지급월"
            value={filters.paymentMonth}
            onChange={(v) => setFilters((f) => ({ ...f, paymentMonth: v }))}
          />
          <Select
            style={{ width: 130 }}
            value={filters.status}
            onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            options={[
              { value: "", label: "전체 상태" },
              { value: "PENDING", label: "대기" },
              { value: "APPROVED", label: "승인" },
              { value: "PAID", label: "지급완료" },
              { value: "REJECTED", label: "반려" },
            ]}
          />
          <Button icon={<SearchOutlined />} onClick={() => runSearch(1)}>검색</Button>
        </div>

        <Table
          rowKey="payId"
          columns={columns}
          dataSource={payList}
          loading={loading && !registering && !changingStatus && !recalculating && !adjusting && !deleting}
          pagination={false}
          locale={{ emptyText: "등록된 급여 지급 내역이 없습니다." }}
        />

        {paging && paging.totalElements > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12 }}>
            <span style={{ color: "#999", fontSize: 12.5 }}>총 <b>{paging.totalElements}</b>건</span>
            <Pagination
              size="small"
              current={page}
              total={paging.totalElements}
              pageSize={paging.size || 10}
              showSizeChanger={false}
              onChange={runSearch}
            />
          </div>
        )}
      </Card>

      {/* 등록(산정) 모달 */}
      <Modal
        title="급여 산정(등록)"
        open={regOpen}
        onCancel={() => { setRegOpen(false); regForm.resetFields(); }}
        onOk={handleRegister}
        okText="산정"
        okButtonProps={{ loading: registering }}
        cancelText="취소"
        destroyOnClose
      >
        <p style={{ color: "#999", fontSize: 13, marginBottom: 16 }}>
          기본급/수당/공제는 급여기준·직책수당·4대보험 요율 등 등록된 정책을 기준으로 자동 산정됩니다.
        </p>
        <Form form={regForm} layout="vertical">
          <Form.Item name="empId" label="사원" rules={[{ required: true, message: "사원을 선택해 주세요." }]}>
            <EmployeePicker />
          </Form.Item>
          <Form.Item name="payMonth" label="지급월" rules={[{ required: true, message: "지급월을 선택해 주세요." }]}>
            <DatePicker picker="month" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 상태변경 모달 */}
      <Modal
        title="급여 지급 상태 변경"
        open={!!statusTarget}
        onCancel={() => setStatusTarget(null)}
        onOk={handleChangeStatus}
        okText="변경"
        okButtonProps={{ loading: changingStatus }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item label="현재 상태">
            <StatusTag stat={statusTarget?.stat} />
          </Form.Item>
          <Form.Item name="stat" label="변경할 상태" rules={[{ required: true, message: "변경할 상태를 선택해 주세요." }]}>
            <Select options={nextStatusOptions} placeholder="상태 선택" />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.stat !== cur.stat}>
            {({ getFieldValue }) =>
              getFieldValue("stat") === "REJECTED" && (
                <Form.Item name="rejRsn" label="반려 사유" rules={[{ required: true, message: "반려 사유를 입력해 주세요." }]}>
                  <Input.TextArea rows={3} placeholder="반려 사유를 입력하세요" />
                </Form.Item>
              )
            }
          </Form.Item>
        </Form>
      </Modal>

      {/* 재산정 모달 */}
      <Modal
        title="급여 재산정"
        open={!!recalcTarget}
        onCancel={() => setRecalcTarget(null)}
        onOk={handleRecalc}
        okText="재산정"
        okButtonProps={{ loading: recalculating }}
        cancelText="취소"
        destroyOnClose
      >
        <p style={{ color: "#999", fontSize: 13 }}>
          급여기준이 산정 이후 변경된 경우, 계산 엔진을 다시 호출해 최신 기준으로 재산정합니다. (대기 상태 건만 가능)
        </p>
        <Form form={recalcForm} layout="vertical">
          <Form.Item name="reason" label="재산정 사유 (선택)">
            <Input.TextArea rows={2} placeholder="예: 급여기준 변경 반영" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 항목 조정 모달 */}
      <Modal
        title={`항목 조정 - ${adjustTarget?.itemName || ""}`}
        open={!!adjustTarget}
        onCancel={() => setAdjustTarget(null)}
        onOk={handleAdjust}
        okText="조정"
        okButtonProps={{ loading: adjusting }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={adjustForm} layout="vertical">
          <Form.Item name="amt" label="조정 금액" rules={[{ required: true, message: "금액을 입력해 주세요." }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={wonFormatter}
              parser={wonParser}
              addonAfter="원"
            />
          </Form.Item>
          <Form.Item name="reason" label="조정 사유" rules={[{ required: true, message: "조정 사유를 입력해 주세요." }]}>
            <Input.TextArea rows={2} placeholder="조정 사유를 입력하세요" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        title="급여 지급 내역 삭제(취소)"
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        okText="삭제"
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText="취소"
        destroyOnClose
      >
        <p>
          <b>{deleteTarget?.empName}</b>님의 {deleteTarget?.payMonth ? moment(deleteTarget.payMonth).format("YYYY년 MM월") : ""} 급여 지급 내역을 삭제(취소)하시겠습니까?
        </p>
        <p style={{ color: "#999", fontSize: 13 }}>지급완료(PAID) 건은 삭제할 수 없습니다.</p>
      </Modal>

      {/* 상세 드로어 */}
      <Drawer
        title="급여 지급 상세"
        open={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        width={520}
        destroyOnClose
      >
        {detailTarget && (
          <>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="사원">{detailTarget.empName}</Descriptions.Item>
              <Descriptions.Item label="지급월">{moment(detailTarget.payMonth).format("YYYY년 MM월")}</Descriptions.Item>
              <Descriptions.Item label="상태"><StatusTag stat={detailTarget.stat} /></Descriptions.Item>
              {detailTarget.stat === "REJECTED" && (
                <Descriptions.Item label="반려사유">{detailTarget.rejRsn || "-"}</Descriptions.Item>
              )}
              <Descriptions.Item label="기본급">{formatWon(detailTarget.baseSal)}</Descriptions.Item>
              <Descriptions.Item label="수당합계">{formatWon(detailTarget.allowTotal)}</Descriptions.Item>
              <Descriptions.Item label="공제합계">{formatWon(detailTarget.dedtTotal)}</Descriptions.Item>
              <Descriptions.Item label="실지급액"><b>{formatWon(detailTarget.netPay)}</b></Descriptions.Item>
              <Descriptions.Item label="지급일시">
                {detailTarget.paidAt ? moment(detailTarget.paidAt).format("YYYY-MM-DD HH:mm") : "-"}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" plain>지급 계좌</Divider>
            {detailTarget.bankName ? (
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="은행">{detailTarget.bankName}</Descriptions.Item>
                <Descriptions.Item label="계좌번호">{detailTarget.acctNo}</Descriptions.Item>
                <Descriptions.Item label="예금주">{detailTarget.hldrName}</Descriptions.Item>
              </Descriptions>
            ) : (
              <p style={{ color: "#999" }}>지급 시점 계좌 정보가 없습니다.</p>
            )}

            <Divider orientation="left" plain>
              수당/공제 항목{detailTarget.stat === "PENDING" ? " (대기 상태에서만 조정 가능)" : ""}
            </Divider>
            <Table
              rowKey="itemId"
              columns={itemColumns}
              dataSource={detailTarget.items || []}
              pagination={false}
              size="small"
            />
          </>
        )}
      </Drawer>
    </div>
  );
}
