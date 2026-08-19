// pages/resv/my.js
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button, DatePicker, Input, Pagination, Select, message } from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  fetchMyResvListRequest,
  fetchMyResvCountRequest,
  cancelResvRequest,
  returnResvRequest,
  resetResvState,
} from "../../reducers/resv/resvReducer";
import CancelResvModal from "../../components/CancelResvModal";
import ReturnResvModal from "../../components/ReturnResvModal";

const ONE_PAGE_LIST = 10;

const STATUS_TABS = [
  { value: "", label: "전체" },
  { value: "WAI", label: "대기" },
  { value: "APP", label: "승인" },
  { value: "REJ", label: "반려" },
  { value: "NORET", label: "미반납" },
];

function typeBadge(type) {
  if (type === "ROOM")
    return <span className="sb-badge sb-badge--blue">회의실</span>;
  if (type === "EQUIPMENT")
    return <span className="sb-badge sb-badge--violet">장비</span>;
  if (type === "VEHICLE")
    return <span className="sb-badge sb-badge--cyan">차량</span>;
  return <span className="sb-badge">{type}</span>;
}

function statusBadge(status) {
  if (status === "WAI")
    return <span className="sb-badge sb-badge--amber">대기</span>;
  if (status === "APP")
    return <span className="sb-badge sb-badge--green">승인</span>;
  if (status === "REJ")
    return <span className="sb-badge sb-badge--red">반려</span>;
  if (status === "NORET")
    return <span className="sb-badge sb-badge--red">미반납</span>;
  return <span className="sb-badge sb-badge--gray">{status}</span>;
}

function returnCell(r) {
  if (r.returnDt)
    return (
      <span className="sb-badge sb-badge--green">
        {moment(r.returnDt).format("YYYY-MM-DD HH:mm:ss")}
      </span>
    );
  if ((r.status === "APP" || r.status === "NORET") && !r.returnDt)
    return <span className="sb-badge sb-badge--amber">미반납</span>;
  return <span className="view-val-empty">해당 없음</span>;
}

