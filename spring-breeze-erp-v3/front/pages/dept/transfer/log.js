// pages/dept/transfer/log.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, DatePicker, Pagination, Select } from "antd";
import {
  HistoryOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { fetchTransferLogRequest } from "../../../reducers/dept/deptTransferReducer";

const ONE_PAGE_LIST = 10;

export default function DeptTransferLogPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { logs, logTotal, deptOptions } = useSelector(
    (state) => state.deptTransfer,
  );

  const [originDeptId, setOriginDeptId] = useState(undefined);
  const [targetDeptId, setTargetDeptId] = useState(undefined);
  const [aiRecommended, setAiRecommended] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;
    const defaultDateTo = moment().format("YYYY-MM-DD");
    const defaultDateFrom = moment().subtract(30, "days").format("YYYY-MM-DD");
    const resolvedDateFrom = q.dateFrom || defaultDateFrom;
    const resolvedDateTo = q.dateTo || defaultDateTo;

    setOriginDeptId(q.originDeptId || undefined);
    setTargetDeptId(q.targetDeptId || undefined);
    setAiRecommended(q.aiRecommended || "");
    setDateFrom(resolvedDateFrom);
    setDateTo(resolvedDateTo);
    dispatch(
      fetchTransferLogRequest({
        originDeptId: q.originDeptId || "",
        targetDeptId: q.targetDeptId || "",
        aiRecommended: q.aiRecommended || "",
        dateFrom: resolvedDateFrom,
        dateTo: resolvedDateTo,
        pstartno: Number(q.pstartno) || 1,
        onepagelist: ONE_PAGE_LIST,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, router.query]);

  const currentPage = Number(router.query.pstartno) || 1;

  const runSearch = (page = 1) => {
    router.push({
      pathname: "/dept/transfer/log",
      query: {
        ...(originDeptId ? { originDeptId } : {}),
        ...(targetDeptId ? { targetDeptId } : {}),
        ...(aiRecommended ? { aiRecommended } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
        pstartno: page,
      },
    });
  };

  const handleReset = () => {
    router.push({ pathname: "/dept/transfer/log" });
  };

  return (
    <div className="sb-content">
      <div className="sb-card mb-3">
        <div className="sb-toolbar">
          <span className="fw-semibold">
            <HistoryOutlined /> 부서 이관 이력
          </span>
        </div>

        {/* 필터 */}
        <div
          className="row align-items-end g-2"
          style={{
            padding: "16px 18px",
            borderTop: "1px solid var(--sb-border)",
            margin: 0,
          }}
        >
          <div className="col-auto" style={{ minWidth: 170 }}>
            <label className="form-label small fw-semibold mb-1">원부서</label>
            <Select
              style={{ width: "100%" }}
              placeholder="전체"
              allowClear
              value={originDeptId}
              onChange={setOriginDeptId}
              options={(deptOptions || []).map((d) => ({
                value: String(d.deptId),
                label: d.deptName,
              }))}
            />
          </div>
          <div className="col-auto" style={{ minWidth: 170 }}>
            <label className="form-label small fw-semibold mb-1">
              대상부서
            </label>
            <Select
              style={{ width: "100%" }}
              placeholder="전체"
              allowClear
              value={targetDeptId}
              onChange={setTargetDeptId}
              options={(deptOptions || []).map((d) => ({
                value: String(d.deptId),
                label: d.deptName,
              }))}
            />
          </div>
          <div className="col-auto" style={{ minWidth: 150 }}>
            <label className="form-label small fw-semibold mb-1">
              AI 제안 여부
            </label>
            <Select
              style={{ width: "100%" }}
              value={aiRecommended || ""}
              onChange={setAiRecommended}
              options={[
                { value: "", label: "전체" },
                { value: "Y", label: "AI 추천 수용" },
                { value: "N", label: "수동 선택" },
              ]}
            />
          </div>
          <div className="col-auto" style={{ maxWidth: 150 }}>
            <label className="form-label small fw-semibold mb-1">
              처리일자(시작)
            </label>
            <DatePicker
              style={{ width: "100%" }}
              value={dateFrom ? moment(dateFrom) : null}
              onChange={(d) => setDateFrom(d ? d.format("YYYY-MM-DD") : null)}
            />
          </div>
          <div className="col-auto" style={{ maxWidth: 150 }}>
            <label className="form-label small fw-semibold mb-1">
              처리일자(종료)
            </label>
            <DatePicker
              style={{ width: "100%" }}
              value={dateTo ? moment(dateTo) : null}
              onChange={(d) => setDateTo(d ? d.format("YYYY-MM-DD") : null)}
            />
          </div>
          <div className="col-auto d-flex gap-2">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => runSearch(1)}
            >
              조회
            </Button>
            <Button onClick={handleReset}>초기화</Button>
          </div>
        </div>

        <div
          className="px-3 pt-2"
          style={{ fontSize: 12, color: "var(--sb-ink-faint)" }}
        >
          <InfoCircleOutlined /> 기본으로 <b>최근 30일</b>만 조회합니다. 전체
          기간을 보려면 시작일을 더 과거로 넓혀서 조회하세요.
        </div>

        <div className="sb-card__body--flush mt-2">
          {(logs || []).length > 0 ? (
            <table className="sb-table">
              <thead>
                <tr>
                  <th style={{ width: 150 }}>처리일자</th>
                  <th>원부서</th>
                  <th>대상부서</th>
                  <th>사원</th>
                  <th style={{ width: 110 }}>AI 제안</th>
                  <th>AI 사유</th>
                  <th style={{ width: 100 }}>처리자</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l, i) => (
                  <tr key={i}>
                    <td>{l.createdAt}</td>
                    <td>{l.originDeptName}</td>
                    <td>{l.targetDeptName}</td>
                    <td>
                      {l.empName} ({l.empNo})
                    </td>
                    <td>
                      {l.aiRecommended === "Y" ? (
                        <span className="sb-badge sb-badge--accent">
                          <ThunderboltOutlined /> 수용
                        </span>
                      ) : (
                        <span className="sb-badge sb-badge--gray">수동</span>
                      )}
                    </td>
                    <td
                      style={{
                        maxWidth: 280,
                        fontSize: 12.5,
                        color: "var(--sb-ink-soft)",
                      }}
                    >
                      {l.aiReason || "-"}
                    </td>
                    <td>{l.createdByName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="sb-empty">
              <HistoryOutlined style={{ fontSize: 30, opacity: 0.5 }} />
              <p>조건에 해당하는 이관 이력이 없습니다.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {logTotal > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
              }}
            >
              <span style={{ color: "var(--sb-ink-faint)", fontSize: 12 }}>
                총 <b>{logTotal}</b>건
              </span>
              <Pagination
                size="small"
                current={currentPage}
                total={logTotal}
                pageSize={ONE_PAGE_LIST}
                showSizeChanger={false}
                onChange={runSearch}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
