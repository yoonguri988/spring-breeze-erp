// pages/sal/hist/list.js
// 급여 변경이력 조회 (ROLE_ADMIN, 조회 전용) - GET /api/salhist
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Table, Button, Tag, Select, DatePicker, Pagination, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

import { searchSalHistRequest, resetSalHistState } from "../../reducers/sal/salHistReducer";
import EmployeePicker from "../../components/sal/EmployeePicker";

const { RangePicker } = DatePicker;

const DOM_LABEL = {
  SALARY_STANDARD: { text: "급여기준", color: "geekblue" },
  SALARY_PAYMENT: { text: "급여지급", color: "purple" },
  SALARY_ACCOUNT: { text: "수령계좌", color: "cyan" },
};

const CHG_LABEL = {
  CREATE: { text: "등록", color: "green" },
  UPDATE: { text: "수정", color: "blue" },
  DELETE: { text: "삭제", color: "red" },
  STATUS_CHANGE: { text: "상태변경", color: "gold" },
  MANUAL_ADJUST: { text: "수동조정", color: "volcano" },
};

function prettyJson(value) {
  if (!value) return "-";
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch (e) {
    return value;
  }
}

export default function SalHistListPage() {
  const dispatch = useDispatch();
  const { histList, paging, loading } = useSelector((state) => state.salHist);

  const [actorEmpId, setActorEmpId] = useState(undefined);
  const [changeType, setChangeType] = useState("");
  const [range, setRange] = useState(null);
  const [page, setPage] = useState(1);

  const runSearch = (nextPage = 1) => {
    setPage(nextPage);
    dispatch(searchSalHistRequest({
      actorEmpId,
      changeType: changeType || undefined,
      from: range?.[0] ? range[0].startOf("day").format("YYYY-MM-DDTHH:mm:ss") : undefined,
      to: range?.[1] ? range[1].endOf("day").format("YYYY-MM-DDTHH:mm:ss") : undefined,
      page: nextPage - 1,
      size: 10,
    }));
  };

  useEffect(() => {
    runSearch(1);
    return () => dispatch(resetSalHistState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const columns = [
    { title: "처리일시", dataIndex: "createdAt", key: "createdAt", width: 150,
      render: (v) => (v ? moment(v).format("YYYY-MM-DD HH:mm:ss") : "-") },
    { title: "처리자", dataIndex: "actorName", key: "actorName", width: 100 },
    { title: "대상직원ID", dataIndex: "trgtEmpId", key: "trgtEmpId", width: 100, align: "center",
      render: (v) => v ?? "-" },
    { title: "도메인", dataIndex: "domType", key: "domType", width: 100, align: "center",
      render: (v) => {
        const info = DOM_LABEL[v] || { text: v, color: "default" };
        return <Tag color={info.color}>{info.text}</Tag>;
      } },
    { title: "처리유형", dataIndex: "chgType", key: "chgType", width: 100, align: "center",
      render: (v) => {
        const info = CHG_LABEL[v] || { text: v, color: "default" };
        return <Tag color={info.color}>{info.text}</Tag>;
      } },
    { title: "설명", dataIndex: "descr", key: "descr", ellipsis: true, render: (v) => v || "-" },
  ];

  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">급여관리 &gt; 변경이력 &gt; 조회</div>
          <h1>급여 변경이력 조회</h1>
          <p>급여기준/급여지급/수령계좌의 등록·수정·삭제·상태변경 이력을 조회합니다. (조회 전용)</p>
        </div>
      </div>

      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <EmployeePicker
            value={actorEmpId}
            onChange={setActorEmpId}
            placeholder="처리자 검색"
            style={{ width: 220 }}
          />
          <Select
            style={{ width: 140 }}
            value={changeType}
            onChange={setChangeType}
            options={[
              { value: "", label: "전체 처리유형" },
              { value: "CREATE", label: "등록" },
              { value: "UPDATE", label: "수정" },
              { value: "DELETE", label: "삭제" },
              { value: "STATUS_CHANGE", label: "상태변경" },
              { value: "MANUAL_ADJUST", label: "수동조정" },
            ]}
          />
          <RangePicker value={range} onChange={setRange} />
          <Button icon={<SearchOutlined />} onClick={() => runSearch(1)}>검색</Button>
        </div>

        <Table
          rowKey="histId"
          columns={columns}
          dataSource={histList}
          loading={loading}
          pagination={false}
          locale={{ emptyText: "조회된 변경이력이 없습니다." }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>변경 전</div>
                  <pre className="sb-code-block">{prettyJson(record.bfrVal)}</pre>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>변경 후</div>
                  <pre className="sb-code-block">{prettyJson(record.aftVal)}</pre>
                </div>
              </div>
            ),
          }}
        />

        {paging && paging.totalElements > 0 ? (
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
        ) : (
          !loading && histList.length === 0 && <Empty description="이력이 없습니다" style={{ marginTop: 16 }} />
        )}
      </Card>

      <style jsx>{`
        :global(.sb-code-block) {
          background: #f6f8fa;
          border: 1px solid #eaeaea;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 12px;
          max-height: 260px;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}
