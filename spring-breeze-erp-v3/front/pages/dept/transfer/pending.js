// pages/dept/transfer/pending.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "antd";
import {
  ArrowRightOutlined,
  BranchesOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { fetchPendingListRequest } from "../../../reducers/dept/deptTransferReducer";

export default function DeptTransferPendingPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { pendingList } = useSelector((state) => state.deptTransfer);

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query.keyword || "";
    setKeyword(q);
    dispatch(fetchPendingListRequest(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.isReady, router.query.keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push({
      pathname: "/dept/transfer/pending",
      query: keyword ? { keyword } : {},
    });
  };

  const rows = pendingList || [];

  return (
    <div className="sb-content">
      <div className="sb-card mb-3">
        <div className="sb-toolbar">
          <span className="fw-semibold">
            <BranchesOutlined /> 이관 대기 부서
          </span>
          <div className="grow" />
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <Input
              placeholder="부서명 또는 부서코드 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ minWidth: 200 }}
            />
            <Button htmlType="submit" icon={<SearchOutlined />}>
              검색
            </Button>
          </form>
        </div>

        <div
          className="px-3 pt-3"
          style={{ fontSize: 12, color: "var(--sb-ink-faint)" }}
        >
          <InfoCircleOutlined /> 부서 삭제(해체)를 진행하다가 사원 이관을 마치지
          못하고 나가신 경우, 여기서 다시 찾아 이어서 진행할 수 있습니다.
        </div>

        <div className="sb-card__body--flush mt-2">
          {rows.length > 0 ? (
            <table className="sb-table">
              <thead>
                <tr>
                  <th>부서명</th>
                  <th style={{ width: 140 }}>부서코드</th>
                  <th style={{ width: 120 }}>소속 사원 수</th>
                  <th style={{ width: 180 }}>이관 대기 시작</th>
                  <th style={{ width: 160 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.deptId}>
                    <td>{d.deptName}</td>
                    <td>
                      <span className="dept-code-chip">{d.deptCode}</span>
                    </td>
                    <td>
                      <span className="sb-badge sb-badge--amber">
                        {d.empCount}명
                      </span>
                    </td>
                    <td>{d.updatedAt}</td>
                    <td>
                      <Link
                        href={{
                          pathname: "/dept/transfer/list",
                          query: { deptId: d.deptId },
                        }}
                      >
                        <Button
                          type="primary"
                          size="small"
                          icon={<ArrowRightOutlined />}
                        >
                          이관 이어하기
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="sb-empty">
              <CheckCircleOutlined style={{ fontSize: 30, opacity: 0.5 }} />
              {keyword ? (
                <p>"{keyword}"에 해당하는 이관 대기 부서가 없습니다.</p>
              ) : (
                <p>이관 대기중인 부서가 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
