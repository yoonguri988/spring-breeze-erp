import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, Input, Select, DatePicker, message } from "antd";
import { createTaskRequest, createTaskContextRequest } from "../../reducers/task/taskReducer";

import moment from "moment";

const { TextArea } = Input;

const STATUS_OPTIONS = [
  { label: "TODO", value: "TODO" },
  { label: "DOING", value: "DOING" },
  { label: "DONE", value: "DONE" },
];

export default function TaskCreatePage() {
    const router = useRouter();
    const { proId } = router.query;
    const dispatch = useDispatch();

    const { loading, error, success, createContext } = useSelector((state) => state.task);
    const { memberList, taskList } = createContext;

    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskStatus, setTaskStatus] = useState("");
    const [pmId, setPmId] = useState("");
    const [parentTaskId, setParentTaskId] = useState("");
    const [taskStartDate, setTaskStartDate] = useState("");
    const [taskEndDate, setTaskEndDate] = useState("");


    useEffect(() => {
    if (!router.isReady || !proId) return;

    dispatch(createTaskContextRequest(proId));
    }, [router.isReady, proId, dispatch]);

    useEffect(() => {
    if (success) {
        router.push("/task/task_list");
    }
    }, [success, router]);

    const handleReset = () => {
        setTaskName("");
        setTaskDesc("");
        setTaskStatus("");
        setPmId("");
        setParentTaskId("");
        setTaskStartDate("");
        setTaskEndDate("");
    };

    const onFinish = () => {
    if (!taskName.trim()) {
      message.warning("태스크명을 입력하세요.");
      return;
    }

    if (!taskDesc.trim()) {
      message.warning("태스크 설명을 입력하세요.");
      return;
    }

    if (!taskStatus) {
      message.warning("상태를 선택하세요.");
      return;
    }

    if (!pmId) {
    message.warning("담당자를 선택하세요.");
    return;
    }

    if (!taskStartDate) {
      message.warning("시작일을 선택하세요.");
      return;
    }

    if (!taskEndDate) {
      message.warning("종료일을 선택하세요.");
      return;
    }

    if (moment(taskStartDate).isAfter(moment(taskEndDate))) {
      message.warning("종료일은 시작일 이후로 선택하세요.");
      return;
    }

    dispatch(
      createTaskRequest({
        taskName: taskName.trim(),
        taskDesc: taskDesc.trim(),
        taskStatus,
        pmId,
        parentTaskId: parentTaskId || null,
        taskStartDate,
        taskEndDate,
        proId,
      })
    );
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
            태스크
            <i className="bi bi-chevron-right"></i>
            생성
          </div>
          <h1>태스크 생성</h1>
          <p>프로젝트에 새 태스크를 추가합니다.</p>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card__body">
          <form id="taskCreateForm" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="mb-3">
              <label htmlFor="task_name" className="sb-form-label">
                태스크명
              </label>
              <Input id="task_name" 
                     name="task_name" 
                     value={taskName}
                     onChange={(e)=>setTaskName(e.target.value)}
                     placeholder="태스크명을 입력하세요" />
            </div>

            <div className="mb-3">
              <label htmlFor="task_desc" className="sb-form-label">
                태스크 설명
              </label>
              <TextArea
                id="task_desc"
                name="task_desc"
                value={taskDesc}
                onChange={(e)=>setTaskDesc(e.target.value)}
                placeholder="태스크에 대한 설명을 입력하세요"
                rows={4}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label htmlFor="task_status" className="sb-form-label">
                  상태
                </label>
                <Select
                  id="task_status"
                  value={taskStatus || undefined}
                  onChange={(value) => setTaskStatus(value)}
                  options={STATUS_OPTIONS}
                  placeholder="상태를 선택하세요"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="pm_id_name" className="sb-form-label">
                  담당자 선택
                </label>
                <Select
                value={pmId || undefined}
                onChange={(value) => setPmId(value)}
                options={memberList.map((m) => ({
                    label: m.empName,
                    value: m.pmId,
                }))}
                placeholder="담당자 선택"
                style={{ width: "100%" }}
                />
                </div>
                <div className="col-md-4">
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
                    value={parentTaskId || undefined}
                    onChange={(value) => setParentTaskId(value)}
                    placeholder="선행 작업 없음"
                    allowClear
                    options={taskList.map((t) => ({
                    label: `[${t.taskStatus}] ${t.taskName} (~${moment(
                        t.taskEndDate
                    ).format("YYYY-MM-DD")})`,
                    value: t.taskId,
                    }))}
                    style={{ width: "100%" }}
                />
                </div>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="task_start_date" className="sb-form-label">
                  시작일
                </label>
                <DatePicker
                id="task_start_date"
                value={ taskStartDate ? moment(taskStartDate, "YYYY-MM-DD") : null }
                onChange={(date) => setTaskStartDate( date ? date.format("YYYY-MM-DD") : "" ) }
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="task_end_date" className="sb-form-label">
                  종료일
                </label>
                <DatePicker
                id="task_end_date"
                value={ taskEndDate ? moment(taskEndDate, "YYYY-MM-DD") : null }
                onChange={(date) => setTaskEndDate( date ? date.format("YYYY-MM-DD") : "" ) }
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                />
              </div>
            </div>

            {error && <div className="text-danger mb-3">{error}</div>}

            <div className="sb-divider"></div>

            <div className="d-flex justify-content-end gap-2">
              <Button type="default" htmlType="button" onClick={() => router.back()}>
                취소
              </Button>

              <Link href="/proj/proj_list">
                <Button>목록</Button>
              </Link>

              <Button type="primary" htmlType="button" loading={loading} onClick={onFinish}>
                등록
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}