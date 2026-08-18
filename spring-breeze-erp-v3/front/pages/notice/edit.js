// pages/notice/edit.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  fetchNoticeDetailRequest,
  updateNoticeRequest,
  resetNoticeState,
} from "../../reducers/notice/noticeReducer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function NoticeEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { bno } = router.query;
  const { currentNotice: notice, loading, error, success } = useSelector(
    (state) => state.notice
  );

  const [btitle, setBtitle] = useState("");
  const [bcontent, setBcontent] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (bno) {
      dispatch(fetchNoticeDetailRequest({ bno }));
    }
    return () => {
      dispatch(resetNoticeState());
    };
  }, [dispatch, bno]);

  useEffect(() => {
    if (notice) {
      setBtitle(notice.btitle || "");
      setBcontent(notice.bcontent || "");
    }
  }, [notice]);

  useEffect(() => {
    if (success) {
      message.success("공지사항이 성공적으로 수정되었습니다.");
      setFileList([]);
      dispatch(resetNoticeState());
      router.push(`/notice/detail?bno=${bno}`);
    }
  }, [success, router, dispatch, bno]);

  const onFinish = () => {
    if (!btitle.trim()) {
      message.warning("제목을 입력해주세요.");
      return;
    }
    if (!bcontent.trim()) {
      message.warning("내용을 입력해주세요.");
      return;
    }

    const dto = { btitle, bcontent };
    const file = fileList.length > 0 ? fileList[0].originFileObj : null;

    dispatch(updateNoticeRequest({ bno, dto, file }));
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const attExt = notice?.bfile ? notice.bfile.split(".").pop().toLowerCase() : null;
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(attExt);
  const fileUrl = notice?.bfile ? `${API_BASE}${notice.bfile}` : null;

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
            공지 수정
          </div>
          <h1>공지 수정</h1>
          <p>등록된 공지사항의 내용을 수정합니다.</p>
        </div>
      </div>

      <div className="sb-card mb-3">
        <div className="sb-card__body">
          <form id="noticeEditForm" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="btitle" className="sb-form-label"> 제목 </label>
                <Input
                  id="btitle"
                  name="btitle"
                  className="form-control"
                  value={btitle}
                  onChange={(e) => setBtitle(e.target.value)}
                  placeholder="공지 제목을 입력하세요"
                />
              </div>

              <div className="col-12">
                <label htmlFor="bcontent" className="sb-form-label"> 내용 </label>
                <Input.TextArea
                  id="bcontent"
                  name="bcontent"
                  className="form-control"
                  value={bcontent}
                  onChange={(e) => setBcontent(e.target.value)}
                  rows={8}
                  placeholder="공지 내용을 입력하세요"
                />
              </div>

              {notice?.bfile && (
                <div className="col-12">
                  <label className="sb-form-label">기존 첨부파일</label>
                  <div className="mt-1">
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={notice.btitle}
                        className="img-fluid rounded"
                        style={{ maxWidth: 200 }}
                      />
                    ) : (
                      <a href={fileUrl} className="btn btn-sb-soft btn-sm" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-paperclip"></i>
                        현재 첨부파일 보기 (.{attExt})
                      </a>
                    )}
                  </div>
                  <div className="form-text">새 파일을 첨부하면 기존 첨부파일은 교체(삭제)됩니다.</div>
                </div>
              )}

              <div className="col-12">
                <label htmlFor="file" className="sb-form-label"> 파일 첨부 </label>
                <Upload
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={handleChange}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>파일 선택</Button>
                </Upload>
                <div className="form-text"> 이미지 · pdf · office 문서 · hwp · zip, 최대 10MB (선택사항) </div>
              </div>
            </div>

            <div className="sb-form-actions mt-4 mb-4 pe-2 text-end">
              <Button type="default" className="btn btn-ghost" onClick={() => router.push(`/notice/detail?bno=${bno}`)}>
                취소
              </Button>
              <Button type="default" className="btn btn-sb-soft" onClick={() => router.push("/notice/list")}>
                목록
              </Button>
              <Button
                type="default"
                className="btn btn-sb"
                htmlType="button"
                loading={loading}
                onClick={onFinish}
              >
                <i className="bi bi-pencil-square"></i>
                수정
              </Button>
            </div>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </main>
  );
}