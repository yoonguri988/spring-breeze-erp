// pages/index.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin, Card, Empty } from "antd";

export default function Home() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      router.replace("/auth/login");
    } else {
      setChecked(true); // 인증 확인됨 → 홈 콘텐츠 렌더
    }
  }, [router]);

  if (!checked) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}
      >
        <Spin size="large" tip="확인 중…" />
      </div>
    );
  }

  // TODO: reducer/saga 연동 후 실제 대시보드 위젯(sb-stat, sb-card 등)으로 교체
  return (
    <Card className="sb-card" bordered={false}>
      <Empty description="대시보드 화면은 준비 중입니다." />
    </Card>
  );
}
