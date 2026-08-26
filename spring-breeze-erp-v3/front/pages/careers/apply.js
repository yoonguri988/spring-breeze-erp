// pages/careers/apply.js
// 채용 공개 사이트 - 지원서 제출 (POST /api/public/applicant/apply, 로그인 필요)
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { Form, Input, Button, Alert, Card, Result } from "antd";
import { SendOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import ApplicantLayout from "../../components/ApplicantLayout";
import { fetchPublicRecruitDetailRequest } from "../../reducers/rec/recruitPublicReducer";
import {
  applyRequest,
  resetApplicantPublicState,
} from "../../reducers/apct/applicantPublicReducer";

export default function CareersApplyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { recId } = router.query;

  const { apctUser, apctAccessToken } = useSelector((state) => state.apctAuth);
  const { detail } = useSelector((state) => state.recruitPublic);
  const { applyLoading, applyError, applySuccess, appliedApplicant } = useSelector(
    (state) => state.applicantPublic,
  );

  useEffect(() => {
    if (!router.isReady || !recId || !apctAccessToken) return;
    dispatch(fetchPublicRecruitDetailRequest(Number(recId)));
    return () => dispatch(resetApplicantPublicState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, recId, apctAccessToken]);

  useEffect(() => {
    if (apctUser?.email) {
      form.setFieldsValue({ apctEmail: apctUser.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apctUser]);

  const onFinish = (values) => {
    dispatch(applyRequest({ recId: Number(recId), ...values }));
  };

  if (applySuccess) {
    return (
      <ApplicantLayout>
        <Card>
          <Result
            status="success"
            title="지원이 완료되었습니다"
            subTitle={
              detail
                ? `"${detail.recTitle}" 공고에 지원서가 정상적으로 접수되었습니다.`
                : "지원서가 정상적으로 접수되었습니다."
            }
            extra={[
              <Link key="upload" href={`/careers/my?apctId=${appliedApplicant?.apctId || ""}`}>
                <Button type="primary">이력서(PDF) 업로드하러 가기</Button>
              </Link>,
              <Link key="my" href="/careers/my">
                <Button>내 지원현황 보기</Button>
              </Link>,
            ]}
          />
        </Card>
      </ApplicantLayout>
    );
  }

  return (
    <ApplicantLayout>
      <Link href={{ pathname: "/careers/detail", query: { recId } }} passHref >
        <Button type="text" icon={<ArrowLeftOutlined />} style={{ paddingLeft: 0, marginBottom: 12 }}>
          공고로 돌아가기
        </Button>
      </Link>

      <Card style={{ maxWidth: 480 }}>
        <h1 style={{ fontSize: 19, fontWeight: 700, marginBottom: 4 }}>지원서 작성</h1>
        <p style={{ color: "#778", fontSize: 13.5, marginBottom: 20 }}>
          {detail ? `"${detail.recTitle}" 공고에 지원합니다.` : "선택한 공고에 지원합니다."}
        </p>

        <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
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
            rules={[{ type: "email", message: "올바른 이메일 형식이 아닙니다." }]}
          >
            <Input placeholder="입력하지 않으면 소셜 계정 이메일이 사용됩니다." />
          </Form.Item>
          <Form.Item
            name="apctPhone"
            label="연락처"
            rules={[{ required: true, message: "연락처를 입력해 주세요." }]}
          >
            <Input placeholder="010-1234-5678" />
          </Form.Item>

          {applyError && (
            <Alert
              type="error"
              showIcon
              message={typeof applyError === "string" ? applyError : "지원서 제출에 실패했습니다."}
              style={{ marginBottom: 16 }}
            />
          )}

          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={applyLoading}
            block
          >
            지원서 제출
          </Button>
        </Form>
      </Card>
    </ApplicantLayout>
  );
}
