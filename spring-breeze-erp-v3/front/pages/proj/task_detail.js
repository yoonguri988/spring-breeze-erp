// pages/proj/task_detail.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import { Button, message } from "antd";
import ProjDeleteModal from "../../components/ProjDeleteModal";

import {
  fetchTaskDetailRequest,
  deleteTaskRequest,
  resetTaskState,
} from "../../reducers/task/taskReducer";

import moment from "moment";

export default function TaskDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { taskId } = router.query;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    currentTask,
    loading,
    error,
    success,
    deleteSuccess
  } = useSelector((state) => state.task);

  const task = currentTask?.task;
  const parentTask = currentTask?.parentTask;
  const impactTasks = currentTask?.impactTasks || [];
  const isDelayed = currentTask?.isDelayed;
  const proId = currentTask?.proId;
  const proName = task?.proName;

  // 상세 조회
  useEffect(() => {
    if (!router.isReady || !taskId) return;
    dispatch(fetchTaskDetailRequest(taskId));
  }, [router.isReady, taskId, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 삭제 성공
  useEffect(() => {
    if (deleteSuccess) {
      router.push({
        pathname:"/proj/proj_detail", query:{proId}});
    }
  }, [deleteSuccess, router, proId]);

  // 페이지 나갈 때 상태 초기화
  useEffect(() => {
    return () => {
      dispatch(resetTaskState());
    };
  }, [dispatch]);

  // 상태 뱃지
  const getStatusClass = (status) => {
    if (status === "DONE") {
      return "sb-badge sb-badge--green";
    }
    if (status === "DOING") {
      return "sb-badge sb-badge--blue";
    }
    return "sb-badge sb-badge--gray";
  };

  // 삭제
  const handleDelete = () => {
    dispatch(
      deleteTaskRequest({
        taskId: task.taskId,
        proId: proId,
      })
    );
    setDeleteModalOpen(false);
  };
  if (loading && !task) {
    return (
      <main className="sb-content">
        <div className="sb-card">
          <div className="sb-card__body text-center">
            태스크 정보를 불러오는 중입니다...
          </div>
        </div>
      </main>
    );
  }
  if (!loading && !task) {
    return (
      <main className="sb-content">
        <div className="sb-card">
          <div className="sb-card__body text-center">
            <p>태스크 정보를 찾을 수 없습니다.</p>
            {error && (
              <p className="text-danger">
                오류: {error}
              </p>
            )}
            <p>taskId: {taskId}</p>
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
            <Link href="/">홈</Link>
            <i className="bi bi-chevron-right"></i>
            업무
            <i className="bi bi-chevron-right"></i>
            프로젝트
            <i className="bi bi-chevron-right"></i>
            태스크 상세
          </div>
          <h1>태스크 상세조회</h1>
        </div>

        <div className="sb-page-head__actions">
          <Button
            type="default"
            size="small"
            onClick={() => router.back()}
          >
            <i className="bi bi-arrow-left"></i>{" "}
            이전
          </Button>

          <Link href="/proj/proj_list">
            <Button type="default" size="small">
              <i className="bi bi-list"></i>{" "}
              목록
            </Button>
          </Link>

          <Link
            href={`/proj/task_edit?taskId=${task.taskId}&proId=${proId}`}
          >
            <Button type="default" size="small">
              <i className="bi bi-pencil"></i>{" "}
              수정
            </Button>
          </Link>

          <Button
            type="default"
            size="small"
            danger
            onClick={() => setDeleteModalOpen(true)}
          >
            <i className="bi bi-trash3"></i>{" "}
            삭제
          </Button>
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card__head">
          <h2>태스크 상세조회</h2>
        </div>

        <div className="sb-card__body--flush">
          <table className="sb-table">
            <tbody>
              <tr>
                <th style={{ width: "25%" }}>프로젝트명</th>
                <td className="sb-table__name">
                    <Link href={`/proj/proj_detail?proId=${proId}`}>
                      {task.proName}
                    </Link>
                </td>
              </tr>
              <tr>
                <th style={{ width: "25%" }}>태스크명</th>
                <td className="sb-table__name">
                  {task.taskName}
                  {isDelayed && (
                    <span className="sb-badge sb-badge--red ms-2">
                      <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                      지연
                    </span>
                  )}
                </td>
              </tr>

              <tr>
                <th>태스크설명</th>
                <td className="sb-table__muted">{task.taskDesc}</td>
              </tr>

              <tr>
                <th>태스크상태</th>
                <td>
                  <span className={getStatusClass(task.taskStatus)}>
                    <span className="pip"></span>
                    {task.taskStatus}
                  </span>
                </td>
              </tr>

              <tr>
                <th>담당자이름</th>
                <td>{task.pmName}</td>
              </tr>

              <tr>
                <th>태스크시작일</th>
                <td className="tnum">
                  {task.taskStartDate
                    ? moment(task.taskStartDate).format("YYYY-MM-DD")
                    : ""}
                </td>
              </tr>

              <tr>
                <th>태스크종료일</th>
                <td className="tnum">
                  {task.taskEndDate
                    ? moment(task.taskEndDate).format("YYYY-MM-DD")
                    : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="sb-card mt-3">
        <div className="sb-card__head">
          <h2>
            <i className="bi bi-diagram-3"></i>{" "}
            작업 의존성
          </h2>
        </div>

        <div className="sb-card__body">
          <div className="flow-box">
            <div className="flow-title">선행 작업</div>

            {parentTask ? (
              <div className="flow-task">
                <Link href={`/proj/task_detail?taskId=${parentTask.taskId}`}>
                  {parentTask.taskName}
                </Link>

                <span className={getStatusClass(parentTask.taskStatus)}>
                  {parentTask.taskStatus}
                </span>
              </div>
            ) : (
              <div className="text-faint">
                최상위 태스크입니다.
              </div>
            )}
          </div>

          <div className="flow-arrow">
            <i className="bi bi-arrow-down"></i>
          </div>

          <div className="flow-box current-flow">
            <div className="flow-title">현재 작업</div>

            <div className="flow-task">
              <b>{task.taskName}</b>

              <span className={getStatusClass(task.taskStatus)}>
                {task.taskStatus}
              </span>
            </div>
          </div>

          {impactTasks.length > 0 && (
            <>
              <div className="flow-arrow">
                <i className="bi bi-arrow-down"></i>
              </div>

              <div className="flow-box">
                <div className="flow-title">
                  영향받는 후속 작업
                </div>

                {impactTasks.map((impactTask) => (
                  <div
                    key={impactTask.taskId}
                    className="flow-task"
                    style={{
                      marginLeft: `${(impactTask.depth - 1) * 30}px`,
                    }}
                  >
                    ↳{" "}

                    <Link
                      href={`/proj/task_detail?taskId=${impactTask.taskId}`}
                    >
                      {impactTask.taskName}
                    </Link>

                    <span
                      className={getStatusClass(impactTask.taskStatus)}
                    >
                      {impactTask.taskStatus}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ProjDeleteModal
        itemName="태스크"
        open={deleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={loading}
      />
    </main>
  );
}