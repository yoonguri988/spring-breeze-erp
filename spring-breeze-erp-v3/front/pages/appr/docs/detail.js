import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    message, Descriptions, Tag, Table, Button,
    Space, Popconfirm, Divider
} from "antd";
import {
    fetchDocDetailRequest, approveDocRequest,
    rejectDocRequest, resetProcessState,
} from "../../../reducers/appr/apprDocReducer";

export default function DocDetailPage() {
    const router = useRouter();
    const { docId } = router.query;
    const dispatch = useDispatch();

    const {
        detailDoc, detailLines, canProcess,
        detailLoading, detailError,
        processSubmitting, processError, processSuccess,
    } = useSelector((state) => state.apprDoc);

    // docId가 준비 되면 상세 조회
    useEffect(() => {
        if (!docId) return;
        dispatch(fetchDocDetailRequest({docId}));
    }, [dispatch, docId]);

    // 승인/반려 성공하면 최신 상태로 재조회
    useEffect(() => {
        if (processSuccess) {
            message.success("처리되었습니다.");
            dispatch(fetchDocDetailRequest({docId}));
            dispatch(resetProcessState());
        }
    }, [processSuccess]);

    useEffect(() => {
        if (processError) {
            message.error(processError);
        }
    }, [processError]);

    // 페이지 나갈때 상태 초기화
    useEffect(() => {
        return () => {
            dispatch(resetProcessState());
        };
    }, [dispatch]);

    const handleApprove = () => {
        dispatch(approveDocRequest({docId}));
    };

    const handleReject = () => {
        dispatch(rejectDocRequest({docId}));
    };

    const docStatusTag = (status) => {
        const colorMap = {ING: "blue", APP: "green", REJ: "red"};
        const labelMap = {ING: "진행중", APP: "승인", REJ: "반려"};
        return <Tag color={colorMap[status] || "default"}>{labelMap[status] || status}</Tag>;
    };

    const lineStatusTag = (status) => {
        const colorMap = {WAI: "gold", APP: "green", REJ: "red", NOT: "default"};
        const labelMap = {WAI: "결재대기", APP: "승인", REJ: "반려", NOT: "대기"};
        return <Tag color={colorMap[status] || "default"}>{labelMap[status] || status}</Tag>;
    };

    const lineColumns = [
        {title: "순서", dataIndex: "linOrder", key: "linOrder", width: 60},
        {title: "결재자", dataIndex: "empName", key: "empName"},
        {title: "직급", dataIndex: "posName", key: "posName"},
        {
            title: "상태",
            dataIndex: "linStatus",
            key: "linStatus",
            render: (status) => lineStatusTag(status),
        },
        {title: "결재일시", dataIndex: "linApproved", key: "linApproved"},
    ];

    // 스키마 방식 양식인지?
    const isSchemaDoc = !!detailDoc?.forSchema;

    // 스키마 필드 정의 파싱
    const schemaFieldDefs = useMemo(() => {
        if (!isSchemaDoc) return [];
        try {
            return JSON.parse(detailDoc.forSchema).fields || [];
        } catch (e) {
            return [];
        }
    }, [isSchemaDoc, detailDoc]);

    // 스키마는 JSON 형태로 저장 K:V
    const schemaValues = useMemo(() => {
        if (!isSchemaDoc || !detailDoc?.docContent) return {};
        try {
            return JSON.parse(detailDoc.docContent);
        } catch (e) {
            return {};
        }
    }, [isSchemaDoc, detailDoc]);

    if (detailLoading || !detailDoc) {
        return <div style={{padding: 24}}>불러오는 중..</div>
    }

    if (detailError) {
        return <div style={{padding: 24}}>{detailError}</div>
    }

    return (
        <div style={{padding: 24, maxWidth: 900}}>
            <Space style={{marginBottom: 16}}>
                <Button onClick={() => router.push("/appr/docs")}>
                    목록으로
                </Button>
            </Space>

            <Descriptions bordered column={2}>
                <Descriptions.Item label="문서번호">{detailDoc.docId}</Descriptions.Item>
                <Descriptions.Item label="상태">{docStatusTag(detailDoc.docStatus)}</Descriptions.Item>
                <Descriptions.Item label="양식">{detailDoc.forTitle}</Descriptions.Item>
                <Descriptions.Item label="기안자">{detailDoc.empName}</Descriptions.Item>
                <Descriptions.Item label="제목">{detailDoc.docTitle}</Descriptions.Item>
                <Descriptions.Item label="등록일">{detailDoc.createdAt}</Descriptions.Item>
                <Descriptions.Item label="수정일">{detailDoc.updatedAt}</Descriptions.Item>
            </Descriptions>

            <div style={{marginTop: 16}}>
                <h4>내용</h4>
                {isSchemaDoc ? (
                    // 스키마 방식
                    schemaFieldDefs.length > 0 ? (
                        <Descriptions bordered column={1} size="small">
                            {schemaFieldDefs.map((field) => (
                                <Descriptions.Item key={field.key} label={field.label}>
                                    {schemaValues[field.key] ?? "-"}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    ) : (
                        // 파싱 실패시 raw key만 나열
                        <Descriptions bordered column={1} size="small">
                            {Object.entries(schemaValues).map(([key, value]) => (
                                <Descriptions.Item key={key} label={key}>
                                    {value ?? "-"}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    )
                ) : (
                    // 2차때 예상질문중 에디터에 악의적으로 html코드를 작성하는거 예방하는거 고려해봐야함
                    <div dangerouslySetInnerHTML={{__html: detailDoc.docContent}}/>
                )}
            </div>

            <Divider>결재선</Divider>

            <Table
                rowKey="linId"
                size="small"
                columns={lineColumns}
                dataSource={detailLines}
                pagination={false}
            />

            {canProcess && (
                <Space style={{marginTop: 24}}>
                    <Popconfirm title="승인 하시겠습니까?" onConfirm={handleApprove}>
                        <Button type="primary" loading={processSubmitting}>
                            승인
                        </Button>
                    </Popconfirm>
                    <Popconfirm title="반려 하시겠습니까?" onConfirm={handleReject}>
                        <Button danger loading={processSubmitting}>
                            반려
                        </Button>
                    </Popconfirm>
                </Space>
            )}
        </div>
    );
}