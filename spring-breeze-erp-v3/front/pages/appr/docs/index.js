import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    Table, Input, Select, Button, Space, Tag,
    Tabs, Row, Col, Statistic, Card
} from "antd";
import { fetchDocListRequest } from "../../../reducers/appr/apprDocReducer";

const { Option } = Select;

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
        <div style={{padding: 24}}>
            {/* 대시보드 통계 카드 */}
            <Row gutter={16} style={{marginBottom: 24}}>
                <Col span={5}>
                    <Card>
                        <Statistic
                            title="전체 문서"
                            value={docCnts?.TOTALCNT ?? 0}
                        />
                    </Card>
                </Col>
                <Col span={5}>
                    <Card>
                        <Statistic
                            title="승인"
                            value={docCnts?.APPCNT ?? 0}
                            valueStyle={{color: "#3f8600"}}
                        />
                    </Card>
                </Col>
                <Col span={5}>
                    <Card>
                        <Statistic
                            title="반려"
                            value={docCnts?.REJCNT ?? 0}
                            valueStyle={{color: "#cf1322"}}
                        />
                    </Card>
                </Col>
                <Col span={5}>
                    <Card>
                        <Statistic
                            title="진행중"
                            value={docCnts?.INGCNT ?? 0}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="내 할일"
                            value={myTodoCnt ?? 0}
                            valueStyle={{color: "#1677ff"}}
                        />
                    </Card>
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
                <Button type="primary" onClick={() => router.push("/appr/docs/write")}>
                    문서 작성
                </Button>
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