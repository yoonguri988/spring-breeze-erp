import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    message, Descriptions, Button,
    Popconfirm, Row, Col
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

    // 결재선 상태들 출력할것들
    const statusBadgeMap ={
        ING: <span className="sb-badge sb-badge--blue"><span className="pip"/>진행중</span>,
        APP: <span className="sb-badge sb-badge--green"><span className="pip"/>최종승인</span>,
        REJ: <span className="sb-badge sb-badge--red"><span className="pip"/>반려됨</span>,
    };

    const lineBadgeMap = {
        WAI: <span className="sb-badge sb-badge--amber"><span className="pip"/>검토중</span>,
        NOT: <span className="sb-badge sb-badge--gray"><span className="pip"/>대기</span>,
        APP: <span className="sb-badge sb-badge--green"><span className="pip"/>승인</span>,
        REJ: <span className="sb-badge sb-badge--red"><span className="pip"/>반려</span>,
    };

    const roleClassMap = {
        APP: "role-app",
        REJ: "role-rej",
        WAI: "role-wai",
        NOT: "role-not",
    };

    return (
        <div className="sb-page" style={{maxWidth: 1100}}>
            <div className="sb-page-head">
                <div className="sb-page-head__txt">
                    <div className="sb-breadcrumb">
                        <a onClick={() => router.push("/appr/docs")} style={{cursor: "pointer"}}>전자결재</a>
                        <i className="bi bi-chevron-right"/>
                        <span>문서 상세</span>
                    </div>
                    <h1>{detailDoc.docTitle}</h1>
                </div>
                <div className="sb-page-head__actions">
                    <Button onClick={() => router.push("/appr/docs")}>목록으로</Button>
                </div>
            </div>

            <Row gutter={16} style={{marginBottom: 16}}>
                <Col xs={24} md={10}>
                    <div className="sb-card equal-height-card">
                        <div className="sb-card__head">
                            <h2>문서 정보</h2>
                        </div>
                        <div className="sb-card__body">
                            <div style={{marginBottom: 12}}>
                                <label className="sb-form-label text-soft">기안자</label>
                                <div style={{fontWeight: 700}}>{detailDoc.empName}</div>
                            </div>
                            <div style={{marginBottom: 12}}>
                                <label className="sb-form-label text-soft">기안일시</label>
                                <div className="text-soft">{detailDoc.createdAt}</div>
                            </div>
                            <div>
                                <label className="sb-form-label text-soft">결재 상태</label>
                                <div style={{display: "flex", alignItems: "center", gap: 12, marginTop: 4}}>
                                    <div>{statusBadgeMap[detailDoc.docStatus]}</div>
                                    <div style={{display: "flex", alignItems: "center", gap: 4, fontSize: 13}}>
                                        <span style={{fontWeight: 700}}>기안</span>
                                        <i className="bi bi-chevron-right text-black-50"/>
                                        <span style={detailDoc.docStatus === "ING" ? {color: "#2563eb", fontWeight: 700} : {color: "#8a93a3"}}>검토</span>
                                        <i className="bi bi-chevron-right text-black-50"/>
                                        <span style={
                                            detailDoc.docStatus === "APP" ? {color: "#16a34a", fontWeight: 700} :
                                            detailDoc.docStatus === "REJ" ? {color: "#dc2626", fontWeight: 700} : {color: "#8a93a3"}
                                        }>완료</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={14}>
                    <div className="sb-card equal-height-card">
                        <div className="sb-card__head">
                            <h2>결재선</h2>
                        </div>
                        <div className="sb-card__body">
                            <div className="appr-timeline scrollable-timeline">
                                {/* 기안자 */}
                                <div className="appr-timeline__item">
                                    <div className="appr-timeline__avatar role-draft">
                                        {detailDoc.empName?.charAt(0)}
                                    </div>
                                    <div className="appr-timeline__body">
                                        <div className="appr-timeline__name">{detailDoc.empName}</div>
                                        <div className="appr-timeline__time">{detailDoc.createdAt}</div>
                                    </div>
                                    <div className="appr-timeline__status">
                                        <span className="sb-badge sb-badge--gray">기안</span>
                                    </div>
                                </div>

                                {/* 결재선 */}
                                {detailLines.map((line) => (
                                    <div className="appr-timeline__item" key={line.linId}>
                                        <div className={`appr-timeline__avatar ${roleClassMap[line.linStatus] || "role-not"}`}>
                                            {line.empName?.charAt(0)}
                                        </div>
                                        <div className="appr-timeline__body">
                                            <div className="appr-timeline__name">{line.empName}</div>
                                            <div className="appr-timeline__pos">{line.posName}</div>
                                            {line.linApproved && (
                                                <div className="appr-timeline__time">{line.linApproved}</div>
                                            )}
                                        </div>
                                        <div className="appr-timeline__status">
                                            {lineBadgeMap[line.linStatus]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="sb-card" style={{marginBottom: 16}}>
                <div className="sb-card__head">
                    <h2>문서 내용</h2>
                </div>
                <div className="sb-card__body">
                    {isSchemaDoc ? (
                        schemaFieldDefs.length > 0 ? (
                            <Descriptions bordered column={1} size="small">
                                {schemaFieldDefs.map((field) => (
                                    <Descriptions.Item key={field.key} label={field.label}>
                                        {schemaValues[field.key] ?? "-"}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        ) : (
                            <Descriptions bordered column={1} size="small">
                                {Object.entries(schemaValues).map(([key, value]) => (
                                    <Descriptions.Item key={key} label={key}>
                                        {value ?? "-"}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        )
                    ) : (
                        <div
                            className="approval-document-wrap document-content-area"
                            dangerouslySetInnerHTML={{__html: detailDoc.docContent}}
                        />
                    )}
                </div>
            </div>

            {canProcess && (
                <div style={{display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 24}}>
                    {/* 위임 요청 버튼은 appr_line_request 기능 만들 때 여기에 추가 예정 */}
                    <Popconfirm title="반려 하시겠습니까?" onConfirm={handleReject}>
                        <Button danger loading={processSubmitting} disabled={processSubmitting}>
                            반려
                        </Button>
                    </Popconfirm>
                    <Popconfirm title="승인 하시겠습니까?" onConfirm={handleApprove}>
                        <Button type="primary" loading={processSubmitting} disabled={processSubmitting}>
                            승인
                        </Button>
                    </Popconfirm>
                </div>
            )}
        </div>
    );
}