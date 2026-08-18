// pages/proj/proj_edit.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  Card,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  message,
} from "antd";

import {
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";

import {
  fetchProjDetailRequest,
  updateProjRequest,
} from "../../reducers/proj/projReducer";

const { TextArea } = Input;

const STATUS_OPTIONS = [
  { label: "TODO", value: "TODO" },
  { label: "DOING", value: "DOING" },
  { label: "DONE", value: "DONE" },
];

export default function ProjEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentProject, loading, error, success } = useSelector(
    (state) => state.proj
  );

  const dto = currentProject?.dto;

  const [form, setForm] = useState({
    proId: "",
    proName: "",
    proDesc: "",
    proStatus: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!router.isReady) return;

    const proId = Number(router.query.proId);

    if (!proId) return;

    dispatch(fetchProjDetailRequest(proId));
  }, [router.isReady, router.query.proId, dispatch]);

  useEffect(() => {
    if (!dto) return;

    setForm({
      proId: dto.proId,
      proName: dto.proName || "",
      proDesc: dto.proDesc || "",
      proStatus: dto.proStatus || "",
      startDate: dto.startDate || "",
      endDate: dto.endDate || "",
    });
  }, [dto]);

  useEffect(() => {
    if (!success) return;

    message.success("프로젝트가 수정되었습니다.");

    router.push({
      pathname: "/proj/proj_detail",
      query: {
        proId: form.proId,
      },
    });
  }, [success]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.proName.trim()) {
      message.warning("프로젝트명을 입력하세요.");
      return;
    }

    if (!form.proDesc.trim()) {
      message.warning("프로젝트 설명을 입력하세요.");
      return;
    }

    if (!form.proStatus) {
      message.warning("상태를 선택하세요.");
      return;
    }

    if (!form.startDate) {
      message.warning("시작일을 선택하세요.");
      return;
    }

    if (!form.endDate) {
      message.warning("종료일을 선택하세요.");
      return;
    }

    if (dayjs(form.startDate).isAfter(dayjs(form.endDate))) {
      message.warning("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }

    dispatch(
      updateProjRequest({
        proId: form.proId,
        dto: {
          proId: form.proId,
          proName: form.proName,
          proDesc: form.proDesc,
          proStatus: form.proStatus,
          startDate: form.startDate,
          endDate: form.endDate,
        },
      })
    );
  };

  const handleCancel = () => {
    router.push({
      pathname: "/proj/proj_detail",
      query: {
        proId: form.proId,
      },
    });
  };

  if (!dto) {
    return (
      <main className="sb-content">
        <div className="sb-page-head">
          <div className="sb-page-head__txt">
            <div className="sb-breadcrumb">
              홈 <i className="bi bi-chevron-right"></i> 업무{" "}
              <i className="bi bi-chevron-right"></i> 프로젝트{" "}
              <i className="bi bi-chevron-right"></i> 수정
            </div>

            <h1>프로젝트 수정</h1>

            <p>프로젝트 정보를 수정합니다.</p>
          </div>
        </div>

        <Card loading={loading} />
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
            <i className="bi bi-chevron-right"></i> 수정
          </div>

          <h1>프로젝트 수정</h1>

          <p>프로젝트 정보를 수정합니다.</p>
        </div>
      </div>

      <Card>
        <div className="sb-card__body">
          {error && (
            <div
              style={{
                color: "#ff4d4f",
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="sb-form-label">
              프로젝트명
            </label>

            <Input
              value={form.proName}
              onChange={(e) =>
                handleChange("proName", e.target.value)
              }
              placeholder="프로젝트명을 입력하세요"
            />
          </div>

          <div className="mb-3">
            <label className="sb-form-label">
              프로젝트 설명
            </label>

            <TextArea
              rows={4}
              value={form.proDesc}
              onChange={(e) =>
                handleChange("proDesc", e.target.value)
              }
              placeholder="프로젝트에 대한 설명을 입력하세요"
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="sb-form-label">
                상태
              </label>

              <Select
                style={{ width: "100%" }}
                value={form.proStatus || undefined}
                options={STATUS_OPTIONS}
                placeholder="상태를 선택하세요"
                onChange={(value) =>
                  handleChange("proStatus", value)
                }
              />
            </div>

            <div className="col-md-4">
              <label className="sb-form-label">
                시작일
              </label>

              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                value={
                  form.startDate
                    ? dayjs(form.startDate)
                    : null
                }
                onChange={(date) =>
                  handleChange(
                    "startDate",
                    date
                      ? date.format("YYYY-MM-DD")
                      : ""
                  )
                }
              />
            </div>

            <div className="col-md-4">
              <label className="sb-form-label">
                종료일
              </label>

              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                value={
                  form.endDate
                    ? dayjs(form.endDate)
                    : null
                }
                onChange={(date) =>
                  handleChange(
                    "endDate",
                    date
                      ? date.format("YYYY-MM-DD")
                      : ""
                  )
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="sb-form-label">
              수정일
            </label>

            <Input
              value={
                dto.updatedAt
                  ? dayjs(dto.updatedAt).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : "-"
              }
              readOnly
              style={{
                maxWidth: 250,
                background: "#fafbfc",
              }}
            />
          </div>

          <div className="sb-divider"></div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <Button onClick={handleCancel}>
              취소
            </Button>

            <Link
              href={{
                pathname: "/proj/proj_list",
              }}
            >
              <Button icon={<ArrowLeftOutlined />}>
                목록
              </Button>
            </Link>

            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSubmit}
            >
              수정
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}