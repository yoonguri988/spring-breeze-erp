// pages/resv/edit.js
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import moment from "moment";

import {
  fetchResvDetailRequest,
  updateResvRequest,
  resetResvState,
} from "../../reducers/resv/resvReducer";

const RES_TYPE_LABEL = { ROOM: "회의실", EQUIPMENT: "장비", VEHICLE: "차량" };

export default function ResvEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    detail: resv,
    loading,
    error,
    success,
  } = useSelector((state) => state.resv);

  const revId = router.query.revId ? String(router.query.revId) : "";

  const [startDt, setStartDt] = useState(null);
  const [endDt, setEndDt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const prevLoading = useRef(false);

  useEffect(() => {
    if (!router.isReady || !revId) return;
    dispatch(fetchResvDetailRequest(revId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, revId]);

  useEffect(() => {
    if (!resv) return;
    form.setFieldsValue({
      startDt: resv.startDt ? moment(resv.startDt) : null,
      endDt: resv.endDt ? moment(resv.endDt) : null,
      quantity: resv.quantity,
      remark: resv.remark,
    });
    setStartDt(resv.startDt || null);
    setEndDt(resv.endDt || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resv]);

  useEffect(() => {
    if (!submitting) return;
    if (prevLoading.current && !loading) {
      if (success) {
        message.success("예약이 수정되었습니다.");
        setSubmitting(false);
        dispatch(resetResvState());
        router.push("/resv/my");
      } else if (error) {
        message.error(error);
        setSubmitting(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error, submitting]);

  useEffect(() => {
    prevLoading.current = loading;
  }, [loading]);

  useEffect(() => {
    return () => {
      dispatch(resetResvState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!resv) return null;

  const editable = resv.status === "WAI";
  const quantityMax = resv.resQuantity ?? resv.quantity;

  const handleStartChange = (d) => {
    const v = d ? d.format("YYYY-MM-DD HH:mm") : null;
    setStartDt(v);
    if (v && endDt && moment(endDt).isBefore(moment(v))) {
      setEndDt(v);
      form.setFieldsValue({ endDt: moment(v) });
    }
  };
  const handleEndChange = (d) =>
    setEndDt(d ? d.format("YYYY-MM-DD HH:mm") : null);

  const onFinish = (values) => {
    if (!startDt || !endDt) {
      message.error("시작일시/종료일시를 입력하세요.");
      return;
    }
    if (moment(endDt).isBefore(moment(startDt))) {
      message.error("종료일시는 시작일시보다 빠를 수 없습니다.");
      return;
    }
    if (quantityMax != null && values.quantity > quantityMax) {
      message.error(`최대 ${quantityMax}개까지 예약 가능합니다.`);
      return;
    }
    setSubmitting(true);
    dispatch(
      updateResvRequest({
        revId,
        dto: {
          startDt,
          endDt,
          quantity: values.quantity,
          remark: values.remark || null,
        },
      }),
    );
  };

  return (
    <div className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/resv/my">내 자원 요청 관리</Link> <span>&gt;</span>{" "}
            예약 수정
          </div>
          <h1>예약 수정</h1>
          <p>{resv.resName}</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/resv/my">
            <Button icon={<ArrowLeftOutlined />} size="small">
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      {!editable && (
        <Alert
          className="mb-3"
          type={resv.status === "APP" ? "warning" : "error"}
          showIcon
          message={
            resv.status === "APP"
              ? "이미 승인된 예약은 수정할 수 없습니다. 변경이 필요하면 취소 후 다시 신청해주세요."
              : "반려된 예약은 수정할 수 없습니다. 새로 예약을 신청해주세요."
          }
        />
      )}

      {editable && (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="sb-form-card mx-auto"
        >
          <div className="sb-card mb-3">
            <div className="sb-card__head">
              <h2>예약 정보</h2>
              <span className="sub">자원은 변경할 수 없습니다.</span>
            </div>
            <div className="sb-card__body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="sb-form-label">자원</label>
                  <div
                    className="form-control"
                    style={{
                      background: "#fafbfc",
                      height: "auto",
                      padding: "8px 12px",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <b>{resv.resName}</b>
                      <span className="sb-badge sb-badge--gray">
                        {RES_TYPE_LABEL[resv.resType] || resv.resType}
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5 }} className="text-faint mt-1">
                      위치: {resv.location || "-"} · 총 수량 {quantityMax}
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <Form.Item
                    label="시작일시"
                    name="startDt"
                    required
                    rules={[
                      { required: true, message: "시작일시를 입력하세요." },
                    ]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: "100%" }}
                      onChange={handleStartChange}
                    />
                  </Form.Item>
                </div>
                <div className="col-md-3">
                  <Form.Item
                    label="종료일시"
                    name="endDt"
                    required
                    rules={[
                      { required: true, message: "종료일시를 입력하세요." },
                    ]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: "100%" }}
                      disabledDate={(d) =>
                        startDt
                          ? d && d.isBefore(moment(startDt), "day")
                          : false
                      }
                      onChange={handleEndChange}
                    />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item
                    label="수량"
                    name="quantity"
                    rules={[
                      { required: true, message: "수량을 입력하세요." },
                      {
                        validator: (_, value) => {
                          if (quantityMax != null && value > quantityMax) {
                            return Promise.reject(
                              new Error(
                                `최대 ${quantityMax}개까지 예약 가능합니다.`,
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      max={quantityMax ?? undefined}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>

                <div className="col-12">
                  <Form.Item label="비고" name="remark">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <Link href="/resv/my">
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
      )}
    </div>
  );
}
