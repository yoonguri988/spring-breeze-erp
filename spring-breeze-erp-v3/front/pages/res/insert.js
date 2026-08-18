// pages/res/insert.js
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";

import {
  addResourceRequest,
  checkResCodeRequest,
  resetResourceState,
} from "../../reducers/res/resourceReducer";
import { listEmpRequest, resetEmpState } from "../../reducers/emp/empReducer";

const RES_TYPE_OPTIONS = [
  { value: "ROOM", label: "회의실" },
  { value: "EQUIPMENT", label: "장비" },
  { value: "VEHICLE", label: "차량" },
];

const RES_STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "사용가능" },
  { value: "MAINTENANCE", label: "점검중" },
  { value: "DISABLED", label: "사용중지" },
];

export default function ResourceInsertPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { resCodeCheck, loading, error, success } = useSelector(
    (state) => state.resource,
  );
  const { empList } = useSelector((state) => state.emp);

  const returnUrl = router.query.returnUrl || "";
  const backUrl = returnUrl || "/res/list";

  const [resType, setResType] = useState("ROOM");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(listEmpRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!submitting) return;
    if (success) {
      message.success("자원이 등록되었습니다.");
      setSubmitting(false);
      dispatch(resetResourceState());
      router.push(backUrl);
    } else if (error) {
      message.error(error);
      setSubmitting(false);
      dispatch(resetResourceState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, submitting]);

  useEffect(() => {
    return () => {
      dispatch(resetResourceState());
      dispatch(resetEmpState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCodeBlur = () => {
    const code = form.getFieldValue("resCode");
    if (!code) return;
    dispatch(checkResCodeRequest(code));
  };

  const onFinish = (values) => {
    if (resCodeCheck?.checked && resCodeCheck?.duplicate) {
      message.error("이미 사용 중인 자원코드입니다.");
      return;
    }
    if (values.resType === "ROOM" && !values.capacity) {
      message.error("회의실은 수용인원을 입력해야 합니다.");
      return;
    }
    setSubmitting(true);
    dispatch(
      addResourceRequest({
        resCode: values.resCode,
        resName: values.resName,
        resType: values.resType,
        location: values.location || null,
        quantity: values.quantity,
        capacity: values.capacity || null,
        resStatus: values.resStatus,
        remark: values.remark || null,
        managerEmpId: values.managerEmpId || null,
      }),
    );
  };

  return (
    <div className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/res/list">자원 관리</Link> · 자원 등록
          </div>
          <h1>자원 등록</h1>
          <p>예약에 사용할 회의실, 장비, 차량 정보를 입력합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href={backUrl}>
            <Button icon={<ArrowLeftOutlined />} size="small">
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(changed) => {
          if ("resType" in changed) setResType(changed.resType);
        }}
        initialValues={{ resType: "ROOM", resStatus: "AVAILABLE", quantity: 1 }}
      >
        <div className="sb-card mb-3">
          <div className="sb-card__head">
            <h2>기본 정보</h2>
            <span className="sub">표시는 필수 입력 항목입니다.</span>
          </div>
          <div className="sb-card__body">
            <div className="row g-3">
              <div className="col-md-3">
                <Form.Item
                  label="자원코드"
                  name="resCode"
                  required
                  rules={[
                    { required: true, message: "자원코드를 입력하세요." },
                  ]}
                  validateStatus={
                    resCodeCheck?.checked && resCodeCheck?.duplicate
                      ? "error"
                      : undefined
                  }
                  help={
                    resCodeCheck?.checked && resCodeCheck?.duplicate
                      ? "이미 사용 중인 자원코드입니다."
                      : undefined
                  }
                >
                  <Input
                    placeholder="예: RM004"
                    maxLength={50}
                    onBlur={handleCodeBlur}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label="자원명"
                  name="resName"
                  required
                  rules={[{ required: true, message: "자원명을 입력하세요." }]}
                >
                  <Input
                    placeholder="예: 대회의실, 노트북, 카니발"
                    maxLength={100}
                  />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item label="자원 유형" name="resType">
                  <Select options={RES_TYPE_OPTIONS} />
                </Form.Item>
              </div>

              <div className="col-md-4">
                <Form.Item label="위치" name="location">
                  <Input
                    placeholder="예: 본관 3층, 지하주차장 2호기"
                    maxLength={200}
                  />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item
                  label="수량"
                  name="quantity"
                  rules={[{ required: true, message: "수량을 입력하세요." }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item
                  label="수용인원"
                  name="capacity"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (resType === "ROOM" && !value) {
                          return Promise.reject(
                            new Error("회의실은 수용인원을 입력해야 합니다."),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    placeholder="회의실인 경우 입력"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <div className="text-faint mt-1" style={{ fontSize: 12 }}>
                  장비·차량은 비워두셔도 됩니다.
                </div>
              </div>
              <div className="col-md-3">
                <Form.Item label="상태" name="resStatus">
                  <Select options={RES_STATUS_OPTIONS} />
                </Form.Item>
              </div>

              <div className="col-12">
                <Form.Item label="비고" name="remark">
                  <Input placeholder="필요한 설명을 입력하세요" />
                </Form.Item>
              </div>

              <div className="col-12">
                <Form.Item label="담당자" name="managerEmpId">
                  <Select
                    allowClear
                    placeholder="지정 안 함"
                    options={(empList?.list || []).map((e) => ({
                      value: String(e.empId),
                      label: `${e.empName} (${e.posName})`,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <Link href={backUrl}>
            <Button>취소</Button>
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckOutlined />}
            loading={submitting && loading}
          >
            등록하기
          </Button>
        </div>
      </Form>
    </div>
  );
}
