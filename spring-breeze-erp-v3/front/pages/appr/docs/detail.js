import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
    message, Descriptions, Button, Card, List, Tag, Spin,
    Row, Col, Modal, Form, Input
} from "antd";
import {
    fetchDocDetailRequest, approveDocRequest,
    rejectDocRequest, resetProcessState,
    fetchWriterInfoRequest, fetchDeptTreeRequest, fetchDeptEmpsRequest,
} from "../../../reducers/appr/apprDocReducer";
import {
    createDelegReqRequest, resetCreateStats,
} from "../../../reducers/appr/apprLineDelegationReducer";

export default function DocDetailPage() {
    const router = useRouter();
    const { docId } = router.query;
    const dispatch = useDispatch();
    const { t } = useTranslation(["appr", "common"]);

    const {
        detailDoc, detailLines, canProcess,
        detailLoading, detailError,
        processSubmitting, processError, processSuccess,
        writerInfo, deptTree, deptTreeLoading,
        deptEmps, deptEmpsLoading,
    } = useSelector((state) => state.apprDoc);

    const {
        createSubmitting, createError, createSuccess,
    } = useSelector((state) => state.apprLineDelegation);

    // 위임요청 모달
    const [delegModalOpen, setDelegModalOpen] = useState(false);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const [selectedDelegate, setSelectedDelegate] = useState(null);
    const [form] = Form.useForm();

    // 승인/반려 확인 모달
    const [confirmAction, setConfirmAction] = useState(null);

    // docId가 준비 되면 상세 조회
    useEffect(() => {
        if (!docId) return;
        dispatch(fetchDocDetailRequest({docId}));
    }, [dispatch, docId]);

    // 부서트리 조회 - 본인 정보 필요
    useEffect(() => {
        dispatch(fetchWriterInfoRequest());
    }, [dispatch]);

    useEffect(() => {
        if (writerInfo?.deptId) {
            dispatch(fetchDeptTreeRequest({
                deptId: writerInfo.deptId,
                empId: writerInfo.empId
            }));
        }
    }, [dispatch, writerInfo]);

    const handleDeptSelect = (deptId) => {
        setSelectedDeptId(deptId);
        dispatch(fetchDeptEmpsRequest(deptId));
    }

    // 승인/반려 성공하면 최신 상태로 재조회
    useEffect(() => {
        if (processSuccess) {
            message.success(t("docs.detail.processedMsg"));
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

    // 위임요청 모달 관련

    // 현재 로그인한 사원의 결재 순번 - 대기중(WAI)인 라인이 곧 본인 차례
    // canProcess가 true일 때만 버튼이 보임
    const myLine = detailLines.find((line) => line.linStatus === "WAI");

    useEffect(() => {
        if (createSuccess) {
            message.success("위임/대결 요청이 접수되었습니다.")
            setDelegModalOpen(false);
            setSelectedDelegate(null);
            setSelectedDeptId(null);
            form.resetFields();
            dispatch(resetCreateStats());
        }
    }, [createSuccess]);

    useEffect(() => {
        if (createError) {
            message.error(createError);
        }
    }, [createError]);

    const handleDelegSubmit = () => {
        form.validateFields().then((values) => {
            dispatch(createDelegReqRequest({
                linId: myLine.linId,
                newEmpId: selectedDelegate.empId,
                reqReason: values.reqReason,
            }));
        });
    }

        if (detailLoading || !detailDoc) {
        return <div style={{padding: 24}}>{t("common.loadingMsg")}</div>
    }

    if (detailError) {
        return <div style={{padding: 24}}>{detailError}</div>
    }

    // 결재선 상태들 출력할것들
    const statusBadgeMap ={
        ING: <span className="sb-badge sb-badge--blue"><span className="pip"/>{t("docs.detail.docStatusBadge.ing")}</span>,
        APP: <span className="sb-badge sb-badge--green"><span className="pip"/>{t("docs.detail.docStatusBadge.app")}</span>,
        REJ: <span className="sb-badge sb-badge--red"><span className="pip"/>{t("docs.detail.docStatusBadge.rej")}</span>,
    };

    const lineBadgeMap = {
        WAI: <span className="sb-badge sb-badge--amber"><span className="pip"/>{t("docs.detail.lineStatusBadge.wai")}</span>,
        NOT: <span className="sb-badge sb-badge--gray"><span className="pip"/>{t("docs.detail.lineStatusBadge.not")}</span>,
        APP: <span className="sb-badge sb-badge--green"><span className="pip"/>{t("docs.detail.lineStatusBadge.app")}</span>,
        REJ: <span className="sb-badge sb-badge--red"><span className="pip"/>{t("docs.detail.lineStatusBadge.rej")}</span>,
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
                        <a onClick={() => router.push("/appr/docs")} style={{cursor: "pointer"}}>{t("common.breadcrumbRoot")}</a>
                        <i className="bi bi-chevron-right"/>
                        <span>{t("docs.detail.breadcrumbCurrent")}</span>
                    </div>
                    <h1>{detailDoc.docTitle}</h1>
                </div>
                <div className="sb-page-head__actions">
                    <Button onClick={() => router.push("/appr/docs")}>{t("common.backToListBtn")}</Button>
                </div>
            </div>

            <Row gutter={16} style={{marginBottom: 16}}>
                <Col xs={24} md={10}>
                    <div className="sb-card equal-height-card">
                        <div className="sb-card__head">
                            <h2>{t("docs.detail.infoCardTitle")}</h2>
                        </div>
                        <div className="sb-card__body">
                            <div style={{marginBottom: 12}}>
                                <label className="sb-form-label text-soft">{t("docs.detail.drafterLabel")}</label>
                                <div style={{fontWeight: 700}}>{detailDoc.empName}</div>
                            </div>
                            <div style={{marginBottom: 12}}>
                                <label className="sb-form-label text-soft">{t("docs.detail.draftedAtLabel")}</label>
                                <div className="text-soft">{detailDoc.createdAt}</div>
                            </div>
                            <div>
                                <label className="sb-form-label text-soft">{t("docs.detail.statusLabel")}</label>
                                <div style={{display: "flex", alignItems: "center", gap: 12, marginTop: 4}}>
                                    <div>{statusBadgeMap[detailDoc.docStatus]}</div>
                                    <div style={{display: "flex", alignItems: "center", gap: 4, fontSize: 13}}>
                                        <span style={{fontWeight: 700}}>{t("docs.detail.stepDraft")}</span>
                                        <i className="bi bi-chevron-right text-black-50"/>
                                        <span style={detailDoc.docStatus === "ING" ? {color: "#2563eb", fontWeight: 700} : {color: "#8a93a3"}}>{t("docs.detail.stepReview")}</span>
                                        <i className="bi bi-chevron-right text-black-50"/>
                                        <span style={
                                            detailDoc.docStatus === "APP" ? {color: "#16a34a", fontWeight: 700} :
                                            detailDoc.docStatus === "REJ" ? {color: "#dc2626", fontWeight: 700} : {color: "#8a93a3"}
                                        }>{t("docs.detail.stepComplete")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={14}>
                    <div className="sb-card equal-height-card">
                        <div className="sb-card__head">
                            <h2>{t("docs.detail.lineCardTitle")}</h2>
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
                                        <span className="sb-badge sb-badge--gray">{t("docs.detail.draftBadge")}</span>
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
                    <h2>{t("docs.detail.contentCardTitle")}</h2>
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
                    <Button onClick={() => setDelegModalOpen(true)}>
                        위임/대결 요청
                    </Button>
                    <Button danger onClick={() => setConfirmAction("reject")}>
                        반려
                    </Button>
                    <Button type="primary" onClick={() => setConfirmAction("approve")}>
                        승인
                    </Button>
                </div>
            )}

            {/* 승인/반려 확인 모달 */}
            <Modal
                title={confirmAction === "approve" ? "결재 승인" : "결재 반려"}
                open={confirmAction !== null}
                onCancel={() => setConfirmAction(null)}
                onOk={confirmAction === "approve" ? handleApprove : handleReject}
                confirmLoading={processSubmitting}
                okText={confirmAction === "approve" ? "승인" : "반려"}
                cancelText="취소"
                okButtonProps={{danger: confirmAction === "reject"}}
            >
                <p>
                   {confirmAction === "approve"
                    ? "이 문서를 승인하시겠습니까?"
                    : "이 문서를 반려하시겠습니까?"
                   } 
                </p>
            </Modal>

            {/* 위임/대결 요청 모달 */}
            <Modal
                title="위임/대결 요청"
                open={delegModalOpen}
                onCancel={() => {
                    setDelegModalOpen(false);
                    setSelectedDelegate(null);
                    setSelectedDeptId(null);
                }}
                onOk={handleDelegSubmit}
                confirmLoading={createSubmitting}
                okText="요청"
                cancelText="취소"
                okButtonProps={{disabled: !selectedDelegate}}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={10}>
                            <Card size="small" title="부서 선택" bodyStyle={{padding: 8}}>
                                <div style={{maxHeight: 240, overflowY: "auto"}}>
                                    <List
                                        size="small"
                                        loading={deptTreeLoading}
                                        dataSource={deptTree}
                                        locale={{emptyText: "부서 정보를 불러오는 중입니다."}}
                                        renderItem={(d) => (
                                            <List.Item
                                                style={{
                                                    cursor: "pointer",
                                                    background: selectedDeptId === d.deptId ? "#e6f6ff" : "transparent"
                                                }}
                                                onClick={() => handleDeptSelect(d.deptId)}
                                            >
                                                {d.deptName} <Tag style={{marginLeft: 8}}>{d.empCount}명</Tag>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </Card>
                        </Col>
                        <Col span={14}>
                            <Card size="small" title="대결자 선택" bodyStyle={{padding: 8}}>
                                {deptEmpsLoading ? (
                                    <div style={{textAlign: "center", padding: "20px 0"}}>
                                        <Spin size="small"/>
                                    </div>
                                ) : (
                                    <div className="appr-emp-box">
                                        {deptEmps.length === 0 ? (
                                            <div className="text-muted text-center py-4 small">
                                                왼쪽에서 부서를 먼저 선택하세요.
                                            </div>
                                        ) : (
                                            deptEmps.map((e) => {
                                                const isSelected = selectedDelegate?.empId === e.empId;
                                                return (
                                                    <div
                                                        key={e.empId}
                                                        className={"appr-emp-row" + (isSelected ? " selected" : "")}
                                                        onClick={() => setSelectedDelegate(isSelected ? null : e)}
                                                    >
                                                        <span>
                                                            {e.empName}
                                                            {e.empStatus === "휴직" && (
                                                                <Tag color="orange" style={{marginLeft: 6}}>휴직중</Tag>
                                                            )}
                                                        </span>
                                                        <span className="pos-chip">{e.posName}</span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>

                    {selectedDelegate && (
                        <div
                            style={{
                                marginTop: 12,
                                marginBottom: 4,
                                padding: "10px 14px",
                                borderRadius: 8,
                                background: "#e6f4ff",
                                border: "1px solid #91caff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{display: "flex", alignItems: "center", gap: 8}}>
                                <span style={{color: "#8a93a3", fontSize: 13}}>선택된 대결자</span>
                                <span style={{fontWeight: 700, fontSize: 15}}>{selectedDelegate.empName}</span>
                                <span className="pos-chip">{selectedDelegate.posName}</span>
                            </div>
                            <Button
                                type="text"
                                size="small"
                                icon={<i className="bi bi-x-lg" />}
                                onClick={() => setSelectedDelegate(null)}
                            />
                        </div>
                    )}

                    <Form.Item name="reqReason" label="사유">
                        <Input.TextArea rows={3} placeholder="위임/대결 사유 (선택)"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}