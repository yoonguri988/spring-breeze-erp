// pages/att/leave/my.js

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Table, Tag } from "antd";
import { useTranslation } from "react-i18next";

import { fetchMyBalancesRequest, resetLeaveState, } from "../../../reducers/att/leaveBalanceReducer";

export default function LeaveMyPage() {

  const dispatch = useDispatch();

  // ── useTranslation: i18n 다국어 번역 함수 ──
  // t("att:leaveMy.title") → "내 연차 현황" (ko) 또는 "My Leave Balance" (en)
  // 배열의 첫 번째가 기본 namespace, 두 번째부터는 fallback
  const { t } = useTranslation(["att", "common"]);

  // ── useSelector: Redux store에서 필요한 상태를 꺼내온다 ──
  const { myBalances, loading } = useSelector((state) => state.leave);

  // ── useEffect: 컴포넌트 생명주기와 데이터 로딩 ──
  useEffect(() => {
    dispatch(fetchMyBalancesRequest());

    return () => {
      dispatch(resetLeaveState());
    };
  }, [dispatch]);

  // ── Ant Design Table의 columns ──
  // 각 column 객체의 역할:
  //   title: 테이블 헤더에 표시할 텍스트
  //   dataIndex: 데이터 객체(LeaveBalanceResponse)에서 꺼낼 필드명
  //     → 백엔드 DTO의 필드명과 정확히 일치해야 한다
  //     → 예: dataIndex: "totalDays" ← LeaveBalanceResponse.totalDays
  //   key: React의 가상 DOM 비교를 위한 고유 키
  //   render: 해당 셀의 커스텀 렌더링 함수(value, record)
  //     → value = dataIndex로 꺼낸 값
  //     → record = 해당 행의 전체 데이터 객체
  //     → render를 생략하면 value를 그대로 텍스트로 표시

  const columns = [
    {
      title: t("att:leaveMy.table.year"),
      dataIndex: "year",
      key: "year",
      width: 100,
      align: "center",
    },
    {
      title: t("att:leaveMy.table.totalDays"),
      dataIndex: "totalDays",
      key: "totalDays",
      width: 120,
      align: "center",
      // BigDecimal이 JSON에서 숫자로 내려오므로 소수점 표시
      render: (v) => (v != null ? `${v} ${t("att:leaveMy.table.unit")}` : "—"),
    },
    {
      title: t("att:leaveMy.table.usedDays"),
      dataIndex: "usedDays",
      key: "usedDays",
      width: 120,
      align: "center",
      render: (v) => (v != null ? `${v} ${t("att:leaveMy.table.unit")}` : "—"),
    },
    {
      title: t("att:leaveMy.table.remainingDays"),
      dataIndex: "remainingDays",
      key: "remainingDays",
      width: 120,
      align: "center",
      render: (v) => {
        if (v == null) return "—";
        // 잔여 연차가 3일 이하면 빨간색 Tag로 강조
        const color = v <= 3 ? "red" : "green";
        return <Tag color={color}>{v} {t("att:leaveMy.table.unit")}</Tag>;
      },
    },
  ];

  return (
    <div className="sb-page">
      {/* 페이지 헤더: 브레드크럼 + 제목 + 부제목 */}
      <div className="sb-page-head" style={{ marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            {t("common:breadcrumbRoot")} &gt; {t("att:breadcrumb")} &gt; {t("att:leaveMy.breadcrumb")}
          </div>
          <h1>{t("att:leaveMy.title")}</h1>
          <p>{t("att:leaveMy.subtitle")}</p>
        </div>
      </div>

      {/* Ant Design Card + Table */}
      {/* rowKey: 각 행을 식별하는 고유 키 — 백엔드 DTO의 PK 필드명 */}
      {/* loading: true이면 테이블 위에 스피너 오버레이 표시 */}
      {/* pagination: false → 백엔드가 전체 목록을 주므로 프론트 페이징 불필요 */}
      <Card>
        <Table
          rowKey="balanceId"
          columns={columns}
          dataSource={myBalances}
          loading={loading}
          pagination={false}
          locale={{ emptyText: t("att:leaveMy.emptyMsg") }}
        />
      </Card>
    </div>
  );
}