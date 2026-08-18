// pages/resv/detail.js
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button, message } from "antd";
import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";

import {
  fetchResvDetailRequest,
  cancelResvRequest,
  resetResvState,
} from "../../reducers/resv/resvReducer";
import ResvDetailView, { statusBadge } from "../../components/ResvDetailView";
import CancelResvModal from "../../components/CancelResvModal";

export default function ResvDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    detail: resv,
    loading,
    error,
    success,
  } = useSelector((state) => state.resv);
  const { user } = useSelector((state) => state.auth);

  const revId = router.query.revId ? String(router.query.revId) : "";
  const isSelf = !!(
    resv &&
    user?.empId &&
    String(resv.empId) === String(user.empId)
  );

  const [cancelTarget, setCancelTarget] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const prevLoading = useRef(false);

  useEffect(() => {
    if (!router.isReady || !revId) return;
    dispatch(fetchResvDetailRequest(revId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, revId]);

  useEffect(() => {
    if (!canceling) return;
    if (prevLoading.current && !loading) {
      if (success) {
        message.success("예약이 취소되었습니다.");
        setCancelTarget(null);
        setCanceling(false);
        dispatch(resetResvState());
        router.push("/resv/my");
      } else if (error) {
        message.error(error);
        setCanceling(false);
        dispatch(resetResvState());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, canceling]);

  useEffect(() => {
    prevLoading.current = loading;
  }, [loading]);

  if (!resv) return null;

  const showActions = resv.status === "WAI" && isSelf;

  const confirmCancel = () => {
    if (!cancelTarget) return;
    setCanceling(true);
    dispatch(cancelResvRequest(cancelTarget.revId));
  };

  return (
    <div className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link> <span>&gt;</span>
            <Link href="/resv/my?status=WAI">내 자원 요청 관리</Link>{" "}
            <span>&gt;</span>
            예약 상세
          </div>
          <h1>
            예약 ID {resv.revId}{" "}
            <span className="ms-2">{statusBadge(resv.status)}</span>
          </h1>
          <p>{resv.resName}</p>
        </div>
        <div className="sb-page-head__actions">
          <div className="d-flex gap-2">
            {showActions && (
              <>
                <Link
                  href={{
                    pathname: "/resv/edit",
                    query: { revId: resv.revId },
                  }}
                >
                  <Button icon={<EditOutlined />}>
                    수정
                  </Button>
                </Link>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() =>
                    setCancelTarget({
                      revId: resv.revId,
                      resName: resv.resName,
                    })
                  }
                >
                  취소
                </Button>
              </>
            )}
            <Link href="/resv/my">
              <Button icon={<ArrowLeftOutlined />}>
                목록으로
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ResvDetailView resv={resv} />

      <CancelResvModal
        target={cancelTarget}
        open={!!cancelTarget}
        loading={canceling && loading}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
      />
    </div>
  );
}
