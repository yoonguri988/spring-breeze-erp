// pages/notice/detail.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, message } from "antd";
import {
  fetchNoticeDetailRequest,
  deleteNoticeRequest,
  resetNoticeState,
} from "../../reducers/notice/noticeReducer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function NoticeDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { bno } = router.query;

  const { currentNotice: notice, loading, error, deleteSuccess } = useSelector(
    (state) => state.notice
  );

  useEffect(() => {
    if (bno) {
      dispatch(fetchNoticeDetailRequest({ bno }));
    }
    return () => {
      dispatch(resetNoticeState());
    };
  }, [dispatch, bno]);

  useEffect(() => {
    if (deleteSuccess) {
      message.success("공지사항이 삭제되었습니다.");
      dispatch(resetNoticeState());
      router.push("/notice/list");
    }
  }, [deleteSuccess, router, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      dispatch(deleteNoticeRequest({ bno }));
    }
  };

  const attExt = notice?.bfile ? notice.bfile.split(".").pop().toLowerCase() : null;
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(attExt);
  const fileUrl = notice?.bfile ? `${API_BASE}${notice.bfile}` : null;

  let attachmentEl = null;
  if (fileUrl) {
    if (isImage) {
      attachmentEl = React.createElement("img", {
        src: fileUrl,
        alt: notice.btitle,
        className: "img-fluid rounded",
        style: { maxWidth: 500 },
      });
    } else {
      attachmentEl = React.createElement(
        "a",
        {
          href: fileUrl,
          className: "btn btn-sb-soft",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        React.createElement("i", { className: "bi bi-download" }),
        ` 첨부파일 다운로드 (.${attExt})`
      );
    }
  }

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link>
            <i className="bi bi-chevron-right"></i>
            업무
            <i className="bi bi-chevron-right"></i>
            <Link href="/notice/list">공지 관리</Link>
            <i className="bi bi-chevron-right"></i>
            상세보기
          </div>
          <h1>공지 상세</h1>
          <p>공지사항 내용을 확인합니다.</p>
        </div>
      </div>

      <div className="sb-card mb-3">
        <div className="sb-card__body">
          <div className="mb-3">
            <label className="sb-form-label">제목</label>
            <input type="text" className="form-control" value={notice?.btitle || ""} readOnly />
          </div>
          <div className="mb-3">
            <label className="sb-form-label">내용</label>
            <textarea className="form-control" rows={10} readOnly value={notice?.bcontent || ""} />
          </div>

          {notice?.bfile && (
            <div className="mb-3">
              <label className="sb-form-label">첨부파일</label>
              <div className="mt-2">{attachmentEl}</div>
            </div>
          )}
        </div>

        <div className="sb-card__footer d-flex justify-content-end gap-2 mb-3 pe-3">
          <Button type="default" className="btn btn-sb-soft" onClick={() => router.push(`/notice/edit?bno=${bno}`)}>
            <i className="bi bi-pencil-square"></i>
            수정
          </Button>
          <Button type="default" className="btn btn-outline-danger" loading={loading} onClick={handleDelete}>
            <i className="bi bi-trash"></i>
            삭제
          </Button>
          <Button type="default" className="btn btn-sb" onClick={() => router.push("/notice/list")}>
            <i className="bi bi-list"></i>
            목록
          </Button>
        </div>
      </div>
    </main>
  );
}