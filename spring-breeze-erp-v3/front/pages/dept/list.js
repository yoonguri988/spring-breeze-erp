// pages/dept/list.js
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AutoComplete, Button, Select, message } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  BuildOutlined,
  TeamOutlined,
  UserOutlined,
  ApartmentOutlined,
  RightOutlined,
} from "@ant-design/icons";

import {
  fetchDeptListRequest,
  fetchDeptFlatRequest,
  deleteDeptRequest,
  resetDeptState,
} from "../../reducers/dept/deptReducer";
import { fetchCompanyListRequest } from "../../reducers/com/companyReducer";
import StatTile from "../../components/StatTile";
import DeptDeleteModal from "../../components/DeptDeleteModal";

export default function DeptListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { list: companies } = useSelector((state) => state.company);
  const {
    flatList: depts,
    stats,
    loading,
    error,
    success,
    message: deptMessage,
    pendingTransfer,
  } = useSelector((state) => state.dept);

  const [comId, setComId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [target, setTarget] = useState(null); // { deptId, deptName, deptCode, empCount, childCount }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanyListRequest({ onepagelist: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady) return;
    const qComId = router.query.comId || user?.comId || "";
    setComId(qComId);
    if (qComId) {
      dispatch(fetchDeptListRequest(qComId));
      dispatch(fetchDeptFlatRequest(qComId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.comId]);

  useEffect(() => {
    if (!deleting || loading) return;
    if (success) {
      if (pendingTransfer && target) {
        // 완전삭제가 아니라 "이관 대기" 상태로 전환된 경우 → 사원 이관 화면으로 바로 이동
        message.info(deptMessage || "소속 사원 이관이 필요합니다.");
        const deptIdForTransfer = target.deptId;
        setTarget(null);
        setDeleting(false);
        dispatch(resetDeptState());
        router.push({
          pathname: "/dept/transfer/list",
          query: { deptId: deptIdForTransfer },
        });
        return;
      }
      message.success(deptMessage || "처리되었습니다.");
      setTarget(null);
      setDeleting(false);
      dispatch(resetDeptState());
      dispatch(fetchDeptListRequest(comId));
      dispatch(fetchDeptFlatRequest(comId));
    } else if (error) {
      message.error(error);
      setDeleting(false);
      dispatch(resetDeptState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, deleting]);

  const handleComChange = (value) => {
    router.push({
      pathname: "/dept/list",
      query: value ? { comId: value } : {},
    });
  };

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return depts || [];
    return (depts || []).filter(
      (d) =>
        (d.deptName || "").toLowerCase().includes(q) ||
        (d.deptCode || "").toLowerCase().includes(q),
    );
  }, [depts, keyword]);

  const suggestOptions = useMemo(
    () =>
      (depts || [])
        .filter((d) => {
          const q = keyword.trim().toLowerCase();
          return (
            q &&
            ((d.deptName || "").toLowerCase().includes(q) ||
              (d.deptCode || "").toLowerCase().includes(q))
          );
        })
        .slice(0, 6)
        .map((d) => ({
          key: d.deptId,
          value: d.deptName,
          label: `${d.deptName} · ${d.deptCode}`,
        })),
    [depts, keyword],
  );

  const openDelete = (dept) => {
    const childCount = (depts || []).filter(
      (d) => d.parentId === dept.deptId,
    ).length;
    setTarget({
      deptId: dept.deptId,
      deptName: dept.deptName,
      deptCode: dept.deptCode,
      empCount: dept.empCount || 0,
      childCount,
    });
  };

  const confirmDelete = () => {
    if (!target) return;
    setDeleting(true);
    dispatch(deleteDeptRequest(target.deptId));
  };

  const rowClass = (d) => {
    if (d.depth === 0) return "dept-row-lv1";
    if (d.depth === 1) return "dept-row-lv2";
    if (d.depth === 2) return "dept-row-lv3";
    return "dept-row-lv4";
  };

  return (
    <div className="sb-content">
      {/* 페이지 헤더 */}
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <RightOutlined /> 회사/부서 관리{" "}
            <RightOutlined /> 부서 관리
          </div>
          <h1>{comId ? `부서 관리` : "부서 관리"}</h1>
          <p>부서 구조를 조회하고 관리합니다.</p>
        </div>
      </div>

      {/* 통계 타일 */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatTile
            icon={<ApartmentOutlined />}
            tone="blue"
            label="전체 부서"
            value={comId ? stats?.deptTotal : "—"}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatTile
            icon={<BankOutlined />}
            tone="violet"
            label="본부"
            value={comId ? stats?.dept1Total : "—"}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatTile
            icon={<TeamOutlined />}
            tone="green"
            label="부서/팀"
            value={comId ? stats?.dept2Total : "—"}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatTile
            icon={<UserOutlined />}
            tone="amber"
            label="전체 인원"
            value={comId ? stats?.empTotal : "—"}
          />
        </div>
      </div>

      {/* 부서 트리 카드 */}
      <div className="sb-card">
        <div className="sb-toolbar">
          {companies?.length > 0 && (
            <div className="sb-field">
              <Select
                style={{ minWidth: 200 }}
                placeholder="회사 선택 (필수)"
                value={comId || undefined}
                onChange={handleComChange}
                options={(companies || []).map((c) => ({
                  value: c.comId,
                  label: c.comName,
                }))}
                allowClear
              />
            </div>
          )}

          <div className="ac-wrap" style={{ maxWidth: 320, flex: "1 1 auto" }}>
            <AutoComplete
              style={{ width: "100%" }}
              value={keyword}
              options={suggestOptions}
              onChange={setKeyword}
              onSelect={(v) => setKeyword(v)}
            >
              <div
                className="sb-field sb-field--search"
                style={{ width: "100%" }}
              >
                <SearchOutlined />
                <input
                  placeholder="부서명 또는 코드 검색"
                  autoComplete="off"
                  style={{ width: "100%" }}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </AutoComplete>
          </div>
          <div className="grow" />

          <span className="text-faint" style={{ fontSize: 12.5 }}>
            {filteredRows.length}건
          </span>

          <Link href={{ pathname: "/dept/add", query: comId ? { comId } : {} }}>
            <Button type="primary" size="small" icon={<PlusOutlined />}>
              부서 등록
            </Button>
          </Link>
        </div>

        <div className="sb-card__body--flush">
          {!comId ? (
            <div className="sb-empty">
              <BankOutlined style={{ fontSize: 34, opacity: 0.5 }} />
              <p>조회할 회사를 선택하세요.</p>
              <p style={{ fontSize: 12.5, marginTop: 4 }}>
                회사명은 필수 검색 조건입니다.
              </p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="sb-empty">
              <ApartmentOutlined style={{ fontSize: 34, opacity: 0.5 }} />
              <p>일치하는 부서가 없습니다.</p>
            </div>
          ) : (
            <table className="sb-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>NO</th>
                  <th style={{ minWidth: 180 }}>부서명</th>
                  <th style={{ width: 80 }}>코드</th>
                  <th style={{ width: 130 }}>상위부서</th>
                  <th style={{ width: 130 }}>부서장</th>
                  <th className="num" style={{ width: 72 }}>
                    인원
                  </th>
                  <th style={{ width: 80, textAlign: "center" }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((d, idx) => (
                  <tr key={d.deptId} className={rowClass(d)}>
                    <td className="sb-hr-cell tnum">{idx + 1}</td>
                    <td className="dept-name-col">
                      <div className="dept-cell-name">
                        {d.depth === 0 ? (
                          <BankOutlined
                            className="dept-depth-icon"
                            style={{ color: "var(--sb-accent)" }}
                          />
                        ) : (
                          <RightOutlined className="dept-depth-icon" />
                        )}
                        <div>
                          <span className="dept-name-text">{d.deptName}</span>
                          {d.parentId ? (
                            <span
                              className="text-faint ms-1"
                              style={{ fontSize: 11.5 }}
                            >
                              ↳ {d.parentName}
                            </span>
                          ) : (
                            <span
                              className="sb-badge sb-badge--blue ms-1"
                              style={{ fontSize: 10.5, padding: "1px 7px" }}
                            >
                              최상위
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="dept-code-chip">{d.deptCode}</span>
                    </td>
                    <td className="text-faint" style={{ fontSize: 13 }}>
                      {d.parentId ? d.parentName : "—"}
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {d.leaderName || <span className="text-faint">—</span>}
                    </td>
                    <td className="num tnum">{d.empCount}명</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 4,
                        }}
                      >
                        <Link
                          href={{
                            pathname: "/dept/detail",
                            query: { deptId: d.deptId },
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
                        <Link
                          href={{
                            pathname: "/dept/edit",
                            query: { deptId: d.deptId, comId },
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
                          onClick={() => openDelete(d)}
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {comId && (
          <div
            style={{
              borderTop: "1px solid var(--sb-border)",
              fontSize: 12,
              color: "var(--sb-ink-faint)",
            }}
            className="px-3 py-2 d-flex align-items-center gap-2"
          >
            <BuildOutlined />
            <span>
              총 <b>{filteredRows.length}</b>개 부서 ·{" "}
              <code style={{ fontSize: 11 }}>상위 부서</code> 기준 트리 구조로
              표시됩니다.
            </span>
          </div>
        )}
      </div>

      <DeptDeleteModal
        target={target}
        open={!!target}
        loading={deleting && loading}
        onClose={() => setTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
