// pages/res/update.js
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";

import {
  fetchResourceDetailRequest,
  updateResourceRequest,
  resetResourceState,
} from "../../reducers/res/resourceReducer";
import { listEmpRequest, resetEmpState } from "../../reducers/emp/empReducer";

const RES_STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "사용가능" },
  { value: "MAINTENANCE", label: "점검중" },
  { value: "DISABLED", label: "사용중지" },
];

const RES_TYPE_LABEL = { ROOM: "회의실", EQUIPMENT: "장비", VEHICLE: "차량" };

export default function ResourceUpdatePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    detail: resource,
    loading,
    error,
    success,
  } = useSelector((state) => state.resource);
  const { empList } = useSelector((state) => state.emp);

  const resId = router.query.resId ? String(router.query.resId) : "";

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(listEmpRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady || !resId) return;
    dispatch(fetchResourceDetailRequest(resId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, resId]);

  useEffect(() => {
    if (!resource) return;
    form.setFieldsValue({
      location: resource.location,
      quantity: resource.quantity,
      capacity: resource.capacity,
      resStatus: resource.resStatus,
      remark: resource.remark,
      managerEmpId: resource.managerEmpId
        ? String(resource.managerEmpId)
        : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  useEffect(() => {
    if (!submitting) return;
    if (success) {
      message.success("자원 정보가 수정되었습니다.");
      setSubmitting(false);
      dispatch(resetResourceState());
      router.push("/res/list");
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

  const onFinish = (values) => {
    if (resource?.resType === "ROOM" && !values.capacity) {
      message.error("회의실은 수용인원을 입력해야 합니다.");
      return;
    }
    setSubmitting(true);
    dispatch(
      updateResourceRequest({
        resId,
        dto: {
          resCode: resource.resCode,
          resName: resource.resName,
          resType: resource.resType,
          location: values.location || null,
          quantity: values.quantity,
          capacity: values.capacity || null,
          resStatus: values.resStatus,
          remark: values.remark || null,
          managerEmpId: values.managerEmpId || null,
        },
      }),
    );
  };

  if (!resource) return null;

  return (
    <div className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/res/list">자원 관리</Link> · 자원 수정
          </div>
          <h1>자원 수정</h1>
          <p>등록된 자원 정보를 수정합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/res/list">
            <Button icon={<ArrowLeftOutlined />} size="small">
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="sb-card mb-3">
          <div className="sb-card__head">
            <h2>기본 정보</h2>
            <span className="sub">{resource.resCode}</span>
          </div>
          <div className="sb-card__body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="sb-form-label">자원코드</label>
                <Input
                  value={resource.resCode}
                  readOnly
                  style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
                />
              </div>
              <div className="col-md-6">
                <label className="sb-form-label">자원명</label>
                <Input
                  value={resource.resName}
                  readOnly
                  style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
                />
              </div>
              <div className="col-md-3">
                <label className="sb-form-label">자원 유형</label>
                <Input
                  value={RES_TYPE_LABEL[resource.resType] || resource.resType}
                  readOnly
                  style={{ background: "#fafbfc", color: "var(--sb-ink-soft)" }}
                />
              </div>

              <div className="col-md-4">
                <Form.Item label="위치" name="location">
                  <Input maxLength={200} />
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
                        if (resource.resType === "ROOM" && !value) {
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
                  <Input />
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
          <Link href="/res/list">
            <Button>취소</Button>
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckOutlined />}
            loading={submitting && loading}
          >
            수정 완료
          </Button>
        </div>
      </Form>
    </div>
  );
}
