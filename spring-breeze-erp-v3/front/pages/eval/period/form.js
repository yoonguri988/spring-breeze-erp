// pages/eval/period/form.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Form, Input, InputNumber, Select, DatePicker, Button, message } from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { 
  detailPeriodRequest, createPeriodRequest, updatePeriodRequest,
  checkDuplicateRequest, clearCheckDuplicate, resetPeriodState,
} from "../../../reducers/eval/evalPeriodReducer";

const TERM_OPTIONS = [
  { value: "상반기", label: "상반기" },
  { value: "하반기", label: "하반기" },
  { value: "1분기", label: "1분기" },
  { value: "2분기", label: "2분기" },
  { value: "3분기", label: "3분기" },
  { value: "4분기", label: "4분기" },
];

export default function EvalPeriodFormPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { periodId } = router.query;
  const [form] = Form.useForm();
  const isEdit = !!periodId;

  const { currentPeriod, checkDuplicate, loading, success, error } =
    useSelector((state) => state.period);

  // 수정 모드: 기존 데이터 로드
  useEffect(() => {
    if (!periodId) return;
    dispatch(detailPeriodRequest(Number(periodId)));
    return () => dispatch(clearCheckDuplicate());
  }, [dispatch, periodId]);

  // 기존 데이터 폼에 세팅
  useEffect(() => {
    if (!currentPeriod || !isEdit) return;
    form.setFieldsValue({
      evalYear: currentPeriod.evalYear,
      evalTerm: currentPeriod.evalTerm,
      title: currentPeriod.title,
      startDate: currentPeriod.startDate ? dayjs(currentPeriod.startDate) : null,
      endDate: currentPeriod.endDate ? dayjs(currentPeriod.endDate) : null,
    });
  }, [currentPeriod, isEdit, form]);

  // 결과 처리
  useEffect(() => {
    if (success) {
      message.success(isEdit ? "회차가 수정되었습니다." : "회차가 등록되었습니다.");
      dispatch(resetPeriodState());
      router.push("/eval/period/list");
    }
    if (error) {
      message.error(error);
      dispatch(resetPeriodState());
    }
  }, [success, error, dispatch, router, isEdit]);

  // 중복 확인 (연도+구분 변경 시)
  const handleDuplicateCheck = () => {
    const year = form.getFieldValue("evalYear");
    const term = form.getFieldValue("evalTerm");
    if (year && term) {
      dispatch(checkDuplicateRequest({ evalYear: year, evalTerm: term }));
    }
  };

  const dupHelp =
    checkDuplicate === true
      ? { validateStatus: "error", help: "이미 등록된 회차입니다." }
      : checkDuplicate === false
        ? { validateStatus: "success", help: "등록 가능합니다." }
        : {};

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!isEdit && checkDuplicate === true) {
        message.warning("중복된 회차입니다.");
        return;
      }
      const data = {
        ...values,
        startDate: values.startDate?.format("YYYY-MM-DD"),
        endDate: values.endDate?.format("YYYY-MM-DD"),
      };
      if (isEdit) {
        dispatch(updatePeriodRequest({ periodId: Number(periodId), ...data }));
      } else {
        dispatch(createPeriodRequest(data));
      }
    } catch (e) {}
  };

  //////
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
            인사평가 &gt; 회차 관리 &gt; {isEdit ? "수정" : "등록"}
          </div>
          <h1>회차 {isEdit ? "수정" : "등록"}</h1>
        </div>
        <div className="sb-page-head__actions">
          <Link href="/eval/period/list">
            <Button icon={<ArrowLeftOutlined />}>목록으로</Button>
          </Link>
        </div>
      </div>

      <Card>
        <Form form={form} layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item
            name="evalYear"
            label="평가 연도"
            rules={[{ required: true, message: "연도를 입력하세요." }]}
            {...(!isEdit ? dupHelp : {})}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={2020}
              max={2099}
              placeholder="2026"
              disabled={isEdit}
              onBlur={!isEdit ? handleDuplicateCheck : undefined}
            />
          </Form.Item>

          <Form.Item
            name="evalTerm"
            label="평가 구분"
            rules={[{ required: true, message: "구분을 선택하세요." }]}
          >
            <Select
              options={TERM_OPTIONS}
              placeholder="선택"
              disabled={isEdit}
              onChange={!isEdit ? handleDuplicateCheck : undefined}
            />
          </Form.Item>

          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: "제목을 입력하세요." }]}
          >
            <Input placeholder="예: 2026년 상반기 정기평가" />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="시작일"
            rules={[{ required: true, message: "시작일을 선택하세요." }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="종료일"
            rules={[{ required: true, message: "종료일을 선택하세요." }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Link href="/eval/period/list">
              <Button>취소</Button>
            </Link>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSubmit}
              loading={loading}
            >
              {isEdit ? "수정" : "등록"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
