// pages/sal/my/index.js
// 내 급여정보 (전 직원 공통) - 급여기준 조회 / 급여명세서 조회 / 급여 수령 계좌 등록·수정
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Tabs,
  Descriptions,
  Table,
  Tag,
  Empty,
  Button,
  Modal,
  Form,
  Input,
  Pagination,
  Drawer,
  Divider,
  message,
} from "antd";
import { EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";

import { fetchMySalStdRequest } from "../../reducers/sal/salStdReducer";
import { fetchMyPaymentsRequest } from "../../reducers/sal/salPayReducer";
import {
  fetchMyAcctRequest,
  registerMyAcctRequest,
  updateMyAcctRequest,
  resetSalAcctState,
} from "../../reducers/sal/salAcctReducer";
import { formatWon } from "../../utils/currency";

const { TabPane } = Tabs;

const STATUS_LABEL = {
  PENDING: { text: "대기", color: "gold" },
  APPROVED: { text: "승인", color: "blue" },
  PAID: { text: "지급완료", color: "green" },
  REJECTED: { text: "반려", color: "red" },
};

export default function MySalaryPage() {
  const dispatch = useDispatch();

  const { myStd, myStdLoading, myStdError } = useSelector(
    (state) => state.salStd,
  );
  const { myPayments, myPaging, myLoading } = useSelector(
    (state) => state.salPay,
  );
  const {
    myAcct,
    myAcctLoading,
    myAcctError,
    loading: acctSaving,
    success: acctSuccess,
    error: acctError,
  } = useSelector((state) => state.salAcct);

  const [page, setPage] = useState(1);
  const [detailTarget, setDetailTarget] = useState(null);
  const [acctModalOpen, setAcctModalOpen] = useState(false);
  const [acctModalMode, setAcctModalMode] = useState("register"); // "register" | "update"
  const [form] = Form.useForm();
  const hasAcct = !!myAcct;

  useEffect(() => {
    dispatch(fetchMySalStdRequest());
    dispatch(fetchMyPaymentsRequest({ page: 0, size: 10 }));
    dispatch(fetchMyAcctRequest());
  }, [dispatch]);

  useEffect(() => {
    if (acctSaving) return;
    if (acctSuccess) {
      message.success(
        acctModalMode === "update"
          ? "계좌 정보가 수정되었습니다."
          : "계좌가 등록되었습니다.",
      );
      setAcctModalOpen(false);
      dispatch(resetSalAcctState());
    } else if (acctError) {
      message.error(acctError);
      dispatch(resetSalAcctState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acctSaving, acctSuccess, acctError, dispatch]);

  const runPaymentSearch = (nextPage = 1) => {
    setPage(nextPage);
    dispatch(fetchMyPaymentsRequest({ page: nextPage - 1, size: 10 }));
  };

  const openAcctModal = () => {
    setAcctModalOpen(true);
    setAcctModalMode(hasAcct ? "update" : "register");
    form.setFieldsValue({
      bankName: myAcct?.bankName,
      acctNo: myAcct?.acctNo,
      hldrName: myAcct?.hldrName,
    });
  };

  const handleAcctSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (acctModalMode === "update") {
        dispatch(updateMyAcctRequest(values));
      } else {
        dispatch(registerMyAcctRequest(values));
      }
    } catch (e) {
      // 폼 검증 실패
    }
  };

  const payColumns = [
    {
      title: "지급월",
      dataIndex: "payMonth",
      key: "payMonth",
      width: 100,
      render: (v) => (v ? moment(v).format("YYYY-MM") : "-"),
    },
    {
      title: "기본급",
      dataIndex: "baseSal",
      key: "baseSal",
      align: "right",
      render: formatWon,
    },
    {
      title: "수당합계",
      dataIndex: "allowTotal",
      key: "allowTotal",
      align: "right",
      render: formatWon,
    },
    {
      title: "공제합계",
      dataIndex: "dedtTotal",
      key: "dedtTotal",
      align: "right",
      render: formatWon,
    },
    {
      title: "실지급액",
      dataIndex: "netPay",
      key: "netPay",
      align: "right",
      render: (v) => <b>{formatWon(v)}</b>,
    },
    {
      title: "상태",
      dataIndex: "stat",
      key: "stat",
      width: 90,
      align: "center",
      render: (v) => {
        const info = STATUS_LABEL[v] || { text: v, color: "default" };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: "",
      key: "detail",
      width: 60,
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setDetailTarget(record)}
        />
      ),
    },
  ];

  return (
    <div className="sb-page">
      <div className="sb-page-head" style={{ marginBottom: 16 }}>
        <div className="sb-page-head__txt">
          <div className="sb-breadcrumb">급여관리 &gt; 내 급여정보</div>
          <h1>내 급여정보</h1>
          <p>
            본인의 급여기준, 급여명세서, 급여 수령 계좌를 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <Card>
        <Tabs defaultActiveKey="std">
          <TabPane tab="급여기준" key="std">
            {myStdLoading ? (
              <p>조회 중...</p>
            ) : myStdError || !myStd ? (
              <Empty description="등록된 급여기준이 없습니다." />
            ) : (
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="기본급">
                  {formatWon(myStd.baseSal)}
                </Descriptions.Item>
                <Descriptions.Item label="연봉">
                  {formatWon(myStd.annuSal)}
                </Descriptions.Item>
                <Descriptions.Item label="적용시작일">
                  {myStd.startDate}
                </Descriptions.Item>
                <Descriptions.Item label="적용종료일">
                  {myStd.endDate || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="상태">
                  {myStd.actv ? (
                    <Tag color="green">적용중</Tag>
                  ) : (
                    <Tag>종료</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            )}
          </TabPane>

          <TabPane tab="급여명세서" key="pay">
            <Table
              rowKey="payId"
              columns={payColumns}
              dataSource={myPayments}
              loading={myLoading}
              pagination={false}
              locale={{ emptyText: "급여명세서 내역이 없습니다." }}
            />
            {myPaging && myPaging.totalElements > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: 12,
                }}
              >
                <Pagination
                  size="small"
                  current={page}
                  total={myPaging.totalElements}
                  pageSize={myPaging.size || 10}
                  showSizeChanger={false}
                  onChange={runPaymentSearch}
                />
              </div>
            )}
          </TabPane>

          <TabPane tab="급여 수령 계좌" key="acct">
            {myAcctLoading ? (
              <p>조회 중...</p>
            ) : myAcctError || !myAcct ? (
              <div>
                <Empty
                  description="등록된 급여 수령 계좌가 없습니다."
                  style={{ marginBottom: 16 }}
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAcctModal}
                  >
                    계좌 등록
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 12,
                  }}
                >
                  <Button icon={<EditOutlined />} onClick={openAcctModal}>
                    수정
                  </Button>
                </div>
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="은행">
                    {myAcct.bankName}
                  </Descriptions.Item>
                  <Descriptions.Item label="계좌번호">
                    {myAcct.acctNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="예금주">
                    {myAcct.hldrName}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={
          acctModalMode === "update"
            ? "급여 수령 계좌 수정"
            : "급여 수령 계좌 등록"
        }
        open={acctModalOpen}
        onCancel={() => setAcctModalOpen(false)}
        onOk={handleAcctSubmit}
        okText={acctModalMode === "update" ? "수정" : "등록"}
        okButtonProps={{ loading: acctSaving }}
        cancelText="취소"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="bankName"
            label="은행명"
            rules={[{ required: true, message: "은행명을 입력해 주세요." }]}
          >
            <Input maxLength={30} placeholder="예: 국민은행" />
          </Form.Item>
          <Form.Item
            name="acctNo"
            label="계좌번호"
            rules={[{ required: true, message: "계좌번호를 입력해 주세요." }]}
          >
            <Input maxLength={30} placeholder="'-' 없이 숫자만 입력" />
          </Form.Item>
          <Form.Item
            name="hldrName"
            label="예금주명"
            rules={[{ required: true, message: "예금주명을 입력해 주세요." }]}
          >
            <Input maxLength={30} />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="급여명세서 상세"
        open={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        width={480}
        destroyOnClose
      >
        {detailTarget && (
          <>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="지급월">
                {moment(detailTarget.payMonth).format("YYYY년 MM월")}
              </Descriptions.Item>
              <Descriptions.Item label="상태">
                <Tag color={STATUS_LABEL[detailTarget.stat]?.color}>
                  {STATUS_LABEL[detailTarget.stat]?.text}
                </Tag>
              </Descriptions.Item>
              {detailTarget.stat === "REJECTED" && (
                <Descriptions.Item label="반려사유">
                  {detailTarget.rejRsn || "-"}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="기본급">
                {formatWon(detailTarget.baseSal)}
              </Descriptions.Item>
              <Descriptions.Item label="수당합계">
                {formatWon(detailTarget.allowTotal)}
              </Descriptions.Item>
              <Descriptions.Item label="공제합계">
                {formatWon(detailTarget.dedtTotal)}
              </Descriptions.Item>
              <Descriptions.Item label="실지급액">
                <b>{formatWon(detailTarget.netPay)}</b>
              </Descriptions.Item>
              <Descriptions.Item label="지급일시">
                {detailTarget.paidAt
                  ? moment(detailTarget.paidAt).format("YYYY-MM-DD HH:mm")
                  : "-"}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left" plain>
              지급 계좌
            </Divider>
            {detailTarget.bankName ? (
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="은행">
                  {detailTarget.bankName}
                </Descriptions.Item>
                <Descriptions.Item label="계좌번호">
                  {detailTarget.acctNo}
                </Descriptions.Item>
                <Descriptions.Item label="예금주">
                  {detailTarget.hldrName}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <p style={{ color: "#999" }}>지급 시점 계좌 정보가 없습니다.</p>
            )}

            <Divider orientation="left" plain>
              수당/공제 항목
            </Divider>
            <Table
              rowKey="itemId"
              size="small"
              pagination={false}
              dataSource={detailTarget.items || []}
              columns={[
                {
                  title: "구분",
                  dataIndex: "itemType",
                  key: "itemType",
                  width: 70,
                  render: (v) =>
                    v === "ALLOWANCE" ? (
                      <Tag color="blue">수당</Tag>
                    ) : (
                      <Tag color="volcano">공제</Tag>
                    ),
                },
                { title: "항목명", dataIndex: "itemName", key: "itemName" },
                {
                  title: "금액",
                  dataIndex: "amt",
                  key: "amt",
                  align: "right",
                  render: formatWon,
                },
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  );
}
