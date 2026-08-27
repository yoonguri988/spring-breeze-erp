// pages/careers/my.js
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
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import { InboxOutlined, FilePdfOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import apctApi from "../../api/apctAxios";

import ApplicantLayout from "../../components/ApplicantLayout";
import {
  fetchMyApplicationsRequest,
  cancelApplicationRequest,
  updateApplicationRequest,
  resetApplicantPublicState,
} from "../../reducers/apct/applicantPublicReducer";
import {
  uploadResumeRequest,
  resetResumePublicState,
} from "../../reducers/rsm/resumePublicReducer";

const STATUS_LABEL = {
  RECEIVED: { text: "접수", color: "st-default" },
  SCREENING: { text: "서류심사", color: "st-blue" },
  INTERVIEW: { text: "면접", color: "st-purple" },
  HIRED: { text: "합격", color: "st-green" },
  REJECTED: { text: "불합격", color: "st-red" },
};

export default function CareersMyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { apctAccessToken } = useSelector((state) => state.apctAuth);
  const { myApplications, myApplicationsLoading, cancelLoading, cancelSuccess, cancelError, updateLoading, updateSuccess, updateError } =
    useSelector((state) => state.applicantPublic);
  const { uploadLoading, uploadSuccess, uploadError } = useSelector(
    (state) => state.resumePublic,
  );

  const [uploadTarget, setUploadTarget] = useState(null); // apctId | null
  const [fileList, setFileList] = useState([]);

  const [editTarget, setEditTarget] = useState(null); // apctId | null
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (!apctAccessToken) return;
    dispatch(fetchMyApplicationsRequest());
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
    if (updateLoading) return;
    if (updateSuccess) {
      message.success("지원 정보가 수정되었습니다.");
      closeEditModal();
    } else if (updateError) {
      message.error(updateError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLoading, updateSuccess, updateError]);

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

  const openEditModal = (item) => {
    setEditTarget(item.apctId);
    editForm.setFieldsValue({
      apctName: item.apctName,
      apctEmail: item.apctEmail,
      apctPhone: item.apctPhone,
    });
  };

  const closeEditModal = () => {
    setEditTarget(null);
    editForm.resetFields();
    dispatch(resetApplicantPublicState());
  };

  const handleEditSubmit = () => {
    editForm.validateFields().then((values) => {
      dispatch(
        updateApplicationRequest({
          apctId: editTarget,
          ...values,
        }),
      );
    });
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
  // 이력서 미리보기
  const handlePreviewResume = async (apctId) => {
    try {
      const response = await apctApi.get(`/api/public/resume/my/${apctId}/preview`, {
        responseType: "blob",
      });
      const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      window.open(fileURL, "_blank");
    } catch (err) {
      message.error("이력서를 불러오지 못했습니다.");
    }
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
            const meta = STATUS_LABEL[item.apctStatus] || { text: item.apctStatus, color: "st-default" };
            const canEdit = item.apctStatus === "RECEIVED";
            return (
              <List.Item
                className="crc-list-item"
                style={{
                  background: "#fff",
                  border: "1px solid #e6ebe8",
                  borderRadius: 10,
                  padding: "16px 20px",
                  marginBottom: 10,
                }}
                actions={[
                  canEdit && (
                    <Button
                      key="edit"
                      size="small"
                      className="crc-btn"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(item)}
                    >
                      지원 정보 수정
                    </Button>
                  ),
                  item.resumeFileName && (
                    <Button
                      key="preview"
                      size="small"
                      className="crc-btn"
                      icon={<FilePdfOutlined />}
                      onClick={() => handlePreviewResume(item.apctId)}
                    >
                      제출한 이력서 확인
                    </Button>
                  ),
                  canEdit && (
                    <Button
                      key="upload"
                      size="small"
                      className="crc-btn"
                      icon={<FilePdfOutlined />}
                      onClick={() => setUploadTarget(item.apctId)}
                    >
                      {item.resumeFileName ? "이력서 재제출" : "이력서 제출"}
                    </Button>
                  ),
                  canEdit && (
                    <Popconfirm
                      key="cancel"
                      title="지원을 취소하시겠습니까?"
                      okText="취소하기"
                      cancelText="닫기"
                      onConfirm={() => handleCancel(item.apctId)}
                    >
                      <Button size="small" danger className="crc-btn-danger" icon={<DeleteOutlined />} loading={cancelLoading}>
                        지원 취소
                      </Button>
                    </Popconfirm>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  title={
                    <span>
                      {item.recTitle}
                      <Tag className={`crc-status-tag ${meta.color}`} style={{ marginLeft: 10 }}>
                        {meta.text}
                      </Tag>
                      {item.resumeFileName && (
                        <Tag color="cyan" style={{ marginLeft: 6 }}>
                          이력서 제출완료
                        </Tag>
                      )}
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

      {/* 이력서 업로드 모달 */}
      <Modal
        title="이력서(PDF) 업로드"
        open={uploadTarget !== null}
        onCancel={closeUploadModal}
        onOk={handleUpload}
        okText="제출"
        cancelText="닫기"
        okButtonProps={{ loading: uploadLoading, className: "crc-btn" }}
        cancelButtonProps={{ className: "crc-btn" }}
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

      {/* 지원 정보 수정 모달 */}
      <Modal
        title="지원 정보 수정"
        open={editTarget !== null}
        onCancel={closeEditModal}
        onOk={handleEditSubmit}
        okText="저장"
        cancelText="닫기"
        okButtonProps={{ loading: updateLoading, className: "crc-btn" }}
        cancelButtonProps={{ className: "crc-btn" }}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="apctName"
            label="이름"
            rules={[{ required: true, message: "이름을 입력해 주세요." }]}
          >
            <Input placeholder="홍길동" />
          </Form.Item>
          <Form.Item
            name="apctEmail"
            label="이메일"
            rules={[
              { required: true, message: "이메일을 입력해 주세요." },
              { type: "email", message: "올바른 이메일 형식이 아닙니다." },
            ]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>
          <Form.Item
            name="apctPhone"
            label="연락처"
            rules={[{ required: true, message: "연락처를 입력해 주세요." }]}
          >
            <Input placeholder="010-0000-0000" />
          </Form.Item>
        </Form>
      </Modal>
    </ApplicantLayout>
  );
}