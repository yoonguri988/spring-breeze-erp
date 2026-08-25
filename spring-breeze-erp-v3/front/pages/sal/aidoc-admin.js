// pages/sal/ai-doc-admin.js
// AI 급여 Q&A 근거 문서(급여 규정집/수당기준/연말정산 가이드 PDF) 관리 (ROLE_ADMIN)
// GET/POST /api/salai/docs — 업로드 시 기존 활성 문서는 자동 이력 처리(actv=false)되고
// 새 버전이 청킹+임베딩되어 RAG 검색 대상에 반영된다.
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Alert,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

import {
  listSalAiDocRequest,
  uploadSalAiDocRequest,
  resetSalAiDocState,
} from "../../reducers/sal/salAiDocReducer";

export default function SalAiDocAdminPage() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    docList,
    listLoading,
    listError,
    uploadLoading,
    uploadSuccess,
    uploadError,
  } = useSelector((state) => state.salAiDoc);

  const [modalOpen, setModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    dispatch(listSalAiDocRequest());
    return () => dispatch(resetSalAiDocState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!uploadLoading) {
      if (uploadSuccess) {
        message.success("급여 규정 문서가 등록되었습니다. 새 버전이 즉시 AI 답변에 반영됩니다.");
        closeModal();
        dispatch(resetSalAiDocState());
        dispatch(listSalAiDocRequest());
      } else if (uploadError) {
        message.error(uploadError);
        dispatch(resetSalAiDocState());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadLoading, uploadSuccess, uploadError]);

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

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      if (fileList.length === 0) {
        message.warning("업로드할 PDF 파일을 선택해 주세요.");
        return;
      }
      dispatch(
        uploadSalAiDocRequest({
          file: fileList[0].originFileObj,
          title: values.title,
        }),
      );
    } catch (e) {
      // 폼 자체 검증 실패
    }
  };

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
            급여관리 &gt; AI 급여 Q&amp;A &gt; 근거 문서 관리
          </div>
          <h1>급여 규정 문서 관리</h1>
          <p>
            급여 규정집·수당 기준·연말정산 가이드(PDF)를 등록하면 조항 단위로
            청킹·임베딩되어 AI 챗봇 답변의 근거로 사용됩니다.
          </p>
        </div>
        <div className="sb-page-head__actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            문서 등록(개정)
          </Button>
        </div>
      </div>

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="새 문서를 등록하면 기존 사용중 문서는 자동으로 이전 버전 처리되고, 새 문서가 즉시 AI 답변의 검색 대상이 됩니다."
      />

      <Card>
        <Table
          rowKey="docId"
          columns={columns}
          dataSource={docList}
          loading={listLoading}
          pagination={false}
          locale={{ emptyText: "등록된 급여 규정 문서가 없습니다." }}
        />
        {listError && (
          <p style={{ color: "red", marginTop: 12 }}>{listError}</p>
        )}
      </Card>

      <Modal
        title="급여 규정 문서 등록(개정)"
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
            <Input placeholder="예: 2026년 급여 규정집 (생략 시 원본 파일명 사용)" maxLength={100} />
          </Form.Item>
          <Form.Item
            label="PDF 파일"
            required
            extra="PDF만 업로드 가능하며 최대 5MB까지 등록할 수 있습니다."
          >
            <Upload
              accept="application/pdf"
              beforeUpload={(file) => {
                const isPdf = file.type === "application/pdf";
                if (!isPdf) {
                  message.error("PDF 파일만 업로드할 수 있습니다.");
                  return Upload.LIST_IGNORE;
                }
                const isUnder5MB = file.size / 1024 / 1024 < 5;
                if (!isUnder5MB) {
                  message.error("파일 크기는 5MB를 넘을 수 없습니다.");
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList.slice(-1))}
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
