// pages/index.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin, Card, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { loadUserRequest } from "../reducers/auth/authReducer";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  const { user, acccessToken } = useSelector((state) => state.auth);

  // TODO: reducer/saga 연동 후 실제 대시보드 위젯(sb-stat, sb-card 등)으로 교체
  return (
    <Card className="sb-card" bordered={false}>
      <Empty description={t("dashboardComingSoon")} />
    </Card>
  );
}
