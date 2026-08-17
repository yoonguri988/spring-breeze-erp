// components/DeptDetailView.js
import React from "react";
import {
  ApartmentOutlined,
  RightOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const statusBadgeClass = (status) => {
  if (status === "재직") return "sb-badge sb-badge--green";
  if (status === "휴직") return "sb-badge sb-badge--amber";
  if (status === "퇴직") return "sb-badge sb-badge--cyan";
  return "sb-badge sb-badge--gray";
};

export default function DeptDetailView({
  dept,
  ancestorChain = [],
  deptEmpList = [],
  isMyDept = false,
}) {
  return (
    <>
      {isMyDept && (
        <div className="my-dept-banner">
          <CheckCircleOutlined /> 현재 내가 소속된 부서입니다.
        </div>
      )}

      {/* 부서 기본 정보 */}
      <div className="sb-card mb-3">
        <div className="sb-card__head">
          <h2>
            <ApartmentOutlined className="me-2 text-soft" />
            부서 기본 정보
          </h2>
        </div>
        <div className="sb-card__body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="dd-label">부서 이름</label>
              <div
                className="view-val view-val--accent"
                style={{ fontWeight: 700 }}
              >
                {dept.deptName}
              </div>
            </div>

            <div className="col-md-6">
              <label className="dd-label">부서 코드</label>
              <div className="view-val">
                <span className="dept-code-chip">{dept.deptCode}</span>
              </div>
            </div>

            <div className="col-md-6">
              <label className="dd-label">상위 부서</label>
              <div className="view-val">
                {dept.parentId ? (
                  <span
                    className="dept-code-chip"
                    style={{
                      background: "var(--sb-accent-soft)",
                      color: "var(--sb-accent)",
                    }}
                  >
                    {dept.parentName}
                  </span>
                ) : (
                  <>
                    <span className="dept-code-chip">최상위 부서</span>
                    <span className="view-val-empty ms-1">NULL</span>
                  </>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <label className="dd-label">부서장</label>
              <div className="view-val">
                {dept.leaderId ? (
                  <>
                    <span
                      className="sb-avatar"
                      style={{ width: 22, height: 22, fontSize: 11 }}
                    >
                      {(dept.leaderName || "").charAt(0)}
                    </span>
                    <span className="ms-1">
                      {dept.leaderName} {dept.leaderPosName}
                    </span>
                    <span
                      className="text-faint ms-1"
                      style={{ fontSize: 11.5 }}
                    >
                      #{dept.leaderEmpNo}
                    </span>
                  </>
                ) : (
                  <span className="view-val-empty">지정된 부서장 없음</span>
                )}
              </div>
            </div>

            <div className="col-12">
              <label className="dd-label">계층 경로</label>
              <div className="hier-preview">
                {ancestorChain.map((node, i) => (
                  <React.Fragment key={i}>
                    <span
                      className={`hier-node${i === ancestorChain.length - 1 ? " hier-node--new" : ""}`}
                    >
                      {node}
                    </span>
                    {i !== ancestorChain.length - 1 && (
                      <RightOutlined className="hier-sep" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 소속 사원 */}
      <div className="sb-card">
        <div className="sb-card__head">
          <h2>
            <TeamOutlined className="me-2 text-soft" />
            소속 사원
          </h2>
          <div className="right">
            <span className="sb-badge sb-badge--gray">
              {deptEmpList.length}명
            </span>
          </div>
        </div>
        <div className="sb-card__body--flush">
          {deptEmpList.length > 0 ? (
            <table className="sb-table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>사원번호</th>
                  <th>이름</th>
                  <th style={{ width: 110 }}>직급</th>
                  <th style={{ width: 180 }}>이메일</th>
                  <th style={{ width: 130 }}>연락처</th>
                  <th style={{ width: 100 }}>상태</th>
                  <th style={{ width: 110 }}>입사일</th>
                </tr>
              </thead>
              <tbody>
                {deptEmpList.map((e) => (
                  <tr key={e.empId}>
                    <td className="sb-hr-cell tnum">{e.empNo}</td>
                    <td>
                      <div className="sb-rowuser">
                        <span
                          className="sb-avatar"
                          style={{ width: 26, height: 26, fontSize: 11.5 }}
                        >
                          {(e.empName || "").charAt(0)}
                        </span>
                        <span className="sb-table__name">{e.empName}</span>
                      </div>
                    </td>
                    <td>
                      <span>{e.posName}</span>
                      <span className="text-faint" style={{ fontSize: 11 }}>
                        #{e.posId}
                      </span>
                    </td>
                    <td className="sb-hr-cell" style={{ fontSize: 12.5 }}>
                      {e.empEmail}
                    </td>
                    <td className="sb-hr-cell tnum" style={{ fontSize: 12.5 }}>
                      {e.empMobile}
                    </td>
                    <td>
                      <span className={statusBadgeClass(e.empStatus)}>
                        {e.empStatus}
                      </span>
                    </td>
                    <td className="sb-hr-cell" style={{ fontSize: 12.5 }}>
                      {e.hireDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="sb-empty">
              <TeamOutlined style={{ fontSize: 30, opacity: 0.5 }} />
              <p>소속 사원이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
