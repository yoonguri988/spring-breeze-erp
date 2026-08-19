// pages/proj/proj_create.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, Input, Select, DatePicker, message } from "antd";
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

  const [proStatus, setProStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (success) {
      router.push("/proj/proj_list");
    }
  }, [success, router]);

  const handleReset = () => {
    document.getElementById("pro_name").value = "";
    document.getElementById("pro_desc").value = "";
    setProStatus("");
    setStartDate("");
    setEndDate("");
  };

  const onFinish = () => {
    const proName = document.getElementById("pro_name").value;
    const proDesc = document.getElementById("pro_desc").value;

    if (!proName.trim()) { message.warning("프로젝트명을 입력하세요."); return; }
    if (!proDesc.trim()) { message.warning("프로젝트 설명을 입력하세요."); return; }
    if (!proStatus) { message.warning("상태를 선택하세요."); return; }
    if (!startDate) { message.warning("시작일을 선택하세요."); return; }
    if (!endDate) { message.warning("종료일을 선택하세요."); return; }
    if (moment(startDate).isAfter(moment(endDate))) { message.warning("종료일은 시작일 이후로 선택하세요."); return; }

    dispatch( createProjRequest({ proName: proName.trim(), proDesc: proDesc.trim(), proStatus, startDate, endDate, }) );
  };

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            <Link href="/">홈</Link>
            <i className="bi bi-chevron-right"></i> 업무
            <i className="bi bi-chevron-right"></i> 프로젝트
            <i className="bi bi-chevron-right"></i> 생성
          </div>
          <h1>프로젝트 생성</h1>
          <p>새로운 프로젝트의 기본 정보를 입력하세요.</p>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card__body">
          <form id="projCreateForm" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="mb-3">
              <label htmlFor="pro_name" className="sb-form-label"> 프로젝트명 </label>
              <Input id="pro_name" name="pro_name" placeholder="프로젝트명을 입력하세요" />
            </div>

            <div className="mb-3">
              <label htmlFor="pro_desc" className="sb-form-label"> 프로젝트 설명 </label>
              <TextArea
                id="pro_desc"
                name="pro_desc"
                placeholder="프로젝트에 대한 설명을 입력하세요"
                rows={4}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label htmlFor="pro_status" className="sb-form-label"> 상태 </label>
                <Select
                  id="pro_status"
                  value={proStatus || undefined}
                  onChange={(value) => setProStatus(value)}
                  options={STATUS_OPTIONS}
                  placeholder="상태를 선택하세요"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="start_date" className="sb-form-label"> 시작일 </label>
                <DatePicker
                  id="start_date"
                  value={startDate ? moment(startDate, "YYYY-MM-DD") : null}
                  onChange={(date) => setStartDate(date ? date.format("YYYY-MM-DD") : "")}
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="end_date" className="sb-form-label"> 종료일 </label>
                <DatePicker
                  id="end_date"
                  value={endDate ? moment(endDate, "YYYY-MM-DD") : null}
                  onChange={(date) => setEndDate(date ? date.format("YYYY-MM-DD") : "")}
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="reg_date" className="sb-form-label"> 등록일 </label>
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
                <Button type="default" htmlType="button" onClick={handleReset}> 취소 </Button>
                  <Link href="/proj/proj_list"> 
                  <Button>목록</Button> 
                  </Link>
                <Button type="primary" htmlType="button" loading={loading} onClick={onFinish}> 등록 </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}