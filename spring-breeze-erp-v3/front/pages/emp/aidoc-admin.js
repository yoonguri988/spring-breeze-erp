// pages/emp/aidoc-admin.js
// HR 규정 문서(근태·연차·복리후생 규정집 PDF) 관리 페이지 (ROLE_ADMIN)
// GET/POST /api/hrai/docs — 업로드 시 기존 활성 문서는 자동 이력 처리(actv=false)되고
// 새 버전이 청킹+임베딩되어 RAG 검색 대상에 반영된다.
// sal/aidoc-admin.js(급여 규정 문서 관리)와 동일한 구조.
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Table, Button, Tag, Modal, Form,
  Input, Upload, message, Alert, } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

import {
  listHrAiDocRequest, uploadHrAiDocRequest, resetHrAiDocState,
} from "../../reducers/emp/hrAiDocReducer";

export default function HrAiDocAdminPage() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // ── Redux 스토어에서 HR 문서 관리 상태 구독 ──
  const {
    docList, // 문서 목록 배열
    listLoading, // 목록 조회 로딩
    listError, // 목록 조회 에러
    uploadLoading, // 업로드 진행 중
    uploadSuccess, // 업로드 성공 여부
    uploadError, // 업로드 에러 메시지
  } = useSelector((state) => state.hrAiDoc);

  const [modalOpen, setModalOpen] = useState(false); // 등록 모달 열림/닫힘
  const [fileList, setFileList] = useState([]); // 선택된 파일 목록 (최대 1개)

  // ── 마운트 시 문서 목록 조회, 언마운트 시 상태 초기화 ──
  useEffect(() => {
    dispatch(listHrAiDocRequest());
    return () => {
      dispatch(resetHrAiDocState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // ── 업로드 결과 처리: 성공 시 모달 닫기 + 목록 재조회, 실패 시 에러 표시 ──
  useEffect(() => {
    if (!uploadLoading) {
      if (uploadSuccess) {
        message.success(
          "HR 규정 문서가 등록되었습니다. 새 버전이 즉시 AI 답변에 반영됩니다.",
        );
        closeModal();
        dispatch(resetHrAiDocState());
        dispatch(listHrAiDocRequest()); // 목록 갱신
      } else if (uploadError) {
        message.error(uploadError);
        dispatch(resetHrAiDocState());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadLoading, uploadSuccess, uploadError]);

  // ── 모달 열기/닫기 ──
  const openModal = () => {
    setModalOpen(true);
    form.resetFields();
    setFileList([]);
  };
  const closeModal = () => {
    setModalOpen(false);
    setFileList([]);
    form.resetFields();
  };

  // ── 업로드 실행: 폼 검증 → 파일 확인 → dispatch ──
  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      if (fileList.length === 0) {
        message.warning("업로드할 PDF 파일을 선택해 주세요.");
        return;
      }
      dispatch(
        uploadHrAiDocRequest({
          file: fileList[0].originFileObj, // Ant Upload에서 실제 File 객체 꺼내기
          title: values.title,
        }),
      );
    } catch (e) {
      // 폼 자체 검증 실패 — antd가 알아서 에러 표시
    }
  };

  // ── 테이블 컬럼 정의 ──
  const columns = [
    {
      title: "버전",
      dataIndex: "docVersion",
      key: "docVersion",
      width: 80,
      align: "center",
      render: (v) => <b>v{v}</b>,
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "원본 파일명",
      dataIndex: "srcFileName",
      key: "srcFileName",
    },
    {
      title: "조항(청크) 수",
      dataIndex: "chunkCount",
      key: "chunkCount",
      width: 110,
      align: "center",
    },
    {
      title: "상태",
      dataIndex: "actv",
      key: "actv",
      width: 100,
      align: "center",
      render: (v) =>
        v ? <Tag color="green">사용중</Tag> : <Tag>이전 버전</Tag>,
    },
    {
      title: "등록일시",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (v) => (v ? moment(v).format("YYYY-MM-DD HH:mm") : "-"),
    },
  ];

  return (
    <div className="sb-page">
      {/* ── 페이지 헤더: 브레드크럼 + 제목 + 등록 버튼 ── */}
      <div
        className="sb-page-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            인사관리 &gt; AI 사내 규정 Q&amp;A &gt; 규정 문서 관리
          </div>
          <h1>사내 규정 문서 관리</h1>
          <p>
            사내 규정집(근태·연차·복리후생 등 PDF)을 등록하면 조항 단위로
            청킹·임베딩되어 AI 챗봇 답변의 근거로 사용됩니다.
          </p>
        </div>
        <div className="sb-page-head__actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            문서 등록(개정)
          </Button>
        </div>
      </div>

      {/* ── 안내 알림 ── */}
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="새 문서를 등록하면 기존 사용중 문서는 자동으로 이전 버전 처리되고, 새 문서가 즉시 AI 답변의 검색 대상이 됩니다."
      />

      {/* ── 문서 목록 테이블 ── */}
      <Card>
        <Table
          rowKey="docId"
          columns={columns}
          dataSource={docList}
          loading={listLoading}
          pagination={false}
          locale={{ emptyText: "등록된 사내 규정 문서가 없습니다." }}
        />
        {listError && (
          <p style={{ color: "red", marginTop: 12 }}>{listError}</p>
        )}
      </Card>

      {/* ── 문서 등록(개정) 모달 ── */}
      <Modal
        title="사내 규정 문서 등록(개정)"
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleUpload}
        okText="등록"
        okButtonProps={{ loading: uploadLoading }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="문서 제목(선택)">
            <Input
              placeholder="예: 2026년 사내 규정집 (생략 시 원본 파일명 사용)"
              maxLength={100}
            />
          </Form.Item>
          <Form.Item
            label="PDF 파일"
            required
            extra="PDF만 업로드 가능하며 최대 5MB까지 등록할 수 있습니다."
          >
            <Upload
              accept="application/pdf"
              beforeUpload={(file) => {
                // PDF 타입 검증
                const isPdf = file.type === "application/pdf";
                if (!isPdf) {
                  message.error("PDF 파일만 업로드할 수 있습니다.");
                  return Upload.LIST_IGNORE; // 목록에 추가하지 않음
                }
                // 파일 크기 검증 (5MB)
                const isUnder5MB = file.size / 1024 / 1024 < 5;
                if (!isUnder5MB) {
                  message.error("파일 크기는 5MB를 넘을 수 없습니다.");
                  return Upload.LIST_IGNORE;
                }
                return false; // 자동 업로드 방지 — 폼 제출 시 수동 전송
              }}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList.slice(-1))} // 1개만 유지
              onRemove={() => setFileList([])}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>파일 선택</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
