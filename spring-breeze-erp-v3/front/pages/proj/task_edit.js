// pages/proj/task_edit.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, Input, Select, DatePicker, message } from "antd";
import {
  updateTaskRequest,
  updateTaskContextRequest,
} from "../../reducers/task/taskReducer";

import moment from "moment";

const { TextArea } = Input;

const STATUS_OPTIONS = [
  { label: "TODO", value: "TODO" },
  { label: "DOING", value: "DOING" },
  { label: "DONE", value: "DONE" },
];

export default function TaskEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { taskId, proId } = router.query;

  const {
    loading,
    error,
    success,
    editContext,
  } = useSelector((state) => state.task);

  const {
    task,
    memberList = [],
    taskList = [],
  } = editContext;

  const [form, setForm] = useState({
    taskId: "",
    proId: "",
    taskName: "",
    taskDesc: "",
    taskStatus: "",
    pmId: "",
    parentTaskId: "",
    taskStartDate: "",
    taskEndDate: "",
  });

  // 수정 폼 참고 데이터 조회
  useEffect(() => {
    if (!router.isReady || !taskId || !proId) return;

    dispatch(
      updateTaskContextRequest({
        taskId: Number(taskId),
        projectProId: Number(proId),
      })
    );
  }, [router.isReady, taskId, proId, dispatch]);

  // 조회된 태스크를 form에 세팅
  useEffect(() => {
    if (!task) return;

    setForm({
      taskId: task.taskId,
      proId: Number(proId),
      taskName: task.taskName || "",
      taskDesc: task.taskDesc || "",
      taskStatus: task.taskStatus || "",
      pmId: task.pmId || "",
      parentTaskId: task.parentTaskId || "",
      taskStartDate: task.taskStartDate || "",
      taskEndDate: task.taskEndDate || "",
    });
  }, [task, proId]);

  // 수정 성공
  useEffect(() => {
    if (!success) return;

    message.success("태스크가 수정되었습니다.");

    router.push({
      pathname: "/proj/task_detail",
      query: { taskId: form.taskId },
    });
  }, [success, router, form.taskId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.taskName.trim()) {
      message.warning("태스크명을 입력하세요.");
      return;
    }

    if (!form.taskDesc.trim()) {
      message.warning("태스크 설명을 입력하세요.");
      return;
    }

    if (!form.taskStatus) {
      message.warning("상태를 선택하세요.");
      return;
    }

    if (!form.pmId) {
      message.warning("담당자를 선택하세요.");
      return;
    }

    if (!form.taskStartDate) {
      message.warning("시작일을 선택하세요.");
      return;
    }

    if (!form.taskEndDate) {
      message.warning("종료일을 선택하세요.");
      return;
    }

    if (moment(form.taskStartDate).isAfter(moment(form.taskEndDate))) {
      message.warning("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }

    dispatch(
      updateTaskRequest({
        taskId: form.taskId,
        dto: {
          taskId: form.taskId,
          proId: form.proId,
          taskName: form.taskName.trim(),
          taskDesc: form.taskDesc.trim(),
          taskStatus: form.taskStatus,
          pmId: form.pmId,
          parentTaskId: form.parentTaskId || null,
          taskStartDate: form.taskStartDate,
          taskEndDate: form.taskEndDate,
        },
      })
    );
  };

  if (!task) {
    return (
      <main className="sb-content">
        <div className="sb-card">
          <div className="sb-card__body text-center">
            {loading
              ? "태스크 정보를 불러오는 중입니다..."
              : "태스크 정보를 찾을 수 없습니다."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="sb-content">
      <div className="sb-page-head">
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">
            홈 <i className="bi bi-chevron-right"></i> 업무{" "}
            <i className="bi bi-chevron-right"></i> 프로젝트{" "}
            <i className="bi bi-chevron-right"></i> 태스크 수정
          </div>
          <h1>태스크 수정</h1>
          <p>태스크 정보를 수정합니다.</p>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card__body">
          {error && (
            <div className="text-danger mb-3">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="sb-form-label">태스크명</label>
            <Input
              value={form.taskName}
              onChange={(e) =>
                handleChange("taskName", e.target.value)
              }
              placeholder="태스크명을 입력하세요"
            />
          </div>

          <div className="mb-3">
            <label className="sb-form-label">태스크 설명</label>
            <TextArea
              rows={4}
              value={form.taskDesc}
              onChange={(e) =>
                handleChange("taskDesc", e.target.value)
              }
              placeholder="태스크 설명을 입력하세요"
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="sb-form-label">상태</label>
              <Select
                value={form.taskStatus || undefined}
                options={STATUS_OPTIONS}
                placeholder="상태를 선택하세요"
                onChange={(value) =>
                  handleChange("taskStatus", value)
                }
                style={{ width: "100%" }}
              />
            </div>

            <div className="col-md-4">
              <label className="sb-form-label">담당자</label>
              <Select
                value={form.pmId || undefined}
                options={memberList.map((m) => ({
                  label: m.empName,
                  value: m.pmId,
                }))}
                placeholder="담당자를 선택하세요"
                onChange={(value) =>
                  handleChange("pmId", value)
                }
                style={{ width: "100%" }}
              />
            </div>

            <div className="col-md-4">
              <label className="sb-form-label">수정일</label>
              <Input
                value={moment().format("YYYY-MM-DD")}
                readOnly
                style={{ background: "#fafbfc" }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="sb-form-label">
              선행 작업
              <span
                className="text-faint"
                style={{ fontWeight: 400, fontSize: "12px" }}
              >
                {" "} (선택, 이 작업이 끝나야 시작 가능)
              </span>
            </label>

            <Select
              value={form.parentTaskId || undefined}
              allowClear
              placeholder="선행 작업 없음"
              options={taskList
                .filter((t) => t.taskId !== form.taskId)
                .map((t) => ({
                  label: `[${t.taskStatus}] ${t.taskName} (~${moment(
                    t.taskEndDate
                  ).format("YYYY-MM-DD")})`,
                  value: t.taskId,
                }))}
              onChange={(value) =>
                handleChange("parentTaskId", value || "")
              }
              style={{ width: "100%" }}
            />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="sb-form-label">시작일</label>
              <DatePicker
                value={
                  form.taskStartDate
                    ? moment(form.taskStartDate)
                    : null
                }
                onChange={(date) =>
                  handleChange(
                    "taskStartDate",
                    date ? date.format("YYYY-MM-DD") : ""
                  )
                }
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
              />
            </div>

            <div className="col-md-6">
              <label className="sb-form-label">종료일</label>
              <DatePicker
                value={
                  form.taskEndDate
                    ? moment(form.taskEndDate)
                    : null
                }
                onChange={(date) =>
                  handleChange(
                    "taskEndDate",
                    date ? date.format("YYYY-MM-DD") : ""
                  )
                }
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div className="sb-divider"></div>

          <div className="d-flex justify-content-end gap-2">
            <Button onClick={() => router.back()}>
              취소
            </Button>

            <Link href="/proj/proj_list">
              <Button>목록</Button>
            </Link>

            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
            >
              수정
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}