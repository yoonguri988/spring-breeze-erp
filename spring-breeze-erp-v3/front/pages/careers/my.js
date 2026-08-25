// pages/careers/my.js
// 채용 공개 사이트 - 내 지원현황 (GET /api/public/applicant/me, DELETE /{apctId})
// + 지원건별 이력서(PDF) 업로드/재제출 (POST /api/public/resume)
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {
  List,
  Tag,
  Button,
  Empty,
  Skeleton,
  Modal,
  Upload,
  message,
  Popconfirm,
} from "antd";
import { InboxOutlined, FilePdfOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

import ApplicantLayout from "../../components/ApplicantLayout";
import {
  fetchMyApplicationsRequest,
  cancelApplicationRequest,
  resetApplicantPublicState,
} from "../../reducers/apct/applicantPublicReducer";
import {
  uploadResumeRequest,
  resetResumePublicState,
} from "../../reducers/rsm/resumePublicReducer";

const STATUS_LABEL = {
  RECEIVED: { text: "접수", color: "default" },
  SCREENING: { text: "서류심사", color: "blue" },
  INTERVIEW: { text: "면접", color: "purple" },
  HIRED: { text: "합격", color: "green" },
  REJECTED: { text: "불합격", color: "red" },
};

export default function CareersMyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { apctAccessToken } = useSelector((state) => state.apctAuth);
  const { myApplications, myApplicationsLoading, cancelLoading, cancelSuccess, cancelError } =
    useSelector((state) => state.applicantPublic);
  const { uploadLoading, uploadSuccess, uploadError } = useSelector(
    (state) => state.resumePublic,
  );

  const [uploadTarget, setUploadTarget] = useState(null); // apctId | null
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!apctAccessToken) return;
    dispatch(fetchMyApplicationsRequest());
    // 지원 직후(/careers/apply → ?apctId=)로 넘어온 경우 바로 업로드 모달을 띄워준다.
    if (router.query.apctId) {
      setUploadTarget(Number(router.query.apctId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apctAccessToken]);

  useEffect(() => {
    if (cancelLoading) return;
    if (cancelSuccess) {
      message.success("지원이 취소되었습니다.");
      dispatch(resetApplicantPublicState());
    } else if (cancelError) {
      message.error(cancelError);
      dispatch(resetApplicantPublicState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelLoading, cancelSuccess, cancelError]);

  useEffect(() => {
    if (uploadLoading) return;
    if (uploadSuccess) {
      message.success("이력서가 제출되었습니다. AI 분석 후 담당자에게 전달됩니다.");
      closeUploadModal();
    } else if (uploadError) {
      message.error(uploadError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadLoading, uploadSuccess, uploadError]);

  const closeUploadModal = () => {
    setUploadTarget(null);
    setFileList([]);
    dispatch(resetResumePublicState());
  };

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.warning("업로드할 이력서(PDF) 파일을 선택해 주세요.");
      return;
    }
    dispatch(
      uploadResumeRequest({ apctId: uploadTarget, file: fileList[0].originFileObj || fileList[0] }),
    );
  };

  const handleCancel = (apctId) => {
    dispatch(cancelApplicationRequest(apctId));
  };

  return (
    <ApplicantLayout>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#14251f", marginBottom: 6 }}>
          내 지원현황
        </h1>
        <p style={{ color: "#778", fontSize: 14 }}>
          지원한 공고의 진행 상태를 확인하고 이력서를 제출/재제출할 수 있습니다.
        </p>
      </div>

      {myApplicationsLoading && <Skeleton active paragraph={{ rows: 4 }} />}

      {!myApplicationsLoading && myApplications.length === 0 && (
        <Empty description="아직 지원한 공고가 없습니다." style={{ padding: "60px 0" }} />
      )}

      {!myApplicationsLoading && myApplications.length > 0 && (
        <List
          itemLayout="horizontal"
          dataSource={myApplications}
          renderItem={(item) => {
            const meta = STATUS_LABEL[item.apctStatus] || { text: item.apctStatus, color: "default" };
            const isFinal = item.apctStatus === "HIRED" || item.apctStatus === "REJECTED";
            return (
              <List.Item
                style={{
                  background: "#fff",
                  border: "1px solid #e6ebe8",
                  borderRadius: 10,
                  padding: "16px 20px",
                  marginBottom: 10,
                }}
                actions={[
                  <Button
                    key="upload"
                    size="small"
                    icon={<FilePdfOutlined />}
                    onClick={() => setUploadTarget(item.apctId)}
                  >
                    이력서 제출/재제출
                  </Button>,
                  !isFinal ? (
                    <Popconfirm
                      key="cancel"
                      title="지원을 취소하시겠습니까?"
                      okText="취소하기"
                      cancelText="닫기"
                      onConfirm={() => handleCancel(item.apctId)}
                    >
                      <Button size="small" danger icon={<DeleteOutlined />} loading={cancelLoading}>
                        지원 취소
                      </Button>
                    </Popconfirm>
                  ) : null,
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  title={
                    <span>
                      {item.recTitle} <Tag color={meta.color}>{meta.text}</Tag>
                    </span>
                  }
                  description={
                    item.apctDate
                      ? `지원일 ${moment(item.apctDate).format("YYYY-MM-DD")}`
                      : undefined
                  }
                />
              </List.Item>
            );
          }}
        />
      )}

      <Modal
        title="이력서(PDF) 업로드"
        open={uploadTarget !== null}
        onCancel={closeUploadModal}
        onOk={handleUpload}
        okText="제출"
        cancelText="닫기"
        okButtonProps={{ loading: uploadLoading }}
        destroyOnClose
      >
        <Upload.Dragger
          accept="application/pdf"
          maxCount={1}
          fileList={fileList}
          beforeUpload={() => false}
          onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
          onRemove={() => setFileList([])}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">클릭하거나 파일을 이 영역에 끌어다 놓으세요</p>
          <p className="ant-upload-hint">PDF 파일 1개만 업로드할 수 있습니다. 기존 이력서는 자동으로 교체됩니다.</p>
        </Upload.Dragger>
      </Modal>
    </ApplicantLayout>
  );
}
