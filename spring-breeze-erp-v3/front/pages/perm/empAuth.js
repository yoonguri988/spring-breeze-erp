// pages/perm/empAuth.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Row, Col, Card, Button, Tag, Avatar, message } from "antd";
import { PlusOutlined, CloseOutlined, ArrowLeftOutlined, SafetyCertificateOutlined, } from "@ant-design/icons";

import {
  listPermRequest, empAuthListRequest, grantPermRequest,
  revokePermRequest, clearEmpAuth, resetPermState,
} from "../../reducers/perm/permReducer";

// 재직 상태별 Tag 색상
const STATUS_COLOR = {
  재직: "green",
  휴직: "orange",
  퇴직: "red",
};

export default function EmpAuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { empId } = router.query;

  const { permList, empAuthList, empAuthTargetId, loading, success, error } =
    useSelector((state) => state.perm);

  // 사원 상세 정보는 emp Reducer에서 가져옴
  const { currentEmp } = useSelector((state) => state.emp);

  // ─── 데이터 로드 ───
  useEffect(() => {
    if (!empId) return;
    dispatch(listPermRequest()); // 전체 권한 목록 (부여 가능 목록용)
    dispatch(empAuthListRequest(Number(empId))); // 사원의 현재 권한

    return () => {
      dispatch(clearEmpAuth());
    };
  }, [dispatch, empId]);

  // ─── 부여/회수 결과 처리 ───
  useEffect(() => {
    if (!success) return;

    message.success("권한이 변경되었습니다.");
    dispatch(resetPermState());
    dispatch(empAuthListRequest(Number(empId))); // 권한 목록 새로고침
    dispatch(listPermRequest()); // 전체 목록도 갱신 (카운트 반영)
  }, [success, dispatch, empId]);

  useEffect(() => {
    if (!error) return;
    message.error(error);
    dispatch(resetPermState());
  }, [error, dispatch]);

  // ─── 부여/회수 ───
  const handleGrant = (autId) => {
    dispatch(grantPermRequest({ empId: Number(empId), autId }));
  };

  const handleRevoke = (autId) => {
    dispatch(revokePermRequest({ empId: Number(empId), autId }));
  };

  // 이미 부여된 권한 ID 목록 (부여 가능 목록에서 제외용)
  const grantedAutIds = empAuthList.map((a) => a.autId);

  // 부여 가능한 권한 = 전체 - 이미 부여된 것
  const availableAuths = permList.filter(
    (p) => !grantedAutIds.includes(p.autId)
  );

  //////
  return (
    <div className="sb-page">
      {/* 페이지 헤더 */}
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
            조직 관리 &gt; 권한 관리 &gt; 사원 권한 부여
          </div>
          <h1>사원 권한 관리</h1>
          <p>선택한 사원에게 권한을 부여하거나 회수합니다.</p>
        </div>
        <div className="sb-page-head__actions">
          <Link
            href={{
              pathname: "/emp/detail",
              query: { empId },
            }}
          >
            <Button icon={<ArrowLeftOutlined />}>사원 상세로</Button>
          </Link>
        </div>
      </div>

      <Row gutter={16}>
        {/* ── 좌측: 사원 정보 ── */}
        <Col xs={24} lg={8}>
          <Card title="사원 정보">
            {currentEmp ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <Avatar size={56}>
                    {currentEmp.empName
                      ? currentEmp.empName.charAt(0)
                      : "?"}
                  </Avatar>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 650 }}>
                      {currentEmp.empName}
                    </div>
                    <div style={{ color: "#999" }}>
                      {currentEmp.deptName} · {currentEmp.posName}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: "#999", fontSize: 12 }}>사번</div>
                  <div>{currentEmp.empNo}</div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: "#999", fontSize: 12 }}>이메일</div>
                  <div>{currentEmp.empEmail}</div>
                </div>
                <div>
                  <div style={{ color: "#999", fontSize: 12 }}>재직 상태</div>
                  <Tag color={STATUS_COLOR[currentEmp.empStatus] || "default"}>
                    {currentEmp.empStatus}
                  </Tag>
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "#999",
                }}
              >
                사원 정보를 불러오는 중...
              </div>
            )}
          </Card>
        </Col>

        {/* ── 우측: 권한 관리 ── */}
        <Col xs={24} lg={16}>
          {/* 현재 부여된 권한 */}
          <Card
            title="현재 부여된 권한"
            extra={
              <span style={{ color: "#999" }}>{empAuthList.length}개</span>
            }
            style={{ marginBottom: 16 }}
          >
            {empAuthList.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "#999",
                }}
              >
                <SafetyCertificateOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <p>부여된 권한이 없습니다.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {empAuthList.map((auth) => (
                  <div
                    key={auth.empAutId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{auth.autName}</span>
                    <Button
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => handleRevoke(auth.autId)}
                      loading={loading}
                    >
                      회수
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 부여 가능한 권한 */}
          <Card
            title="부여 가능한 권한"
            extra={
              <span style={{ color: "#999" }}>
                회사 전체 권한 중 아직 부여되지 않은 권한
              </span>
            }
          >
            {availableAuths.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "#999",
                }}
              >
                <SafetyCertificateOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <p>
                  {permList.length === 0
                    ? "등록된 권한이 없습니다."
                    : "모든 권한이 이미 부여되었습니다."}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {availableAuths.map((auth) => (
                  <div
                    key={auth.autId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600 }}>{auth.autName}</span>
                      <Tag
                        style={{ marginLeft: 8 }}
                        color="default"
                      >
                        {auth.autCount || 0}명 부여
                      </Tag>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => handleGrant(auth.autId)}
                      loading={loading}
                    >
                      부여
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
