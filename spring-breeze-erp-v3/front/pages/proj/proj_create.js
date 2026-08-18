// pages/proj/proj_create.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, Input, Select, DatePicker } from "antd";
import { createProjRequest } from "../../reducers/proj/projReducer";

import moment from "moment";

const { TextArea } = Input;

const STATUS_OPTIONS = [
  { label: "TODO", value: "TODO" },
  { label: "DOING", value: "DOING" },
  { label: "DONE", value: "DONE" },
];

export default function ProjCreatePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.proj);

  const [form, setForm] = useState({
    proName: "",
    proDesc: "",
    proStatus: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});

  // 생성 성공하면 목록 페이지로 이동
  useEffect(() => {
    if (success) {
      router.push("/proj/proj_list");
    }
  }, [success, router]);

  // 입력값 하나 바꿀 때 실행 (폼 값 갱신 + 해당 항목 에러 지우기)
  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 등록 버튼(폼 제출) 클릭 시 실행
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.proName.trim()) {
      newErrors.proName = "프로젝트명을 입력하세요.";
    }

    if (!form.proDesc.trim()) {
      newErrors.proDesc = "프로젝트 설명을 입력하세요.";
    }

    if (!form.proStatus) {
      newErrors.proStatus = "상태를 선택하세요.";
    }

    if (!form.startDate) {
      newErrors.startDate = "시작일을 선택하세요.";
    }

    if (!form.endDate) {
      newErrors.endDate = "종료일을 선택하세요.";
    }

    if (
      form.startDate &&
      form.endDate &&
      moment(form.startDate).isAfter(moment(form.endDate))
    ) {
      newErrors.endDate = "종료일은 시작일 이후로 선택하세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(
      createProjRequest({
        proName: form.proName.trim(),
        proDesc: form.proDesc.trim(),
        proStatus: form.proStatus,
        startDate: form.startDate,
        endDate: form.endDate,
      })
    );
  };

  // 취소 버튼: 입력값 전체 초기화
  const handleReset = () => {
    setForm({
      proName: "",
      proDesc: "",
      proStatus: "",
      startDate: "",
      endDate: "",
    });

    setErrors({});
  };

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link>
            <i className="bi bi-chevron-right"></i>
            업무
            <i className="bi bi-chevron-right"></i>
            프로젝트
            <i className="bi bi-chevron-right"></i>
            생성
          </div>

          <h1>프로젝트 생성</h1>

          <p>새로운 프로젝트의 기본 정보를 입력하세요.</p>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card__body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="pro_name" className="sb-form-label">
                프로젝트명
              </label>

              <Input
                id="pro_name"
                value={form.proName}
                onChange={(e) => handleChange("proName", e.target.value)}
                placeholder="프로젝트명을 입력하세요"
                status={errors.proName ? "error" : ""}
              />

              {errors.proName && (
                <div className="text-danger mt-1">{errors.proName}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="pro_desc" className="sb-form-label">
                프로젝트 설명
              </label>

              <TextArea
                id="pro_desc"
                value={form.proDesc}
                onChange={(e) => handleChange("proDesc", e.target.value)}
                placeholder="프로젝트에 대한 설명을 입력하세요"
                rows={4}
                status={errors.proDesc ? "error" : ""}
              />

              {errors.proDesc && (
                <div className="text-danger mt-1">{errors.proDesc}</div>
              )}
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label htmlFor="pro_status" className="sb-form-label">
                  상태
                </label>

                <Select
                  id="pro_status"
                  value={form.proStatus || undefined}
                  onChange={(value) => handleChange("proStatus", value)}
                  options={STATUS_OPTIONS}
                  placeholder="상태를 선택하세요"
                  style={{ width: "100%" }}
                  status={errors.proStatus ? "error" : ""}
                />

                {errors.proStatus && (
                  <div className="text-danger mt-1">{errors.proStatus}</div>
                )}
              </div>

              <div className="col-md-4">
                <label htmlFor="start_date" className="sb-form-label">
                  시작일
                </label>

                <DatePicker
                  id="start_date"
                  value={form.startDate ? moment(form.startDate, "YYYY-MM-DD") : null}
                  onChange={(date) =>
                    handleChange("startDate", date ? date.format("YYYY-MM-DD") : "")
                  }
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  status={errors.startDate ? "error" : ""}
                />

                {errors.startDate && (
                  <div className="text-danger mt-1">{errors.startDate}</div>
                )}
              </div>

              <div className="col-md-4">
                <label htmlFor="end_date" className="sb-form-label">
                  종료일
                </label>

                <DatePicker
                  id="end_date"
                  value={form.endDate ? moment(form.endDate, "YYYY-MM-DD") : null}
                  onChange={(date) =>
                    handleChange("endDate", date ? date.format("YYYY-MM-DD") : "")
                  }
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  status={errors.endDate ? "error" : ""}
                />

                {errors.endDate && (
                  <div className="text-danger mt-1">{errors.endDate}</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="reg_date" className="sb-form-label">
                등록일
              </label>

              <Input
                id="reg_date"
                value={moment().format("YYYY-MM-DD")}
                readOnly
                style={{ maxWidth: 200, background: "#fafbfc" }}
              />
            </div>

            {error && <div className="text-danger mb-3">{error}</div>}

            <div className="sb-divider"></div>

            <div className="d-flex justify-content-end gap-2">
              <Button type="default" htmlType="button" onClick={handleReset}>
                취소
              </Button>

              <Link href="/proj/proj_list">
                <Button>목록</Button>
              </Link>

              <Button type="primary" htmlType="submit" loading={loading}>
                등록
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}