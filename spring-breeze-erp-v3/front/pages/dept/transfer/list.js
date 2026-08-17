// pages/dept/transfer/list.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Select, message } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  WarningFilled,
} from "@ant-design/icons";

import {
  fetchImpactRequest,
  executeTransferRequest,
  cancelTransferRequest,
  resetDeptTransferState,
} from "../../../reducers/dept/deptTransferReducer";

export default function DeptTransferListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { impact, loading, error, success } = useSelector(
    (state) => state.deptTransfer,
  );

  const deptId = router.query.deptId ? String(router.query.deptId) : "";

  const [targets, setTargets] = useState({}); // { [empId]: deptId }
  const [bulkTarget, setBulkTarget] = useState(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const prevLoading = useRef(false);

  useEffect(() => {
    if (!router.isReady || !deptId) return;
    dispatch(fetchImpactRequest(deptId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, deptId]);

  useEffect(() => {
    if (!submitting) return;
    if (success) {
      message.success("이관이 완료되었습니다.");
      setSubmitting(false);
      dispatch(resetDeptTransferState());
      router.push(
        "/dept/list" + (impact?.comId ? `?comId=${impact.comId}` : ""),
      );
    } else if (error) {
      message.error(error);
      setSubmitting(false);
      dispatch(resetDeptTransferState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, submitting]);

  useEffect(() => {
    if (!canceling) return;
    if (success) {
      message.success("이관이 취소되고 부서가 원복되었습니다.");
      setCanceling(false);
      dispatch(resetDeptTransferState());
      router.push("/dept/transfer/pending");
    } else if (error) {
      message.error(error);
      setCanceling(false);
      dispatch(resetDeptTransferState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, canceling]);

  const employees = impact?.employees || [];
  const candidates = useMemo(
    () =>
      (impact?.candidates || []).map((c) => ({
        value: String(c.deptId),
        label: c.deptName,
      })),
    [impact],
  );

  const allFilled =
    employees.length === 0 || employees.every((e) => targets[e.empId]);

  const applyToAll = (deptIdValue) => {
    if (!deptIdValue) return;
    const next = {};
    employees.forEach((e) => {
      next[e.empId] = deptIdValue;
    });
    setTargets(next);
  };

  const handleApplyAi = () => {
    if (!impact?.aiRecom) return;
    setBulkTarget(String(impact.aiRecom.targetDeptId));
    applyToAll(String(impact.aiRecom.targetDeptId));
  };

  const handleCancelTransfer = () => {
    Modal.confirm({
      title: "이관 취소",
      content: "이관을 취소하고 부서를 원래 상태(ACTIVE)로 되돌리시겠습니까?",
      okText: "취소하기",
      okButtonProps: { danger: true },
      cancelText: "닫기",
      onOk: () => {
        setCanceling(true);
        dispatch(cancelTransferRequest(deptId));
      },
    });
  };

  const handleSubmit = () => {
    if (!allFilled) return;
    const aiTargetId = impact?.aiRecom
      ? String(impact.aiRecom.targetDeptId)
      : null;
    const items = employees
      .filter((e) => targets[e.empId])
      .map((e) => ({
        empId: e.empId,
        newDeptId: targets[e.empId],
        aiRecommended:
          aiTargetId && targets[e.empId] === aiTargetId ? "Y" : "N",
      }));
    setSubmitting(true);
    dispatch(
      executeTransferRequest({
        deptId,
        items,
        aiReason: impact?.aiRecom?.reason || "",
        snapshotText: impact?.snapshotText || "",
      }),
    );
  };

  if (!impact) return null;

  return (
    <div className="sb-content">
      {/* 상단 안내 배너 */}
      <div className="sb-card mb-3">
        <div
          className="my-dept-banner"
          style={{
            background: "var(--sb-amber-soft)",
            borderColor: "var(--sb-amber)",
            color: "var(--sb-amber)",
          }}
        >
          <WarningFilled />
          <span>
            <b>{impact.deptName}</b>{" "}
            <span className="dept-code-chip">{impact.deptCode}</span> 부서는
            현재 <b>이관 대기(PENDING_DELETE)</b> 상태입니다. 아래 소속 사원을
            모두 다른 부서로 이관해야 부서 삭제가 최종 완료됩니다.
          </span>
        </div>
      </div>

      {/* AI 추천 카드 */}
      {impact.aiRecom && (
        <div
          className="sb-card mb-3"
          style={{ borderLeft: "4px solid var(--sb-accent)" }}
        >
          <div
            style={{
              padding: "14px 18px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <ThunderboltOutlined
              style={{ fontSize: 20, color: "var(--sb-accent)" }}
            />
            <div style={{ flex: 1 }}>
              <div className="fw-semibold mb-1">
                AI 추천 부서: {impact.aiRecom.targetDeptName}
              </div>
              <div style={{ fontSize: 13, color: "var(--sb-ink-soft)" }}>
                {impact.aiRecom.reason}
              </div>
              <Button
                size="small"
                className="mt-2"
                icon={<ThunderboltOutlined />}
                onClick={handleApplyAi}
              >
                이 추천을 전체 사원에 적용
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 영향도 요약 */}
      <div className="sb-card mb-3">
        <div className="d-flex flex-wrap gap-3 p-3">
          <div className="depth-info-box">
            <TeamOutlined style={{ color: "var(--sb-accent)" }} />
            소속 사원 <span className="depth-val">{impact.employeeCount}</span>
            명
          </div>
          <div className="depth-info-box">
            <CalendarOutlined style={{ color: "var(--sb-cyan)" }} />
            미처리 예약{" "}
            <span className="depth-val">{impact.reservationCount}</span>건
          </div>
          <div className="depth-info-box">
            <FileTextOutlined style={{ color: "var(--sb-violet)" }} />
            결재 대기(라인){" "}
            <span className="depth-val">{impact.apprLineCount}</span>건
          </div>
          <div className="depth-info-box">
            <FileTextOutlined style={{ color: "var(--sb-green)" }} />
            상신 진행중 <span className="depth-val">{impact.apprDocCount}</span>
            건
          </div>
        </div>
        <div
          className="px-3 pb-3"
          style={{ fontSize: 12, color: "var(--sb-ink-faint)" }}
        >
          <InfoCircleOutlined /> 예약·결재 항목은 사원(emp_id) 기준으로 따라가는
          구조라 별도 이관 작업 없이 사원의 소속 부서만 변경하면 자동으로 함께
          이동합니다. 아래 목록은 참고용입니다.
        </div>
      </div>

      {/* 이관 폼 */}
      <div className="sb-card">
        <div className="sb-toolbar">
          <span className="fw-semibold">소속 사원 이관</span>
          <div className="grow" />
          <Select
            style={{ minWidth: 220 }}
            placeholder="일괄 적용할 부서 선택"
            options={candidates}
            value={bulkTarget}
            onChange={setBulkTarget}
          />
          <Button size="small" onClick={() => applyToAll(bulkTarget)}>
            전체 적용
          </Button>
        </div>

        <div className="sb-card__body--flush">
          {employees.length > 0 ? (
            <table className="sb-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>NO</th>
                  <th style={{ width: 120 }}>사번</th>
                  <th style={{ minWidth: 120 }}>이름</th>
                  <th style={{ width: 120 }}>직급</th>
                  <th style={{ minWidth: 220 }}>이관할 부서</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp.empId}>
                    <td className="tnum">{idx + 1}</td>
                    <td>
                      <span className="dept-code-chip">{emp.empNo}</span>
                    </td>
                    <td>{emp.empName}</td>
                    <td>{emp.posName}</td>
                    <td>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="이관할 부서 선택"
                        options={candidates}
                        value={targets[emp.empId]}
                        onChange={(value) =>
                          setTargets((prev) => ({
                            ...prev,
                            [emp.empId]: value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="sb-empty">
              <TeamOutlined style={{ fontSize: 30, opacity: 0.5 }} />
              <p>소속 사원이 없습니다. 바로 삭제를 완료할 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          icon={<CloseCircleOutlined />}
          onClick={handleCancelTransfer}
          loading={canceling && loading}
        >
          이관 취소 (부서 원복)
        </Button>
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          disabled={!allFilled}
          loading={submitting && loading}
          onClick={handleSubmit}
        >
          이관 완료
        </Button>
      </div>

      {/* 참고용 상세 : 미처리 예약 */}
      {impact.reservationCount > 0 && (
        <div className="sb-card mt-3">
          <div className="sb-toolbar">
            <span className="fw-semibold">미처리 예약 (참고용)</span>
          </div>
          <div className="sb-card__body--flush">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>사원</th>
                  <th>자원</th>
                  <th>상태</th>
                  <th>장비예약시작일</th>
                  <th>장비예약종료일</th>
                </tr>
              </thead>
              <tbody>
                {(impact.reservations || []).map((r, i) => (
                  <tr key={i}>
                    <td>{r.empName}</td>
                    <td>{r.resName}</td>
                    <td>
                      <span className="sb-badge sb-badge--amber">
                        {r.status}
                      </span>
                    </td>
                    <td>{r.startDt}</td>
                    <td>{r.endDt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 참고용 상세 : 결재 대기 라인 */}
      {impact.apprLineCount > 0 && (
        <div className="sb-card mt-3">
          <div className="sb-toolbar">
            <span className="fw-semibold">결재 대기 라인 (참고용)</span>
          </div>
          <div className="sb-card__body--flush">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>사원</th>
                  <th>문서명</th>
                  <th>결재순서</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {(impact.apprLines || []).map((l, i) => (
                  <tr key={i}>
                    <td>{l.empName}</td>
                    <td>{l.docTitle}</td>
                    <td>{l.linOrder}</td>
                    <td>
                      <span className="sb-badge sb-badge--violet">
                        {l.linStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 참고용 상세 : 상신 진행중 결재문서 */}
      {impact.apprDocCount > 0 && (
        <div className="sb-card mt-3">
          <div className="sb-toolbar">
            <span className="fw-semibold">상신 진행중 결재문서 (참고용)</span>
          </div>
          <div className="sb-card__body--flush">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>사원</th>
                  <th>문서명</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {(impact.apprDocs || []).map((d, i) => (
                  <tr key={i}>
                    <td>{d.empName}</td>
                    <td>{d.docTitle}</td>
                    <td>
                      <span className="sb-badge sb-badge--green">
                        {d.docStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
