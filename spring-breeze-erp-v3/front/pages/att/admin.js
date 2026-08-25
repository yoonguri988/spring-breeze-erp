// pages/att/admin.js

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Table, Tag, Button, DatePicker, Space, Modal, TimePicker, Select, message, } from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import moment from "moment";

import { listAttRequest, editAttRequest, resetAttState, } from "../../reducers/att/attReducer";

const STATUS_COLOR = {
  NORMAL: "green",
  LATE: "orange",
  EARLY_LEAVE: "gold",
  ABSENT: "red",
  HALF_DAY_AM: "cyan",
  HALF_DAY_PM: "blue",
  ANNUAL_LEAVE: "purple",
};

// 상태 목록 (Select 옵션용)
const STATUS_OPTIONS = [
  "NORMAL", "LATE", "EARLY_LEAVE", "ABSENT",
  "HALF_DAY_AM", "HALF_DAY_PM", "ANNUAL_LEAVE",
];

export default function AttAdminPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation(["att", "common"]);

  const { attList, loading, success } = useSelector((state) => state.att);

  // ── 로컬 상태: 검색 조건 ──
  const [startDate, setStartDate] = useState(
    moment().startOf("month") // 이번 달 1일
  );

  const [endDate, setEndDate] = useState(
    moment() // 오늘
  );

  // ── 로컬 상태: 수정 모달 ──
  const [editingRecord, setEditingRecord] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState(null);
  const [editCheckOut, setEditCheckOut] = useState(null);
  const [editStatus, setEditStatus] = useState(null);

  // ── 마운트 시 검색 실행 ──
  useEffect(() => {
    handleSearch();

    return () => {
      dispatch(resetAttState());
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── 쓰기 성공 감시 ──
  useEffect(() => {
    if (success) {
      message.success(t("att:msg.editSuccess"));
      setEditingRecord(null); // 모달 닫기
      handleSearch();         // 목록 새로고침
      dispatch(resetAttState());
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 검색 실행 ──
  // [dispatch에 payload를 넘기는 과정]
  //   handleSearch()
  //   → dispatch(listAttRequest({ startDate: "2026-08-01", ... }))
  //   → attReducer: state.att.loading = true
  //   → attSaga: takeLatest 감지
  //     → action.payload = { startDate: "2026-08-01", ... }
  //     → listAttApi(action.payload) 호출
  //     → GET /api/att?startDate=2026-08-01&endDate=2026-08-24&start=0&end=100
  //   → 성공: listAttSuccess({ list, paging })
  //   → attReducer: state.att.attList = list
  //
  const handleSearch = () => {
    dispatch(
      listAttRequest({
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        start: 0,
        end: 100,
      })
    );
  };

  // ── 수정 모달 열기 ──
  // record = 테이블에서 클릭한 행의 데이터 (AttendanceResponse 객체)
  // 모달의 초기값을 현재 기록으로 세팅
  const openEditModal = (record) => {
    setEditingRecord(record);
    setEditCheckIn(record.checkIn ? moment(record.checkIn) : null);
    setEditCheckOut(record.checkOut ? moment(record.checkOut) : null);
    setEditStatus(record.attStatus);
  };

  // ── 수정 ──
  // [payload 구조]
  //   editAttRequest({ attId, checkInTime, checkOutTime, attStatus })
  //   → attSaga: editAttApi({ attId, ...rest })
  //   → PUT /api/att/{attId} body: { checkInTime, checkOutTime, attStatus }
  //
  const handleEditSave = () => {
    if (!editingRecord) return;

    // 원래 근무일의 날짜 가져오기
    const dateStr = moment(editingRecord.attDate).format("YYYY-MM-DD");

    dispatch(
      editAttRequest({
        attId: editingRecord.attId,
        // 필드명을 백엔드 AttendanceRequest와 일치
        checkIn: editCheckIn
          ? moment(`${dateStr} ${editCheckIn.format("HH:mm:ss")}`,
                   "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss")
          : null,
        checkOut: editCheckOut
          ? moment(`${dateStr} ${editCheckOut.format("HH:mm:ss")}`,
                   "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss")
          : null,
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
      // ── render의 두 번째 인자 record ──
      // record = 해당 행의 전체 데이터 객체 (AttendanceResponse)
      // 이 값을 openEditModal에 전달해서 모달 초기값으로 사용
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
        <Space>
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
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            {t("att:admin.search.btnSearch")}
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
          pagination={{ pageSize: 20 }}
          locale={{ emptyText: t("att:admin.emptyMsg") }}
        />
      </Card>

      {/* ── 수정 모달 ── */}
      {/*
        visible={!!editingRecord}
          → editingRecord가 null이 아니면 true → 모달 열림
          → editingRecord가 null이면 false → 모달 닫힘
          → !!는 truthy/falsy를 boolean으로 변환하는 관용 표현

        onCancel: 모달 닫기 → editingRecord를 null로 되돌림
        onOk: 저장 → editAttRequest dispatch
      */}
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
            {/* 출근 시간 */}
            <div>
              <label>{t("att:admin.editModal.checkIn")}</label>
              <TimePicker
                value={editCheckIn}
                onChange={setEditCheckIn}
                format="HH:mm"
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>

            {/* 퇴근 시간 */}
            <div>
              <label>{t("att:admin.editModal.checkOut")}</label>
              <TimePicker
                value={editCheckOut}
                onChange={setEditCheckOut}
                format="HH:mm"
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>

            {/* 상태 선택 */}
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
    </div>
  );
}
