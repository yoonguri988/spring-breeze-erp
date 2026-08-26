import { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
    Table, Select, Button, Space, Tabs,
    DatePicker, InputNumber, Popconfirm, message,
} from "antd";
import {
    fetchPendingDelegReqRequest,
    approveDelegReqRequest,
    rejectDelegReqRequest,
    resetProcessState,
    fetchDelegHistoryRequest,
} from "../../../../reducers/appr/apprLineDelegationReducer";
import { fetchApprLogRequest } from "../../../../reducers/appr/apprLogReducer";
import StatusBadge from "../../../../components/appr/StatusBadge";
import PageHeader from "../../../../components/appr/PageHeader";
import { useServerTable } from "../../../../components/appr/useServerTable";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function DelegationAdminPage() {
    const dispatch = useDispatch();
    const { t } = useTranslation(["appr", "common"]);

    const {
        pendingRequests, pendingLoading, pendingError,
        history, historyTotal, historyLoading, historyError,
        processSubmitting, processSuccess, processError,
    } = useSelector((state) => state.apprLineDelegation);

    const {
        logs, logsTotal, logsLoading, logsError,
    } = useSelector((state) => state.apprLog);

    const [tab, setTab] = useState("pending");

    // 처리이력 탭 필터/페이지
    const [histStatus, setHistStatus] = useState(undefined);
    const [histEmpId, setHistEmpId] = useState(undefined);
    const [histDateRange, setHistDateRange] = useState([null, null]);

    // 감사로그 탭 필터/페이지
    const [logDocId, setLogDocId] = useState(undefined);
    const [logEmpId, setLogEmpId] = useState(undefined);
    const [logDateRange, setLogDateRange] = useState([null, null]);

    // 대기중 요청 조회
    useEffect(() => {
        if (tab === "pending") {
            dispatch(fetchPendingDelegReqRequest());
        }
    }, [dispatch, tab]);

    // 처리이력 조회
    const { page: histPage, setPage: setHistPage, pageSize: histPageSize } = useServerTable({
        active: tab === "history",
        cond: { reqStatus: histStatus, reqEmpId: histEmpId, startDate: histDateRange[0], endDate: histDateRange[1] },
        onFetch: (page, size) => dispatch(fetchDelegHistoryRequest({
            cond: { reqStatus: histStatus, reqEmpId: histEmpId, startDate: histDateRange[0], endDate: histDateRange[1] },
            page,
            size,
        })),
        deps: [histStatus, histEmpId, histDateRange],
    });

    // 감사로그 조회
    const { page: logPage, setPage: setLogPage, pageSize: logPageSize } = useServerTable({
        active: tab === "logs",
        cond: { docId: logDocId, empId: logEmpId, startDate: logDateRange[0], endDate: logDateRange[1] },
        onFetch: (page, size) => dispatch(fetchApprLogRequest({
            cond: { docId: logDocId, empId: logEmpId, startDate: logDateRange[0], endDate: logDateRange[1] },
            page,
            size,
        })),
        deps: [logDocId, logEmpId, logDateRange],
    });

    // 승인/반려 처리 결과 반영
    useEffect(() => {
        if (processSuccess) {
            message.success("처리되었습니다.");
            dispatch(fetchPendingDelegReqRequest());
            dispatch(resetProcessState());
        }
    }, [processSuccess]);

    useEffect(() => {
        if (processError) {
            message.error(processError);
            dispatch(resetProcessState());
        }
    }, [processError]);

    const handleApprove = (reqId) => dispatch(approveDelegReqRequest({reqId}));
    const handleReject = (reqId) => dispatch(rejectDelegReqRequest({reqId}));

    // 대기중 요청 탭
    const pendingColumns = [
        { title: "요청ID", dataIndex: "reqId", key: "reqId", width: 80 },
        { title: "문서", dataIndex: "docTitle", key: "docTitle" },
        { title: "원결재자", dataIndex: "oriEmpName", key: "oriEmpName", width: 110 },
        { title: "대결자", dataIndex: "newEmpName", key: "newEmpName", width: 110 },
        { title: "요청자", dataIndex: "reqEmpName", key: "reqEmpName", width: 110 },
        { title: "사유", dataIndex: "reqReason", key: "reqReason", ellipsis: true },
        { title: "요청일", dataIndex: "createdAt", key: "createdAt", width: 160 },
        {
            title: "처리",
            key: "action",
            width: 170,
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="이 위임/대결 요청을 승인하시겠습니까?"
                        onConfirm={() => handleApprove(record.reqId)}
                    >
                        <Button size="small" type="primary" loading={processSubmitting}>승인</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="이 위임/대결 요청을 반려하시겠습니까?"
                        onConfirm={() => handleReject(record.reqId)}
                    >
                        <Button size="small" danger loading={processSubmitting}>반려</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 처리이력 탭
    const historyColumns = [
        { title: "요청ID", dataIndex: "reqId", key: "reqId", width: 80 },
        { title: "문서", dataIndex: "docTitle", key: "docTitle" },
        { title: "원결재자", dataIndex: "oriEmpName", key: "oriEmpName", width: 110 },
        { title: "대결자", dataIndex: "newEmpName", key: "newEmpName", width: 110 },
        { title: "요청자", dataIndex: "reqEmpName", key: "reqEmpName", width: 110 },
        { title: "처리자", dataIndex: "proEmpName", key: "proEmpName", width: 110 },
        {
            title: "상태", dataIndex: "reqStatus", key: "reqStatus", width: 90,
            render: (status) => <StatusBadge domain="delegReq" status={status} />,
        },
        { title: "요청일", dataIndex: "createdAt", key: "createdAt", width: 160 },
        { title: "처리일", dataIndex: "processedAt", key: "processedAt", width: 160 },
    ];

    // 감사로그 탭
    const logColumns = [
        { title: "로그ID", dataIndex: "logId", key: "logId", width: 80 },
        { title: "문서ID", dataIndex: "docId", key: "docId", width: 90 },
        { title: "원결재자", dataIndex: "oriEmpName", key: "oriEmpName", width: 110 },
        { title: "실처리자", dataIndex: "actEmpName", key: "actEmpName", width: 110 },
        { title: "처리자(관리자)", dataIndex: "perEmpName", key: "perEmpName", width: 130 },
        { title: "발생일", dataIndex: "createdAt", key: "createdAt", width: 160 },
    ];

    return (
        <div className="sb-page" style={{maxWidth: 1200}}>
            <PageHeader
                breadcrumb={[
                    { label: t("common.breadcrumbRoot"), href: "/appr/docs" },
                    { label: "결재선 관리" },
                ]}
                title="결재선 위임/대결 관리"
                subtitle="대결 요청 승인/반려, 처리이력, 감사로그를 확인합니다."
            />

            <Tabs
                activeKey={tab}
                onChange={setTab}
                items={[
                    {key: "pending", label: `대기중 요청${pendingRequests?.length ? `(${pendingRequests.length})` : ""} `},
                    {key: "history", label: "처리이력"},
                    {key: "logs", label: "감사로그"},
                ]}
            />

            {tab === "pending" && (
                <>
                <Table
                    rowKey="reqId"
                    columns={pendingColumns}
                    dataSource={pendingRequests}
                    loading={pendingLoading}
                    pagination={false}
                />
                {pendingError && <div style={{color: "red", marginTop: 8}}>{pendingError}</div>}
                </>
            )}

            {tab === "history" && (
                <>
                <Space style={{marginBottom: 16}} wrap>
                    <Select
                        placeholder="처리상태"
                        allowClear
                        style={{width: 120}}
                        onChange={setHistStatus}
                    >
                        <Option value="REQ">요청중</Option>
                        <Option value="APP">승인</Option>
                        <Option value="REJ">반려</Option>
                    </Select>
                    <InputNumber
                        placeholder="요청자 사번"
                        style={{width: 140}}
                        onChange={(v) => setHistEmpId(v || undefined)}
                    />
                    <RangePicker
                        format="YYYY-MM-DD"
                        onChange={(dates, dateStrings) => {
                            setHistDateRange(dates ? dateStrings : [null, null])
                        }}
                    />
                </Space>
                <Table
                    rowKey="reqId"
                    columns={historyColumns}
                    dataSource={history}
                    loading={historyLoading}
                    pagination={{
                        current: histPage,
                        pageSize: histPageSize,
                        total: historyTotal,
                        onChange: setHistPage,
                    }}
                />
                {historyError && <div style={{color: "red", marginTop: 8}}>{historyError}</div>}
                </>
            )}

            {tab === "logs" && (
                 <>
                    <Space style={{ marginBottom: 16 }} wrap>
                        <InputNumber
                            placeholder="문서ID"
                            style={{ width: 140 }}
                            onChange={(v) => setLogDocId(v || undefined)}
                        />
                        <InputNumber
                            placeholder="사번"
                            style={{ width: 140 }}
                            onChange={(v) => setLogEmpId(v || undefined)}
                        />
                        <RangePicker
                            format="YYYY-MM-DD"
                            onChange={(dates, dateStrings) => {
                                setLogDateRange(dates ? dateStrings : [null, null]);
                            }}
                        />
                    </Space>
                    <Table
                        rowKey="logId"
                        columns={logColumns}
                        dataSource={logs}
                        loading={logsLoading}
                        pagination={{
                            current: logPage,
                            pageSize: logPageSize,
                            total: logsTotal,
                            onChange: setLogPage,
                        }}
                    />
                    {logsError && <div style={{ color: "red", marginTop: 8 }}>{logsError}</div>}
                </>
            )}
        </div>
    );
}