export default function ResvMyPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { myList, myListCount, loading, error, success } = useSelector(
    (state) => state.resv,
  );

  const [resType, setResType] = useState("");
  const [startDt, setStartDt] = useState(null);
  const [endDt, setEndDt] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [target, setTarget] = useState(null); // { revId, resName }
  const [canceling, setCanceling] = useState(false);
  const [returnTarget, setReturnTarget] = useState(null); // { revId, resName }
  const [returning, setReturning] = useState(false);
  const prevLoading = useRef(false);

  const status = router.query.status || "";
  const currentPage = Number(router.query.pstartno) || 1;

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;

    const defaultEndDt = moment().format("YYYY-MM-DD");
    const defaultStartDt = moment().subtract(29, "days").format("YYYY-MM-DD");
    const resolvedStartDt = q.startDt || defaultStartDt;
    const resolvedEndDt = q.endDt || defaultEndDt;

    setResType(q.resType || "");
    setStartDt(resolvedStartDt);
    setEndDt(resolvedEndDt);
    setKeyword(q.keyword || "");

    const search = {
      status: q.status || "",
      resType: q.resType || "",
      startDt: resolvedStartDt,
      endDt: resolvedEndDt,
      keyword: q.keyword || "",
      pstartno: Number(q.pstartno) || 1,
      onepagelist: ONE_PAGE_LIST,
    };
    dispatch(fetchMyResvListRequest(search));
    dispatch(fetchMyResvCountRequest(search));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, router.query]);

  useEffect(() => {
    if (!canceling) return;
    if (prevLoading.current && !loading) {
      if (success) {
        message.success("예약이 취소되었습니다.");
        setTarget(null);
        setCanceling(false);
        dispatch(resetResvState());
      } else if (error) {
        message.error(error);
        setCanceling(false);
        dispatch(resetResvState());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, canceling]);

  useEffect(() => {
    if (!returning) return;
    if (prevLoading.current && !loading) {
      if (success) {
        message.success("반납 처리되었습니다.");
        setReturnTarget(null);
        setReturning(false);
        dispatch(resetResvState());
      } else if (error) {
        message.error(error);
        setReturning(false);
        dispatch(resetResvState());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, returning]);

  useEffect(() => {
    prevLoading.current = loading;
  }, [loading]);

  const runSearch = (page = 1) => {
    router.push({
      pathname: "/resv/my",
      query: {
        ...(status ? { status } : {}),
        ...(resType ? { resType } : {}),
        ...(startDt ? { startDt } : {}),
        ...(endDt ? { endDt } : {}),
        ...(keyword ? { keyword } : {}),
        pstartno: page,
      },
    });
  };

  const goStatus = (v) => {
    router.push({
      pathname: "/resv/my",
      query: { ...(v ? { status: v } : {}) },
    });
  };

  const openCancel = (r) => {
    setTarget({ revId: r.revId, resName: r.resName });
    dispatch(resetResvState());
  };

  const confirmCancel = () => {
    if (!target) return;
    setCanceling(true);
    dispatch(cancelResvRequest(target.revId));
  };

  const openReturn = (r) => {
    setReturnTarget({ revId: r.revId, resName: r.resName });
    dispatch(resetResvState());
  };

  const confirmReturn = () => {
    if (!returnTarget) return;
    setReturning(true);
    dispatch(returnResvRequest(returnTarget.revId));
  };

  const startOffset = (currentPage - 1) * ONE_PAGE_LIST;

  return (
    <div className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <span>&gt;</span>{" "}
            <Link href="/resv/my">내 자원 요청 관리</Link> <span>&gt;</span>{" "}
            예약 목록
          </div>
          <h1>내 자원 요청 관리</h1>
          <p>내가 신청한 자원 예약 내역을 조회하고 관리합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/resv/insert">
            <Button type="primary" icon={<PlusOutlined />}>
              예약 신청
            </Button>
          </Link>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card__head">
          <h2>예약 목록</h2>
          <div className="right">
            <div className="sb-segment">
              {STATUS_TABS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={status === t.value ? "active" : ""}
                  onClick={() => goStatus(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="row align-items-end g-2"
          style={{
            padding: "16px 18px",
            borderTop: "1px solid var(--sb-border)",
            margin: 0,
          }}
        >
          <div className="col-auto" style={{ minWidth: 150 }}>
            <label className="form-label small fw-semibold mb-1">
              자원 유형
            </label>
            <Select
              style={{ width: "100%" }}
              value={resType || ""}
              onChange={setResType}
              options={[
                { value: "", label: "전체" },
                { value: "ROOM", label: "회의실" },
                { value: "EQUIPMENT", label: "장비" },
                { value: "VEHICLE", label: "차량" },
              ]}
            />
          </div>
          <div className="col-auto" style={{ minWidth: 150 }}>
            <label className="form-label small fw-semibold mb-1">
              <CalendarOutlined /> 시작일
            </label>
            <DatePicker
              style={{ width: "100%" }}
              value={startDt ? moment(startDt) : null}
              onChange={(d) => setStartDt(d ? d.format("YYYY-MM-DD") : null)}
            />
          </div>
          <div className="col-auto" style={{ minWidth: 150 }}>
            <label className="form-label small fw-semibold mb-1">종료일</label>
            <DatePicker
              style={{ width: "100%" }}
              value={endDt ? moment(endDt) : null}
              onChange={(d) => setEndDt(d ? d.format("YYYY-MM-DD") : null)}
            />
          </div>
          <div className="col-auto" style={{ minWidth: 180 }}>
            <label className="form-label small fw-semibold mb-1">자원명</label>
            <Input
              style={{ width: "100%" }}
              placeholder="자원명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={() => runSearch(1)}
            />
          </div>
          <div className="col-auto">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => runSearch(1)}
            >
              조회
            </Button>
          </div>
        </div>

        <div className="sb-search-note px-3">
          <InfoCircleOutlined /> 처리일자를 지정하지 않으면 기본으로{" "}
          <b>최근 30일</b>만 조회합니다(위 시작일·종료일에 채워진 기본값
          그대로입니다). 전체 기간을 보려면 시작일을 더 과거로 넓혀서
          조회하세요.
        </div>

        <div className="sb-card__body--flush">
          {(myList || []).length === 0 ? (
            <div className="sb-empty">
              <BookOutlined style={{ fontSize: 30, opacity: 0.5 }} />
              <p>조건에 해당하는 예약 내역이 없습니다.</p>
            </div>
          ) : (
            <table className="sb-table">
              <thead>
                <tr>
                  <th style={{ width: 56 }}>순서</th>
                  <th>자원명</th>
                  <th style={{ width: 90 }}>유형</th>
                  <th style={{ width: 130 }}>위치</th>
                  <th className="num" style={{ width: 60 }}>
                    수량
                  </th>
                  <th style={{ width: 120 }}>시작일</th>
                  <th style={{ width: 120 }}>종료일</th>
                  <th style={{ width: 90 }}>반납</th>
                  <th style={{ width: 50 }}>상태</th>
                  <th style={{ width: 120 }}>승인자 / 반려사유</th>
                  <th style={{ width: 100, textAlign: "center" }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {myList.map((r, idx) => (
                  <tr key={r.revId}>
                    <td className="tnum">{myListCount - startOffset - idx}</td>
                    <td>
                      <b>{r.resName}</b>
                    </td>
                    <td>{typeBadge(r.resType)}</td>
                    <td className="text-faint" style={{ fontSize: 12.5 }}>
                      {r.location || "-"}
                    </td>
                    <td className="num">{r.quantity}</td>
                    <td>{moment(r.startDt).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>{moment(r.endDt).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>{returnCell(r)}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td style={{ fontSize: 12 }}>
                      {r.status === "APP" && (
                        <>
                          <div>{r.approvedEmpName}</div>
                          <div className="text-faint">
                            {moment(r.approvedAt).format("YYYY-MM-DD HH:mm:ss")}
                          </div>
                        </>
                      )}
                      {r.status === "REJ" && (
                        <span style={{ color: "var(--sb-red)" }}>
                          {r.rejectReason}
                        </span>
                      )}
                      {r.status === "WAI" && (
                        <span className="view-val-empty">-</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-1">
                        <Link
                          href={{
                            pathname: "/resv/detail",
                            query: { revId: r.revId },
                          }}
                        >
                          <button
                            type="button"
                            className="sb-iconbtn"
                            title="상세보기"
                          >
                            <BookOutlined />
                          </button>
                        </Link>
                        {r.status === "WAI" && (
                          <>
                            <Link
                              href={{
                                pathname: "/resv/edit",
                                query: { revId: r.revId },
                              }}
                            >
                              <button
                                type="button"
                                className="sb-iconbtn"
                                title="수정"
                              >
                                <EditOutlined />
                              </button>
                            </Link>
                            <button
                              type="button"
                              className="sb-iconbtn"
                              style={{ color: "var(--sb-red)" }}
                              title="취소"
                              onClick={() => openCancel(r)}
                            >
                              <CloseCircleOutlined />
                            </button>
                          </>
                        )}
                        {(r.status === "APP" || r.status === "NORET") &&
                          !r.returnDt && (
                            <button
                              type="button"
                              className="sb-iconbtn"
                              style={{ color: "var(--sb-green, #389e0d)" }}
                              title="반납"
                              onClick={() => openReturn(r)}
                            >
                              <RollbackOutlined />
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {myListCount > 0 && (
            <div
              className="d-flex align-items-center justify-content-between px-3 py-2"
              style={{ borderTop: "1px solid var(--sb-border)" }}
            >
              <span className="text-faint" style={{ fontSize: 12.5 }}>
                총 <b>{myListCount}</b>건
              </span>
              <Pagination
                size="small"
                current={currentPage}
                total={myListCount}
                pageSize={ONE_PAGE_LIST}
                showSizeChanger={false}
                onChange={runSearch}
              />
            </div>
          )}
        </div>
      </div>

      <CancelResvModal
        target={target}
        open={!!target}
        loading={canceling && loading}
        onClose={() => setTarget(null)}
        onConfirm={confirmCancel}
      />
      <ReturnResvModal
        target={returnTarget}
        open={!!returnTarget}
        loading={returning && loading}
        onClose={() => setReturnTarget(null)}
        onConfirm={confirmReturn}
      />
    </div>
  );
}
