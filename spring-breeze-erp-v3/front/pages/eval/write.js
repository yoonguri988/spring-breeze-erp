// pages/eval/write.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Card,
  Form,
  InputNumber,
  Input,
  Button,
  Divider,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";

import { 
  detailEvalRequest, draftEvalRequest, submitEvalRequest, resetEvalState,
} from "../../reducers/eval/evalReducer";

const SCORE_ITEMS = [
  { name: "scorePerformance", label: "업무 성과", desc: "목표 달성도, 업무 품질" },
  { name: "scoreExpertise", label: "전문성", desc: "직무 지식, 기술 역량" },
  { name: "scoreTeamwork", label: "팀워크", desc: "협업, 커뮤니케이션" },
  { name: "scoreAttitude", label: "근무 태도", desc: "성실성, 책임감" },
  { name: "scoreGrowth", label: "성장 잠재력", desc: "자기개발, 도전 의지" },
];

export default function EvalWritePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { evalId, periodId, targetEmpId } = router.query;
  const [form] = Form.useForm();

  const { currentEval, loading, success, error } = useSelector(
    (state) => state.eval
  );
  const isEdit = !!evalId;

  // 기존 평가 로드 (수정 모드)
  useEffect(() => {
    if (!evalId) return;
    dispatch(detailEvalRequest(Number(evalId)));
    return () => { dispatch(resetEvalState()); };
  }, [dispatch, evalId]);

  // 기존 데이터 폼에 세팅
  useEffect(() => {
    if (!currentEval) return;
    form.setFieldsValue({
      scorePerformance: currentEval.scorePerformance,
      scoreExpertise: currentEval.scoreExpertise,
      scoreTeamwork: currentEval.scoreTeamwork,
      scoreAttitude: currentEval.scoreAttitude,
      scoreGrowth: currentEval.scoreGrowth,
      strengthComment: currentEval.strengthComment,
      improvementComment: currentEval.improvementComment,
    });
  }, [currentEval, form]);

  // 결과 처리
  useEffect(() => {
    if (!success) return;
    message.success("저장되었습니다.");
    dispatch(resetEvalState());
    router.push({
      pathname: "/eval/dashboard",
      query: { periodId: periodId || currentEval?.periodId },
    });
  }, [success, dispatch, router, periodId, currentEval]);

  useEffect(() => {
    if (!error) return;
    message.error(error);
    dispatch(resetEvalState());
  }, [error, dispatch]);

  const buildPayload = (values) => ({
    ...values,
    evalId: isEdit ? Number(evalId) : undefined,
    periodId: Number(periodId || currentEval?.periodId),
    targetEmpId: Number(targetEmpId || currentEval?.targetEmpId),
    evalType: currentEval?.evalType || "PEER",
  });

  const handleDraft = async () => {
    const values = form.getFieldsValue();
    dispatch(draftEvalRequest(buildPayload(values)));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      dispatch(submitEvalRequest(buildPayload(values)));
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
            인사평가 &gt; 평가 작성 &gt; {isEdit ? "수정" : "작성"}
          </div>
          <h1>평가 {isEdit ? "수정" : "작성"}</h1>
          {currentEval && (
            <p>
              대상: {currentEval.targetEmpName} ({currentEval.targetDeptName})
            </p>
          )}
        </div>
        <div className="sb-page-head__actions">
          <Link
            href={{
              pathname: "/eval/dashboard",
              query: { periodId: periodId || currentEval?.periodId },
            }}
          >
            <Button icon={<ArrowLeftOutlined />}>돌아가기</Button>
          </Link>
        </div>
      </div>

      <Card loading={loading && !currentEval && isEdit}>
        <Form form={form} layout="vertical" style={{ maxWidth: 640 }}>
          {/* 점수 5항목 */}
          {SCORE_ITEMS.map((item) => (
            <Form.Item
              key={item.name}
              name={item.name}
              label={item.label}
              extra={item.desc}
              rules={[
                {
                  required: false,
                  // 제출 시에만 required. 임시저장은 빈 값 허용
                },
              ]}
            >
              <InputNumber min={1} max={5} style={{ width: "100%" }} placeholder="1 ~ 5" />
            </Form.Item>
          ))}

          <Divider />

          {/* 코멘트 */}
          <Form.Item name="strengthComment" label="강점 코멘트">
            <Input.TextArea rows={3} placeholder="이 사원의 강점을 작성하세요." />
          </Form.Item>

          <Form.Item name="improvementComment" label="개선 코멘트">
            <Input.TextArea rows={3} placeholder="개선이 필요한 부분을 작성하세요." />
          </Form.Item>

          {/* 버튼 */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 24,
            }}
          >
            <Button icon={<SaveOutlined />} onClick={handleDraft} loading={loading}>
              임시 저장
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              loading={loading}
            >
              최종 제출
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
