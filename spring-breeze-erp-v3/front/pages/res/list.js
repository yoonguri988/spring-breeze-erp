// pages/res/list.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Input, Select, Pagination } from "antd";
import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  fetchResourceListRequest,
  fetchResourceCountRequest,
  deleteResourceRequest,
  resetResourceState,
} from "../../reducers/res/resourceReducer";
import ResourceDeleteModal from "../../components/ResourceDeleteModal";
const ONE_PAGE_LIST = 10;

export default function ResourceListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { list, listCount, loading, error, success, deleteReason } =
    useSelector((state) => state.resource);
  const isAdmin = useSelector((state) =>
    state.auth?.user?.roles?.some((r) => r === "ROLE_ADMIN"),
  );

  const [keyword, setKeyword] = useState("");
  const [resType, setResType] = useState("");
  const [resStatus, setResStatus] = useState("");
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const routeError = router.query.error;

  const search = useMemo(() => {
    const q = router.query;
    return {
      keyword: q.keyword || "",
      resType: q.resType || "",
      resStatus: q.resStatus || "",
      pstartno: Number(q.pstartno) || 1,
      onepagelist: ONE_PAGE_LIST,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (!router.isReady) return;
    setKeyword(search.keyword);
    setResType(search.resType);
    setResStatus(search.resStatus);
    dispatch(fetchResourceListRequest(search));
    dispatch(
      fetchResourceCountRequest({
        keyword: search.keyword,
        resType: search.resType,
        resStatus: search.resStatus,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, search]);

  useEffect(() => {
    if (!deleting) return;
    if (success) {
      setTarget(null);
      setDeleting(false);
      dispatch(resetResourceState());
      dispatch(fetchResourceListRequest(search));
      dispatch(
        fetchResourceCountRequest({
          keyword: search.keyword,
          resType: search.resType,
          resStatus: search.resStatus,
        }),
      );
    } else if (error) {
      // 모달은 열어둔 채 에러만 표시 (비밀번호 재입력 유도)
      setDeleting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, deleting]);

  const runSearch = (page = 1) => {
    router.push({
      pathname: "/res/list",
      query: {
        ...(keyword ? { keyword } : {}),
        ...(resType ? { resType } : {}),
        ...(resStatus ? { resStatus } : {}),
        pstartno: page,
      },
    });
  };

  const paging = useMemo(() => {
    const pagetotal = Math.max(1, Math.ceil((listCount || 0) / ONE_PAGE_LIST));
    const current = Math.min(search.pstartno, pagetotal);
    return {
      current,
      listtotal: listCount || 0,
    };
  }, [listCount, search.pstartno]);

  const openDelete = (r) => {
    setTarget({
      resId: r.resId,
      resName: r.resName,
      resvCount: r.resvCount || 0,
    });
    dispatch(resetResourceState());
  };

  const confirmDelete = (password) => {
    if (!target) return;
    setDeleting(true);
    dispatch(deleteResourceRequest({ resId: target.resId, password }));
  };

  const typeBadge = (type) => {
    if (type === "ROOM")
      return <span className="sb-badge sb-badge--blue">회의실</span>;
    if (type === "EQUIPMENT")
      return <span className="sb-badge sb-badge--amber">장비</span>;
    if (type === "VEHICLE")
      return <span className="sb-badge sb-badge--green">차량</span>;
    return <span className="sb-badge">{type}</span>;
  };

  const statusBadge = (status) => {
    if (status === "AVAILABLE")
      return <span className="sb-badge sb-badge--green">사용가능</span>;
    if (status === "MAINTENANCE")
      return <span className="sb-badge sb-badge--amber">점검중</span>;
    if (status === "DISABLED")
      return <span className="sb-badge sb-badge--gray">사용중지</span>;
    return <span className="sb-badge sb-badge--gray">{status}</span>;
  };

  return (
    <div className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">홈 · 자산 · 자원 관리</div>
          <h1>자원 관리</h1>
          <p>회의실, 장비, 차량 등 예약 가능한 자원을 등록하고 관리합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/res/insert">
            <Button type="primary" icon={<PlusOutlined />}>
              자원 등록
            </Button>
          </Link>
        </div>
      </div>

      {routeError === "badPassword" && (
        <Alert
          className="a-alert on mb-3"
          type="error"
          message="비밀번호가 일치하지 않아 삭제되지 않았습니다."
          showIcon
        />
      )}
      {routeError === "hasReservations" && (
        <Alert
          className="a-alert on mb-3"
          type="error"
          message="예약 이력이 있는 자원은 먼저 예약 내역을 정리해야 삭제할 수 있습니다."
          showIcon
        />
      )}

      <div className="sb-card">
        <div className="sb-card__head">
          <h2>자원 목록</h2>
          <span className="sub">검색 조건에 맞는 자원을 확인합니다.</span>
        </div>
        <div className="sb-card__body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-4">
              <Input
                placeholder="자원명 또는 자원코드 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={() => runSearch(1)}
              />
            </div>
            <div className="col-6 col-md-2">
              <Select
                style={{ width: "100%" }}
                value={resType || ""}
                onChange={setResType}
                options={[
                  { value: "", label: "전체 유형" },
                  { value: "ROOM", label: "회의실" },
                  { value: "EQUIPMENT", label: "장비" },
                  { value: "VEHICLE", label: "차량" },
                ]}
              />
            </div>
            <div className="col-6 col-md-2">
              <Select
                style={{ width: "100%" }}
                value={resStatus || ""}
                onChange={setResStatus}
                options={[
                  { value: "", label: "전체 상태" },
                  { value: "AVAILABLE", label: "사용가능" },
                  { value: "MAINTENANCE", label: "점검중" },
                  { value: "DISABLED", label: "사용중지" },
                ]}
              />
            </div>
            <div className="col-12 col-md-auto">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => runSearch(1)}
              >
                검색
              </Button>
            </div>
          </div>
        </div>

        <div className="sb-card__body--flush">
          <table className="sb-table">
            <thead>
              <tr>
                <th style={{ width: 160 }}>자원코드</th>
                <th>자원명</th>
                <th style={{ width: 90 }}>유형</th>
                <th style={{ width: 160 }}>위치</th>
                <th className="num" style={{ width: 70 }}>
                  수량
                </th>
                <th style={{ width: 100 }}>상태</th>
                <th style={{ width: 110 }}>담당자</th>
                <th style={{ width: 80, textAlign: "center" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {(list || []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-faint py-4">
                    등록된 자원이 없습니다.
                  </td>
                </tr>
              ) : (
                list.map((r) => (
                  <tr key={r.resId}>
                    <td>
                      <b>{r.resCode}</b>
                    </td>
                    <td>{r.resName}</td>
                    <td>{typeBadge(r.resType)}</td>
                    <td className="text-faint" style={{ fontSize: 12.5 }}>
                      {r.location || "-"}
                    </td>
                    <td className="num">{r.quantity}</td>
                    <td>{statusBadge(r.resStatus)}</td>
                    <td style={{ fontSize: 12.5 }}>
                      {r.managerEmpName || "-"}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Link
                          href={{
                            pathname: "/res/detail",
                            query: { resId: r.resId },
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
                        {isAdmin && (
                          <>
                            <Link
                              href={{
                                pathname: "/res/update",
                                query: { resId: r.resId },
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
                              title="삭제"
                              onClick={() => openDelete(r)}
                            >
                              <DeleteOutlined />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-2"
        style={{ borderTop: "1px solid var(--sb-border)" }}
      >
        <span className="text-faint" style={{ fontSize: 12.5 }}>
          총 <b>{paging.listtotal}</b>개 자원
        </span>

        {paging.listtotal > ONE_PAGE_LIST && (
          <Pagination
            size="small"
            current={paging.current}
            total={paging.listtotal}
            pageSize={ONE_PAGE_LIST}
            showSizeChanger={false}
            onChange={(page) => runSearch(page)}
          />
        )}
      </div>

      <ResourceDeleteModal
        target={target}
        open={!!target}
        loading={deleting && loading}
        errorMessage={!deleting && error ? error : null}
        onClose={() => {
          setTarget(null);
          dispatch(resetResourceState());
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
