import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    Table, Input, Select, Button, Space, Tag,
    Tabs, Row, Col, Card
} from "antd";
import {
    FolderOpenOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { fetchDocListRequest } from "../../../reducers/appr/apprDocReducer";

const { Option } = Select;

// 대시보드 통계 카드
function StatCard({ icon: Icon, label, value, bg, color}) {
    return (
        <Card 
            bodyStyle={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 16
            }}
        >
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon style={{fontSize: 20, color }} />
            </div>
            <div>
                <div style={{fontSize: 13, color: "rgba(0,0,0,0.45)"}}>{label}</div>
                <div style={{fontSize: 22, fontWeight: 500 }}>{value}</div>
            </div>
        </Card>
    )
}

export default function DocListPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        hisDocs, todoDocs, docCnts, myTodoCnt,
        paging, activeTab, listLoading, listError,
    } = useSelector( (state) => state.apprDoc );

    const [tab, setTab] = useState("history");
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect( () => {
        dispatch(fetchDocListRequest({tab, keyword, status, page: currentPage}))
    }, [dispatch, tab, keyword, status, currentPage]);

    const handleTabChange = (key) => {
        setTab(key);
        setCurrentPage(1);
    }

    // forms 에서 사용한 columns와 동일
    const columns = [
        {title: "문서번호", dataIndex: "docId", key: "docId", width: 90},
        {title: "제목", dataIndex: "docTitle", key: "docTitle"},
        {title: "기안자", dataIndex: "empName", key: "empName", width: 120},
        {
            title: "중요",
            dataIndex: "important",
            key: "important",
            width: 80,
            render: (important) => (important ? <Tag color="red">중요</Tag> : null)
        },
        {
            title: "상태",
            dataIndex: "docStatus",
            key: "docStatus",
            width: 100,
            render: (docStatus) => {
                const colorMap = {ING: "blue", APP: "green", REJ: "red"};
                const labelMap = {ING: "진행중", APP: "승인", REJ: "반려"};
                return <Tag color={colorMap[docStatus] || "default"}>{labelMap[docStatus] || docStatus}</Tag>
            },

        },
        // todo 탭에서만 내 결재 상태 표시
        ...(tab === "todo"
            ? [{title: "내 결재상태", dataIndex: "linStatus", key: "linStatus", width: 110}]
            : []),
        {title: "등록일", dataIndex: "createdAt", key: "createdAt", width: 160},
        {
            title: "관리",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Button size="small" onClick={() => router.push(`/appr/docs/detail?docId=${record.docId}`)}>
                    상세
                </Button>
            ),
        },
    ];

    const dataSource = tab === "todo" ? todoDocs : hisDocs;

    return(<>
        <div className="sb-page">
            <div className="sb-page-head">
                <div className="sb-page-head__txt">
                    <div className="sb-breadcrumb">
                        <a onClick={() => router.push("/appr/docs")} style={{cursor: "pointer"}}>전자결재</a>
                        <i className="bi bi-chevron-right"/>
                        <span>결재 문서함</span>
                    </div>
                    <h1>결재 문서 조회</h1>
                    <p>내가 기안/결재한 문서 및 결재 대기 중인 문서를 확인합니다.</p>
                </div>
                <div className="sb-page-head__actions">
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => router.push("/appr/docs/write")}
                    >
                        문서 작성
                    </Button>
                </div>
            </div>
            
            {/* 대시보드 통계 카드 */}
            <Row gutter={16} style={{marginBottom: 24}}>
                <Col span={6}>
                    <StatCard
                        icon={FolderOpenOutlined}
                        label="전체 문서"
                        value={docCnts?.TOTALCNT ?? 0}
                        bg="#e6f4ff"
                        color="#1677ff"
                    />
                </Col>
                <Col span={6}>
                    <StatCard
                        icon={ClockCircleOutlined}
                        label="진행중"
                        value={docCnts?.INGCNT ?? 0}
                        bg="#fff7e6"
                        color="#fa8c16"
                    />
                </Col>
                <Col span={6}>
                    <StatCard
                        icon={CheckCircleOutlined}
                        label="승인"
                        value={docCnts?.APPCNT ?? 0}
                        bg="#f6ffed"
                        color="#52c41a"
                    />
                </Col>
                <Col span={6}>
                    <StatCard
                        icon={CloseCircleOutlined}
                        label="반려"
                        value={docCnts?.INGCNT ?? 0}
                        bg="#fff1f0"
                        color="#f5222d"
                    />
                </Col>

            </Row>

            <Space>
                <Input.Search
                    onSearch={(value) => {
                        setKeyword(value);
                        setCurrentPage(1);
                    }}
                    style={{width: 240}}
                    allowClear
                />
                {/* status 필터는 history 탭에서만 todo는 항상 ING+WAI */}
                {tab === "history" && (
                    <Select
                        placeholder="상태"
                        allowClear
                        style={{width: 120}}
                        onChange={(value) => {
                            setStatus(value);
                            setCurrentPage(1);
                        }}
                    >
                        <Option value="ING">진행중</Option>
                        <Option value="APP">승인</Option>
                        <Option value="REJ">반려</Option>
                    </Select>
                )}
            </Space>

            <Tabs
                activeKey={tab}
                onChange={handleTabChange}
                items={[
                    {key: "history", label: "결재 이력"},
                    {key: "todo", label: `내 할일${myTodoCnt ? `(${myTodoCnt})` : ""}`},
                ]}
            />
            <Table
                rowKey="docId"
                columns={columns}
                dataSource={dataSource}
                loading={listLoading}
                pagination={{
                    current: paging?.current || currentPage,
                    pageSize: paging?.onepagelist || 10,
                    total: paging?.listtotal || 0,
                    onChange: (p) => setCurrentPage(p),
                }}
            />

            {listError && <div style={{color: "red", marginTop: 8}}>{listError}</div>}
        </div>
    </>);
}