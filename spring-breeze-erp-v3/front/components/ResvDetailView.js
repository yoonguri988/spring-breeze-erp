// components/ResvDetailView.js
import React from "react";

const RES_TYPE_LABEL = { ROOM: "회의실", EQUIPMENT: "장비", VEHICLE: "차량" };

function statusBadge(status) {
  if (status === "WAI")
    return <span className="sb-badge sb-badge--amber">대기</span>;
  if (status === "APP")
    return <span className="sb-badge sb-badge--green">승인</span>;
  if (status === "REJ")
    return <span className="sb-badge sb-badge--red">반려</span>;
  return <span className="sb-badge sb-badge--gray">{status}</span>;
}

function returnCell(r) {
  if (r.returnDt)
    return <span className="sb-badge sb-badge--green">{r.returnDt}</span>;
  if (r.status === "APP" && !r.returnDt)
    return <span className="sb-badge sb-badge--amber">미반납</span>;
  return <span className="view-val-empty">해당 없음</span>;
}

export default function ResvDetailView({ resv }) {
  return (
    <div className="row g-3 align-items-stretch">
      <div className="col-lg-7">
        <div className="sb-card mb-3">
          <div className="sb-card__head">
            <h2>자원 정보</h2>
          </div>
          <div className="sb-card__body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="sb-form-label">자원명</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  <span>{resv.resName}</span>
                </div>
              </div>
              <div className="col-md-3">
                <label className="sb-form-label">자원코드</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  {resv.resCode}
                </div>
              </div>
              <div className="col-md-3">
                <label className="sb-form-label">유형</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  <span className="sb-badge sb-badge--gray">
                    {RES_TYPE_LABEL[resv.resType] || resv.resType}
                  </span>
                </div>
              </div>
              <div className="col-md-8">
                <label className="sb-form-label">위치</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  {resv.location || "-"}
                </div>
              </div>
              <div className="col-md-4">
                <label className="sb-form-label">수용/수량</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  {resv.capacity ? `${resv.capacity}명 · ` : ""}
                  {resv.resQuantity ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sb-card">
          <div className="sb-card__head">
            <h2>예약 정보</h2>
          </div>
          <div className="sb-card__body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="sb-form-label">시작일시</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  {resv.startDt}
                </div>
              </div>
              <div className="col-md-4">
                <label className="sb-form-label">종료일시</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  {resv.endDt}
                </div>
              </div>
              <div className="col-md-2">
                <label className="sb-form-label">수량</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  {resv.quantity}
                </div>
              </div>
              <div className="col-md-2">
                <label className="sb-form-label">반납</label>
                <div className="form-control" style={{ background: "#fafbfc" }}>
                  {returnCell(resv)}
                </div>
              </div>
              <div className="col-12">
                <label className="dd-label">비고</label>
                <div
                  className="view-val"
                  style={{
                    maxHeight: 120,
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {resv.remark || (
                    <span className="view-val-empty">
                      등록된 비고가 없습니다.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="sb-card h-100">
          <div className="sb-card__head">
            <h2>신청자</h2>
          </div>
          <div className="sb-card__body">
            <div className="sb-rowuser mb-2">
              <span className="sb-avatar">
                {(resv.empName || "").charAt(0)}
              </span>
              <div>
                <div className="fw-semibold">{resv.empName}</div>
                <div className="text-faint" style={{ fontSize: 12 }}>
                  {resv.deptName}
                </div>
              </div>
            </div>
            <label className="dd-label">신청일</label>
            <div className="view-val">{resv.createdAt}</div>

            <div className="sb-divider" style={{ margin: "16px 0" }} />

            <h3 style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>
              처리 현황
            </h3>

            {resv.status === "WAI" && (
              <div className="sb-empty" style={{ padding: "16px 0" }}>
                <p style={{ fontSize: 12.5 }}>
                  아직 처리되지 않은 대기 중인 요청입니다.
                </p>
              </div>
            )}
            {resv.status === "APP" && (
              <>
                <label className="dd-label">승인자</label>
                <div className="view-val">{resv.approvedEmpName}</div>
                <label className="dd-label mt-2">승인일시</label>
                <div className="view-val">{resv.approvedAt}</div>
              </>
            )}
            {resv.status === "REJ" && (
              <>
                <label className="dd-label">반려자</label>
                <div className="view-val">{resv.approvedEmpName}</div>
                <label className="dd-label mt-2">반려일시</label>
                <div className="view-val">{resv.approvedAt}</div>
                <label className="dd-label mt-2">반려사유</label>
                <div
                  className="view-val"
                  style={{
                    maxHeight: 100,
                    overflowY: "auto",
                    color: "var(--sb-red)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {resv.rejectReason}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { statusBadge };
