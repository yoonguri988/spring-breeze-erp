// pages/notice/detail.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, message } from "antd";
import {
  fetchNoticeDetailRequest,
  deleteNoticeRequest,
  resetNoticeState,
} from "../../reducers/notice/noticeReducer";
import api from "../../api/axios";

export default function NoticeDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { bno } = router.query;

  const { currentNotice: notice, loading, error, deleteSuccess } = useSelector(
    (state) => state.notice
  );

  const [fileObjUrl, setFileObjUrl] = useState(null);

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

  const [fileName, fileType] = notice?.bfile ? notice.bfile.split("|") : [null, null];
  const attExt = fileName ? fileName.split(".").pop().toLowerCase() : null;
  const isImage = fileType?.startsWith("image/");

  // 첨부파일을 axios로 받아와서(JWT 인증 헤더 포함) object URL로 변환
  useEffect(() => {
    if (!fileName || !bno) {
      setFileObjUrl(null);
      return;
    }

    let objectUrl;
    api
      .get(`/api/notice/${bno}/file`, { responseType: "blob" })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setFileObjUrl(objectUrl);
      })
      .catch(() => {
        message.error("첨부파일을 불러오지 못했습니다.");
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileName, bno]);

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      dispatch(deleteNoticeRequest({ bno }));
    }
  };

  let attachmentEl = null;

if (fileObjUrl) {
  if (isImage) {
    attachmentEl = (
      <div>
        <img
          src={fileObjUrl}
          alt={notice.btitle}
          className="img-fluid rounded mb-2"
          style={{ maxWidth: 500 }}
        />

        <div>
          <a
            href={fileObjUrl}
            download={fileName}
            className="btn btn-sb-soft"
          >
            <i className="bi bi-download"></i>
            {" 다운로드"}
          </a>
        </div>
      </div>
    );
  } else {
    attachmentEl = (
      <div className="d-flex align-items-center gap-2">
        {/* 파일명 */}
        <span
          title={fileName}
          style={{
            maxWidth: "350px",
            overflow: "hidden",
            minWidth: 0,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <i className="bi bi-paperclip"></i>{" "}
          {fileName}
        </span>

        {/* 다운로드 */}
        <a
          href={fileObjUrl}
          download={fileName}
          className="btn btn-sb-soft"
        >
          <i className="bi bi-download"></i>
          {" 다운로드"}
        </a>
      </div>
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