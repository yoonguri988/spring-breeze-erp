import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    Table, Input, Select, Button, Space, Tag,
    Tabs, Row, Col, Statistic, Card
} from "antd";
import { fetchFormDetailRequest } from "../../../reducers/appr/apprFormReducer";

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
            render: (_, recode) => (
                <Button size="small" onClick={() => router.push(`/appr/docs/${record.docId}`)}>
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
                            value={}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="내 할일"
                            value={}
                        />
                    </Card>
                </Col>
            </Row>

            <Space>
                <Input.Search
                />
                {/* status 필터는 history 탭에서만 todo는 항상 ING+WAI */}
                {tab === "history" ** (
                    <Select>
                        <Option></Option>
                        <Option></Option>
                        <Option></Option>
                    </Select>
                )}
                <Button></Button>
            </Space>

            <Tabs/>
            <Table/>
        </div>
    </>);
}