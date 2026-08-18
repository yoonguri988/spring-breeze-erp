// pages/res/detail.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { fetchResourceDetailRequest } from "../../reducers/res/resourceReducer";

const RES_TYPE_LABEL = { ROOM: "회의실", EQUIPMENT: "장비", VEHICLE: "차량" };
const RES_STATUS_LABEL = {
  AVAILABLE: "사용가능",
  MAINTENANCE: "점검중",
  DISABLED: "사용중지",
};

export default function ResourceDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { detail: res } = useSelector((state) => state.resource);

  const resId = router.query.resId ? String(router.query.resId) : "";

  useEffect(() => {
    if (!router.isReady || !resId) return;
    dispatch(fetchResourceDetailRequest(resId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, resId]);

  if (!res) return null;

  return (
    <div className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/res/list">자원 관리</Link> · 자원 상세
          </div>
          <h1>{res.resName}</h1>
          <p>자원 상세 정보를 확인합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/res/list">
            <Button icon={<ArrowLeftOutlined />} size="small">
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card__head">
          <h2>자원 정보</h2>
        </div>
        <div className="sb-card__body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="sb-form-label">자원코드</label>
              <div
                className="form-control"
                style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
              >
                {res.resCode}
              </div>
            </div>
            <div className="col-md-6">
              <label className="sb-form-label">자원명</label>
              <div
                className="form-control"
                style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
              >
                {res.resName}
              </div>
            </div>
            <div className="col-md-3">
              <label className="sb-form-label">자원 유형</label>
              <div
                className="form-control"
                style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
              >
                {RES_TYPE_LABEL[res.resType] || res.resType}
              </div>
            </div>

            <div className="col-md-4">
              <label className="sb-form-label">위치</label>
              <div
                className="form-control"
                style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
              >
                {res.location || "-"}
              </div>
            </div>
            <div className="col-md-2">
              <label className="sb-form-label">수량</label>
              <div
                className="form-control"
                style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
              >
                {res.quantity}
              </div>
            </div>
            <div className="col-md-3">
              <label className="sb-form-label">수용인원</label>
              <div
                className="form-control"
                style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
              >
                {res.capacity ?? "-"}
              </div>
            </div>
            <div className="col-md-3">
              <label className="sb-form-label">상태</label>
              <div
                className="form-control"
                style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
              >
                {RES_STATUS_LABEL[res.resStatus] || res.resStatus}
              </div>
            </div>

            <div className="col-12">
              <label className="sb-form-label">비고</label>
              <div
                className="form-control"
                style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
              >
                {res.remark || "-"}
              </div>
            </div>

            <div className="col-12">
              <label className="dd-label">담당자</label>
              <div className="view-val">
                {res.managerEmpId ? (
                  <>
                    <span
                      className="sb-avatar"
                      style={{ width: 22, height: 22, fontSize: 11 }}
                    >
                      {(res.managerEmpName || "").charAt(0)}
                    </span>
                    <span className="ms-1">
                      {res.managerEmpName} {res.managerPosName}
                    </span>
                    <span
                      className="text-faint ms-1"
                      style={{ fontSize: 11.5 }}
                    >
                      #{res.managerEmpNo}
                    </span>
                  </>
                ) : (
                  <span className="view-val-empty">지정 담당자 없음</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
