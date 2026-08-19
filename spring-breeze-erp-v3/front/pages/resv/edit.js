// pages/resv/edit.js
// 원본: edit.html 기준 (insert.js와 동일한 필드 순서/문구/레이아웃 틀을 그대로 재사용)
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, DatePicker, Form, Input, InputNumber, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LockOutlined,
  RightOutlined,
  TeamOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { fetchResvDetailRequest, updateResvRequest, resetResvState } from "../../reducers/resv/resvReducer";

const STATUS_MAP = {
  AVAILABLE: { text: "사용가능", tone: "green" },
  MAINTENANCE: { text: "점검중", tone: "amber" },
  DISABLED: { text: "사용불가", tone: "red" },
};

function statusBadge(status) {
  if (status === "WAI") return <span className="sb-badge sb-badge--amber">대기</span>;
  if (status === "APP") return <span className="sb-badge sb-badge--green">승인</span>;
  if (status === "REJ") return <span className="sb-badge sb-badge--red">반려</span>;
  if (status === "NORET") return <span className="sb-badge sb-badge--red">미반납</span>;
  return <span className="sb-badge sb-badge--gray">{status}</span>;
}

export default function ResvEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { detail: resv, loading, error, success } = useSelector((state) => state.resv);

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
      quantity: resv.quantity ?? 1,
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
  const quantityMax = resv.resQuantity ?? null;
  const infoStatus = STATUS_MAP[resv.resStatus] || null;

  const handleStartChange = (d) => {
    const v = d ? d.format("YYYY-MM-DDTHH:mm") : null;
    setStartDt(v);
    if (v && endDt && moment(endDt).isBefore(moment(v))) {
      setEndDt(v);
      form.setFieldsValue({ endDt: moment(v) });
    }
  };
  const handleEndChange = (d) => setEndDt(d ? d.format("YYYY-MM-DDTHH:mm") : null);

  const onFinish = (values) => {
    if (moment(endDt).isBefore(moment(startDt))) {
      form.setFields([{ name: "endDt", errors: ["종료 일시는 시작 일시 이후여야 합니다."] }]);
      return;
    }
    setSubmitting(true);
    dispatch(
      updateResvRequest({
        revId,
        dto: {
          resId: resv.resId,
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
            <Link href="/resv/my">예약 내역</Link> <RightOutlined /> 예약 수정
          </div>
          <h1>자원 예약 수정</h1>
          <p>대기 상태(WAI)인 본인 예약 건만 수정할 수 있습니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/resv/my">
            <Button icon={<ArrowLeftOutlined />}>
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      {!editable && (
        <Alert
          className="mb-3"
          type="error"
          showIcon
          message={
            resv.status === "APP"
              ? "이미 승인된 예약은 수정할 수 없습니다. 변경이 필요하면 담당자에게 문의하세요."
              : "반려된 예약은 수정할 수 없습니다. 새 예약을 신청해주세요."
          }
        />
      )}

      {editable && (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="sb-card mb-3">
            <div className="sb-card__head">
              <h2>예약 정보</h2>
              <span className="sub">상태 {statusBadge(resv.status)}</span>
            </div>
            <div className="sb-card__body">
              {/* 예약 자원 (수정 불가) */}
              <div className="mb-3">
                <label className="sb-form-label">예약 자원</label>
                <Input value={`${resv.resName} (${resv.resCode})`} readOnly />
                <span className="sb-field-msg text-faint" style={{ display: "flex" }}>
                  <LockOutlined /> 예약 자원은 수정할 수 없습니다. 다른 자원을 이용하려면 새 예약을 신청해주세요.
                </span>
              </div>

              {/* 선택된 자원 상세 정보 : location / capacity / res_status */}
              <div className="mb-3 p-3" style={{ background: "var(--sb-accent-soft)", borderRadius: 10 }}>
                <div className="text-faint mb-1" style={{ fontSize: 12 }}>
                  선택된 자원 정보
                </div>
                <div className="d-flex flex-wrap gap-3" style={{ fontSize: 13 }}>
                  <span>
                    <EnvironmentOutlined className="text-faint" /> 위치 <b>{resv.location || "-"}</b>
                  </span>
                  <span>
                    <TeamOutlined className="text-faint" /> 수용인원 <b>{resv.capacity ? `${resv.capacity}명` : "-"}</b>
                  </span>
                  <span>
                    <InboxOutlined className="text-faint" /> 보유수량 <b>{quantityMax ?? "-"}</b>
                  </span>
                  <span>
                    <span className={`sb-badge sb-badge--${infoStatus?.tone || "gray"}`}>{infoStatus?.text || "-"}</span>
                  </span>
                </div>
                {infoStatus && infoStatus !== STATUS_MAP.AVAILABLE && (
                  <div className="text-danger mt-2" style={{ fontSize: 12.5 }}>
                    <ExclamationCircleOutlined /> 현재 점검/사용불가 상태인 자원입니다. 승인이 지연될 수 있습니다.
                  </div>
                )}
              </div>

              {/* 예약 기간 : START_DT ~ END_DT (기존값 프리필) */}
              <div className="row mb-1">
                <div className="col-6">
                  <Form.Item label="시작 일시" name="startDt" rules={[{ required: true, message: "시작 일시를 입력하세요." }]}>
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: "100%" }}
                      onChange={handleStartChange}
                    />
                  </Form.Item>
                </div>
                <div className="col-6">
                  <Form.Item label="종료 일시" name="endDt" rules={[{ required: true, message: "종료 일시를 입력하세요." }]}>
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: "100%" }}
                      disabledDate={(d) => (startDt ? d && d.isBefore(moment(startDt), "day") : false)}
                      onChange={handleEndChange}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="mb-3 text-faint" style={{ fontSize: 12 }}>
                <InfoCircleOutlined /> 동일 자원에 예약 시간이 겹치면 신청이 제한될 수 있습니다.
              </div>

              {/* 예약 수량 */}
              <div className="mb-3">
                <Form.Item
                  label="예약 수량"
                  name="quantity"
                  rules={[
                    { required: true, message: "1개 이상 입력하세요." },
                    {
                      validator: (_, value) => {
                        if (quantityMax != null && value > quantityMax) {
                          return Promise.reject(new Error(`보유 수량(${quantityMax})을 초과했습니다.`));
                        }
                        if (value != null && value < 1) {
                          return Promise.reject(new Error("1개 이상 입력하세요."));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber min={1} max={quantityMax ?? undefined} style={{ width: "100%" }} />
                </Form.Item>
              </div>

              {/* 신청 사유 */}
              <div className="mb-4">
                <Form.Item label="신청 사유" name="remark">
                  <Input.TextArea rows={4} placeholder="사용 목적이나 요청 사항을 입력하세요" />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <Link href="/resv/my">
              <Button>취소</Button>
            </Link>
            <Button type="primary" htmlType="submit" icon={<CheckOutlined />} loading={submitting && loading}>
              수정 저장
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}