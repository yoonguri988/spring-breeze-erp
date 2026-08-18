// pages/resv/insert.js
// 원본: v2 resv/insert.html 기준 (라벨/문구/필드 순서/검증 메시지 그대로 매칭)
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import moment from "moment";

import {
  addResvRequest,
  fetchAvailableQtyRequest,
  resetResvState,
} from "../../reducers/resv/resvReducer";
import {
  fetchResourceListRequest,
  resetResourceState,
} from "../../reducers/res/resourceReducer";

const STATUS_MAP = {
  AVAILABLE: { text: "사용가능", tone: "green" },
  MAINTENANCE: { text: "점검중", tone: "amber" },
  DISABLED: { text: "사용불가", tone: "red" },
};

export default function ResvInsertPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { list: resourceList } = useSelector((state) => state.resource);
  const { availableQty, loading, error, success } = useSelector(
    (state) => state.resv,
  );

  const [resId, setResId] = useState(undefined);
  const [startDt, setStartDt] = useState(null);
  const [endDt, setEndDt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const prevLoading = useRef(false);

  useEffect(() => {
    dispatch(fetchResourceListRequest({ onepagelist: 1000 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // 자원 + 시작일시 + 종료일시가 모두 채워지면 실제 잔여수량을 다시 조회한다
  // (총 보유수량이 아니라 이미 예약된 수량을 뺀 진짜 남은 수량이 필요하므로).
  useEffect(() => {
    if (resId && startDt && endDt) {
      dispatch(fetchAvailableQtyRequest({ resId, startDt, endDt }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, resId, startDt, endDt]);

  useEffect(() => {
    if (!submitting) return;
    if (prevLoading.current && !loading) {
      if (success) {
        message.success("예약이 신청되었습니다.");
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
      dispatch(resetResourceState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedResource = (resourceList || []).find(
    (r) => String(r.resId) === String(resId),
  );

  // 1차 상한: 자원의 총 보유수량(서버 조회 전 임시값). availableQty가 조회되면 실제 잔여수량으로 좁힌다.
  const quantityMax =
    availableQty && String(availableQty.resId ?? resId) === String(resId)
      ? availableQty.availableQty
      : (selectedResource?.quantity ?? null);

  const infoStatus =
    availableQty && availableQty.availableQty <= 0
      ? STATUS_MAP.DISABLED
      : STATUS_MAP[selectedResource?.resStatus] || null;

  const handleResourceChange = (value) => {
    setResId(value);
  };

  const handleStartChange = (d) => {
    const v = d ? d.format("YYYY-MM-DDTHH:mm") : null;
    setStartDt(v);
    // 종료일시가 시작일시보다 빠르지 않도록 최소값 동기화
    if (v && endDt && moment(endDt).isBefore(moment(v))) {
      setEndDt(v);
      form.setFieldsValue({ endDt: moment(v) });
    }
  };

  const handleEndChange = (d) => {
    setEndDt(d ? d.format("YYYY-MM-DDTHH:mm") : null);
  };

  const onFinish = (values) => {
    if (moment(endDt).isBefore(moment(startDt))) {
      form.setFields([
        { name: "endDt", errors: ["종료 일시는 시작 일시 이후여야 합니다."] },
      ]);
      return;
    }
    if (availableQty && availableQty.availableQty <= 0) {
      form.setFields([
        {
          name: "quantity",
          errors: ["해당 기간에는 예약 가능한 수량이 없습니다."],
        },
      ]);
      return;
    }

    setSubmitting(true);
    dispatch(
      addResvRequest({
        resId,
        startDt,
        endDt,
        quantity: values.quantity,
        remark: values.remark || null,
      }),
    );
  };

  return (
    <div className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/resv/my">자원 요청</Link> <RightOutlined /> 예약 신청
          </div>
          <h1>자원 예약 신청</h1>
          <p>
            사용할 자원과 기간을 선택하면 관리자 승인 대기 상태로 접수됩니다.
          </p>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/resv/my">
            <Button icon={<ArrowLeftOutlined />}>
              목록으로
            </Button>
          </Link>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ quantity: 1 }}
      >
        <div className="sb-card mb-3">
          <div className="sb-card__head">
            <h2>예약 정보</h2>
            <span className="sub">
              예약 상태는 최초 대기(WAI)로 저장됩니다.
            </span>
          </div>
          <div className="sb-card__body">
            {/* 자원 선택 */}
            <div className="mb-3">
              <Form.Item
                label="예약 자원"
                name="resId"
                rules={[
                  { required: true, message: "예약할 자원을 선택하세요." },
                ]}
              >
                <Select
                  placeholder="자원을 선택하세요"
                  onChange={handleResourceChange}
                  options={(resourceList || []).map((r) => ({
                    value: String(r.resId),
                    label: `${r.resName} (${r.resCode}) / 보유 수량 ${r.quantity}`,
                  }))}
                />
              </Form.Item>
            </div>

            {/* 선택된 자원 상세 정보 : location / capacity / res_status */}
            {selectedResource && (
              <div
                className="mb-3 p-3"
                style={{
                  background: "var(--sb-accent-soft)",
                  borderRadius: 10,
                }}
              >
                <div className="text-faint mb-1" style={{ fontSize: 12 }}>
                  선택된 자원 정보
                </div>
                <div
                  className="d-flex flex-wrap gap-3"
                  style={{ fontSize: 13 }}
                >
                  <span>
                    <EnvironmentOutlined className="text-faint" /> 위치{" "}
                    <b>{selectedResource.location || "-"}</b>
                  </span>
                  <span>
                    <TeamOutlined className="text-faint" /> 수용인원{" "}
                    <b>
                      {selectedResource.capacity
                        ? `${selectedResource.capacity}명`
                        : "-"}
                    </b>
                  </span>
                  <span>
                    <InboxOutlined className="text-faint" /> 보유수량{" "}
                    <b>
                      {availableQty
                        ? `${availableQty.availableQty} / ${availableQty.totalQuantity}`
                        : selectedResource.quantity}
                    </b>
                  </span>
                  <span>
                    <span
                      className={`sb-badge sb-badge--${infoStatus?.tone || "gray"}`}
                    >
                      {infoStatus?.text || "-"}
                    </span>
                  </span>
                </div>
                {infoStatus && infoStatus !== STATUS_MAP.AVAILABLE && (
                  <div className="text-danger mt-2" style={{ fontSize: 12.5 }}>
                    <ExclamationCircleOutlined /> 현재 점검/사용불가 상태인
                    자원입니다. 승인이 지연될 수 있습니다.
                  </div>
                )}
              </div>
            )}

            {/* 예약 기간 : START_DT ~ END_DT */}
            <div className="row mb-1">
              <div className="col-6">
                <Form.Item
                  label="시작 일시"
                  name="startDt"
                  rules={[
                    { required: true, message: "시작 일시를 입력하세요." },
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
              <div className="col-6">
                <Form.Item
                  label="종료 일시"
                  name="endDt"
                  rules={[
                    { required: true, message: "종료 일시를 입력하세요." },
                  ]}
                >
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD HH:mm"
                    style={{ width: "100%" }}
                    disabledDate={(d) =>
                      startDt ? d && d.isBefore(moment(startDt), "day") : false
                    }
                    onChange={handleEndChange}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="mb-3 text-faint" style={{ fontSize: 12 }}>
              <InfoCircleOutlined /> 동일 자원에 예약 시간이 겹치면 신청이
              제한될 수 있습니다.
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
                        return Promise.reject(
                          new Error(
                            `보유 수량(${quantityMax})을 초과했습니다.`,
                          ),
                        );
                      }
                      if (value != null && value < 1) {
                        return Promise.reject(
                          new Error("1개 이상 입력하세요."),
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

            {/* 신청 사유 */}
            <div className="mb-4">
              <Form.Item label="신청 사유" name="remark">
                <Input.TextArea
                  rows={4}
                  placeholder="사용 목적이나 요청 사항을 입력하세요"
                />
              </Form.Item>
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
            예약 신청
          </Button>
        </div>
      </Form>
    </div>
  );
}
