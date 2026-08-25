// pages/att/admin.js

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card, Table, Tag, Button, DatePicker, Input,
  Space, Modal, TimePicker, Select, message,
} from "antd";
import { EditOutlined, SearchOutlined, PlusOutlined, } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import moment from "moment";

import { listAttRequest, editAttRequest, createAttRequest, resetAttState, } from "../../reducers/att/attReducer";

const STATUS_COLOR = {
  NORMAL: "green",
  LATE: "orange",
  EARLY_LEAVE: "gold",
  ABSENT: "red",
  HALF_DAY_AM: "cyan",
  HALF_DAY_PM: "blue",
  ANNUAL_LEAVE: "purple",
};

const STATUS_OPTIONS = [
  "NORMAL", "LATE", "EARLY_LEAVE", "ABSENT",
  "HALF_DAY_AM", "HALF_DAY_PM", "ANNUAL_LEAVE",
];

export default function AttAdminPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation(["att", "common"]);

  const { attList, loading, success, error } = useSelector((state) => state.att);

  // ── 검색 조건 ──
  const [startDate, setStartDate] = useState(moment().startOf("month"));
  const [endDate, setEndDate] = useState(moment());
  // keyword: 사원명 또는 사번 검색어 (빈 문자열이면 전체 조회)
  const [keyword, setKeyword] = useState("");

  // ── 수정 모달 ──
  const [editingRecord, setEditingRecord] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState(null);
  const [editCheckOut, setEditCheckOut] = useState(null);
  const [editStatus, setEditStatus] = useState(null);

  // ── 등록 모달 ──
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createEmpNo, setCreateEmpNo] = useState(null);
  const [createDate, setCreateDate] = useState(null);
  const [createCheckIn, setCreateCheckIn] = useState(null);
  const [createCheckOut, setCreateCheckOut] = useState(null);
  const [createStatus, setCreateStatus] = useState("NORMAL");

  // ── 어떤 모달에서 성공했는지 구분하기 위한 플래그 ──
  const [lastAction, setLastAction] = useState(null); // "edit" | "create"

  // ── 마운트 시 검색 실행 ──
  useEffect(() => {
    handleSearch();
    return () => {
      dispatch(resetAttState());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 성공 감시 ──
  useEffect(() => {
    if (success) {
      if (lastAction === "create") {
        message.success(t("att:msg.createSuccess", "근태가 등록되었습니다."));
        setCreateModalVisible(false);
        resetCreateForm();
      } else {
        message.success(t("att:msg.editSuccess"));
        setEditingRecord(null);
      }
      handleSearch();
      dispatch(resetAttState());
      setLastAction(null);
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 에러 감시 ──
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(resetAttState());
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 검색 ──
  // keyword가 빈 문자열이면 null로 변환해서 전송
  // → 백엔드에서 (:keyword IS NULL OR ...) 조건으로 전체 조회
  const handleSearch = () => {
    dispatch(
      listAttRequest({
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        keyword: keyword.trim() || null,
        start: 0,
        end: 100,
      })
    );
  };

  // ── 수정 모달 ──
  const openEditModal = (record) => {
    setEditingRecord(record);
    setEditCheckIn(record.checkIn ? moment(record.checkIn) : null);
    setEditCheckOut(record.checkOut ? moment(record.checkOut) : null);
    setEditStatus(record.attStatus);
  };

  const handleEditSave = () => {
    if (!editingRecord) return;
    if (!editCheckIn) {
      message.warning("출근 시간을 입력해주세요.");
      return;
    }

    const dateStr = moment(editingRecord.attDate).format("YYYY-MM-DD");
    setLastAction("edit");
    dispatch(
      editAttRequest({
        attId: editingRecord.attId,
        checkIn: editCheckIn
          ? moment(`${dateStr} ${editCheckIn.format("HH:mm:ss")}`,
                   "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss")
          : null,
        checkOut: editCheckOut
          ? moment(`${dateStr} ${editCheckOut.format("HH:mm:ss")}`,
                   "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss")
          : null,
        attStatus: editStatus,
      })
    );
  };

  // ── 등록 모달 ──
  const resetCreateForm = () => {
    setCreateEmpNo(null);
    setCreateDate(null);
    setCreateCheckIn(null);
    setCreateCheckOut(null);
    setCreateStatus("NORMAL");
  };

  const openCreateModal = () => {
    resetCreateForm();
    setCreateModalVisible(true);
  };

  const handleCreateSave = () => {
    // 유효성 검사
    if (!createEmpNo.trim()) {
      message.warning("사번을 입력해주세요.");
      return;
    }
    if (!createDate) {
      message.warning("근무일을 선택해주세요.");
      return;
    }

    const dateStr = createDate.format("YYYY-MM-DD");
    setLastAction("create");

    dispatch(
      createAttRequest({
        empNo: createEmpNo,
        attDate: dateStr,
        checkIn: createCheckIn
          ? moment(`${dateStr} ${createCheckIn.format("HH:mm:ss")}`,
                   "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss")
          : null,
        checkOut: createCheckOut
          ? moment(`${dateStr} ${createCheckOut.format("HH:mm:ss")}`,
                   "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss")
          : null,
        attStatus: createStatus,
      })
    );
  };

  const columns = [
    {
      title: t("att:admin.table.empNo"),
      dataIndex: "empNo",
      key: "empNo",
      width: 100,
    },
    {
      title: t("att:admin.table.empName"),
      dataIndex: "empName",
      key: "empName",
      width: 100,
    },
    {
      title: t("att:admin.table.date"),
      dataIndex: "attDate",
      key: "attDate",
      width: 120,
      render: (v) => (v ? moment(v).format("YYYY-MM-DD") : "—"),
    },
    {
      title: t("att:admin.table.checkIn"),
      dataIndex: "checkIn",
      key: "checkIn",
      width: 100,
      render: (v) => (v ? moment(v).format("HH:mm") : "—"),
    },
    {
      title: t("att:admin.table.checkOut"),
      dataIndex: "checkOut",
      key: "checkOut",
      width: 100,
      render: (v) => (v ? moment(v).format("HH:mm") : "—"),
    },
    {
      title: t("att:admin.table.workMinutes"),
      dataIndex: "workMinutes",
      key: "workMinutes",
      width: 100,
      align: "center",
      render: (v) => (v != null ? v : "—"),
    },
    {
      title: t("att:admin.table.status"),
      dataIndex: "attStatus",
      key: "attStatus",
      width: 100,
      render: (s) =>
        s ? (
          <Tag color={STATUS_COLOR[s] || "default"}>
            {t(`att:status.${s}`, s)}
          </Tag>
        ) : (
          "—"
        ),
    },
    {
      title: t("att:admin.table.action"),
      key: "action",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => openEditModal(record)}
        >
          {t("att:admin.btnEdit")}
        </Button>
      ),
    },
  ];

  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            {t("common:breadcrumbRoot")} &gt; {t("att:breadcrumb")} &gt; {t("att:admin.breadcrumb")}
          </div>
          <h1>{t("att:admin.title")}</h1>
          <p>{t("att:admin.subtitle")}</p>
        </div>
      </div>

      {/* ── 검색 영역 ── */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <DatePicker
            value={startDate}
            onChange={(v) => setStartDate(v)}
            placeholder={t("att:admin.search.startDate")}
          />
          <span>~</span>
          <DatePicker
            value={endDate}
            onChange={(v) => setEndDate(v)}
            placeholder={t("att:admin.search.endDate")}
          />
          {/* 사원명/사번 검색 필터 */}
          <Input
            placeholder="사원명 또는 사번"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 180 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            {t("att:admin.search.btnSearch")}
          </Button>
          {/* 등록 버튼 */}
          <Button
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            근태 등록
          </Button>
        </Space>
      </Card>

      {/* ── 목록 테이블 ── */}
      <Card>
        <Table
          rowKey="attId"
          columns={columns}
          dataSource={attList}
          loading={loading}
          pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: t("att:admin.emptyMsg") }}
        />
      </Card>

      {/* ══════════════════════════════════════════════ */}
      {/*  수정 모달                                     */}
      {/* ══════════════════════════════════════════════ */}
      <Modal
        title={t("att:admin.editModal.title")}
        visible={!!editingRecord}
        onCancel={() => setEditingRecord(null)}
        onOk={handleEditSave}
        okText={t("att:admin.editModal.btnSave")}
        cancelText={t("att:admin.editModal.btnCancel")}
        confirmLoading={loading}
      >
        {editingRecord && (
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <div>
              <label>{t("att:admin.editModal.checkIn")}</label>
              <TimePicker
                value={editCheckIn}
                onChange={setEditCheckIn}
                format="HH:mm"
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>
            <div>
              <label>{t("att:admin.editModal.checkOut")}</label>
              <TimePicker
                value={editCheckOut}
                onChange={setEditCheckOut}
                format="HH:mm"
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>
            <div>
              <label>{t("att:admin.editModal.status")}</label>
              <Select
                value={editStatus}
                onChange={setEditStatus}
                style={{ width: "100%", marginTop: 4 }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <Select.Option key={s} value={s}>
                    {t(`att:status.${s}`, s)}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Space>
        )}
      </Modal>

      {/* ══════════════════════════════════════════════ */}
      {/*  등록 모달                                     */}
      {/* ══════════════════════════════════════════════ */}
      <Modal
        title="근태 등록"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={handleCreateSave}
        okText="등록"
        cancelText={t("att:admin.editModal.btnCancel")}
        confirmLoading={loading}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {/* 사원 ID */}
          <div>
            <label>사번</label>
            <Input
              value={createEmpNo}
              onChange={(e) => setCreateEmpNo(e.target.value)}
              placeholder="예: EMP-001"
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          {/* 근무일 */}
          <div>
            <label>근무일</label>
            <DatePicker
              value={createDate}
              onChange={setCreateDate}
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          {/* 출근 시간 */}
          <div>
            <label>{t("att:admin.editModal.checkIn")}</label>
            <TimePicker
              value={createCheckIn}
              onChange={setCreateCheckIn}
              format="HH:mm"
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          {/* 퇴근 시간 */}
          <div>
            <label>{t("att:admin.editModal.checkOut")}</label>
            <TimePicker
              value={createCheckOut}
              onChange={setCreateCheckOut}
              format="HH:mm"
              style={{ width: "100%", marginTop: 4 }}
            />
          </div>

          {/* 상태 */}
          <div>
            <label>{t("att:admin.editModal.status")}</label>
            <Select
              value={createStatus}
              onChange={setCreateStatus}
              style={{ width: "100%", marginTop: 4 }}
            >
              {STATUS_OPTIONS.map((s) => (
                <Select.Option key={s} value={s}>
                  {t(`att:status.${s}`, s)}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Space>
      </Modal>
    </div>
  );
}