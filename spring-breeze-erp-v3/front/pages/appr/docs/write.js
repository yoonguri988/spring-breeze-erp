import dynamic from "next/dynamic";
import moment from "moment";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    message, Form, Input, Select, Button, Space, List,
    Tag, Divider, Empty, DatePicker, InputNumber,
    Card, Row, Col, Modal, Switch, Typography, Spin
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    fetchWriterInfoRequest,
    fetchWritableFormsRequest,
    fetchApprLinesRequest,
    fetchDeptTreeRequest,
    fetchDeptEmpsRequest,
    writeDocRequest,
    resetWriteState,
} from "../../../reducers/appr/apprDocReducer";

// react-quill은 SSR이 불가하므로 CSR로 로드
// () => import("react-quill") -> 처음에 로드 하지않고 필요할때 로드
// {ssr: false} -> 서버 렌더링 단계에서는 해당 컴포넌트를 렌더링에서 제외함
const ReactQuill = dynamic( () => import("react-quill"), {ssr: false});
import "react-quill/dist/quill.snow.css";

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

export default function DocWritePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const {
        writerInfo, writerInfoLoading,
        writableForms, writableFormsLoading,
        apprLines, apprLinesLoading,
        deptTree, deptTreeLoading,
        deptEmps, deptEmpsLoading,
        writeSubmitting, writeError, writeSuccess,
    } = useSelector((state) => state.apprDoc);

    const [docContent, setDocContent] = useState("");
    // { [field.key] : value }
    const [schemaValues, setSchemaValues] = useState({});
    // empId, empName, posName 순서대로
    const [approvers, setApprovers] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const [isImportant, setIsImportant] = useState(false);

    // 중요문서 결재선인원 조절
    const requiredApproverCount = isImportant ? 3 : 1;

    // 결재선 순서 패널에 보여줄 고정 슬롯
    const approverSlots = useMemo(
        () => Array.from({length: requiredApproverCount}, (_, i) => ({
            slotIndex : i,
            approver: approvers[i] || null     
        })),
        [approvers, requiredApproverCount]
    );

    // 폼에서 선택한 양식 감시
    const formKey = Form.useWatch("formKey", form);

    // 선택된 양식의 원본 데이터 찾기
    const selectedForm = useMemo(
        () => writableForms.find((f) => `${f.forId}-${f.forVersion}` === formKey),
        [writableForms, formKey]
    );

    const isSchemaForm = !!selectedForm?.forSchema;

    // 스키마 방식 필드 파싱
    const schemaFieldDefs = useMemo(() => {
        if (!isSchemaForm) return [];
        try {
            return JSON.parse(selectedForm.forSchema).fields || [];
        } catch (e) {
            return [];
        }
    }, [isSchemaForm, selectedForm]);

    // 양식이 바뀌면 이전값 초기화
    useEffect(() => {
        setSchemaValues({});
        setDocContent(selectedForm?.forContent ?? "");
    }, [formKey]);

    const updateSchemaValue = (key, value) => {
        setSchemaValues((prev) => ({...prev, [key]: value}));
    };

    const renderSchemaField = (field) => {
        const value = schemaValues[field.key];
        const onChange = (v) => updateSchemaValue(field.key, v);

        switch (field.type) {
            case "textarea":
                return <TextArea rows={4} value={value} onChange={(e) => onChange(e.target.value)}/>;
            case "date":
                return (
                    <DatePicker
                        style={{width: "100%"}}
                        value={value ? moment(value) : null}
                        onChange={(date, dateString) => onChange(dateString)}
                    />
                );
            case "number":
                return <InputNumber style={{width: "100%"}} value={value} onChange={onChange}/>;
            case "select":
                return (
                    <Select value={value} onChange={onChange}>
                        {(field.options || []).map((opt) => (
                            <Option key={opt} value={opt}>{opt}</Option>
                        ))}
                    </Select>
                );
            default:
                return <Input value={value} onChange={(e) => onChange(e.target.value)}/>;
        }
    }

    

    // 초기진입시 작성자 정보 + 사용 가능항 양식 목록 조회
    useEffect(() => {
        dispatch(fetchWriterInfoRequest());
        dispatch(fetchWritableFormsRequest());
    }, [dispatch]);

    // 작성자 정보 로드되면 본인 소속 부서 기준으로 결재선 지정 부서트리 조회
    useEffect(() => {
        if (writerInfo?.deptId) {
            dispatch(fetchDeptTreeRequest({
                deptId: writerInfo.deptId,
                empId: writerInfo.empId
            }));
        }
    }, [dispatch, writerInfo]);

    // 등록 성공하면 목록으로 이동
    useEffect(() => {
        if (writeSuccess) {
            message.success("문서가 등록되었습니다.");
            router.push("/appr/docs");
        }
    }, [writeSuccess]);

    useEffect(() => {
        if (writeError) {
            message.error(writeError);
        }
    }, [writeError]);

    // 페이지 나갈때 상태 초기화
    useEffect(() => {
        return () => {
            dispatch(resetWriteState());
        };
    }, [dispatch]);

    // 결재선 중복 방지

    // 현재 결재자 목록에서 사원 번호만 추출하여 Set객체로 저장
    // Array.includes 보다 Set.has 가 결재자가 많아져도 중복 체크 검사 속도가 빠르다함
    // useMemo -> approvers 배열이 변경될때만 재계산됨
    const approverIdSet = useMemo(() => new Set(approvers.map((a) => a.empId)), [approvers]);

    const addApprover = (person) => {
        // 추가할 대상 (person.empId)이 approverIdSet에 이미 존재하면 메세지띄우고 함수 종료
        if (approverIdSet.has(person.empId)) {
            message.warning("이미 추가된 결재자입니다.");
            return;
        }
        setApprovers((prev) => [...prev, person]);
    };

    // 휴직자면 확인 모달창
    const handleAddApprover = (emp) => {
        const person = {
            empId: emp.empId,
            empName: emp.empName,
            posName: emp.posName
        };

        if (emp.empStatus === "휴직") {
            Modal.confirm({
                title: "휴직자 추가 확인",
                content: `${emp.empName}님은 현재 휴직 상태입니다. 그래도 결재선에 추가하시겠습니까?`,
                okText: "추가",
                cancelText: "취소",
                onOk: () => addApprover(person),
            });
            return;
        }
        addApprover(person);
    };

    // 결재자 삭제
    const removeApprover = (empId) => {
        setApprovers((prev) => prev.filter((a) => a.empId !== empId));
    };

    // 결재 순서 변경
    const moveApprover = (index, direction) => {
        setApprovers((prev) => {
            const next = [...prev];
            // 위로 이동시 -1, 아래로 이동시 1
            const target = index + direction;
            // 배열 범위 벗어날경우 기존상태 유지
            if (target < 0 || target >= next.length) return prev;
            // 위치바꾸기
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    }

    // 중요문서 여부 토글 / 초과분 잘라내기
    const handleImportantChange = (checked) => {
        setIsImportant(checked);
        const newRequired = checked ? 3 : 1;
        setApprovers((prev) => {
            if (prev.length <= newRequired) return prev;
            message.info(`결재선이 ${newRequired}명으로 조정되었습니다. 초과된 결재자는 제외됩니다.`);
            return prev.slice(0, newRequired);
        })
    }

    // 부서 기준 상사 목록 조회 
    // 결재선 추천 3차 신규기능 추가예정
    const handleAutoSuggest = () => {
        dispatch(fetchApprLinesRequest());
    };

    // 최고 직급자 예외 처리
    const noApproversAvailable = useMemo(
        () => deptTree.length > 0 && deptTree.every((d) => d.empCount === 0),
        [deptTree]  
    );

    // 추천된 상사 목록을 순서대로 결재선에 담기
    useEffect(() => {
        if (apprLines.length > 0 && approvers.length === 0) {
            setApprovers(
                apprLines.slice(0, requiredApproverCount).map((l) => ({
                    empId: l.empId,
                    empName: l.empName,
                    posName: l.posName
                }))
            );
        }
    }, [apprLines]);

    const handleDeptSelect = (deptId) => {
        setSelectedDeptId(deptId);
        dispatch(fetchDeptEmpsRequest(deptId));
    };

    const handleSubmit = (values) => {
        if (approvers.length !== requiredApproverCount) {
            message.error(`결재선을 ${requiredApproverCount}명 지정해주세요.`);
            return;
        }

        let content;

        if (isSchemaForm) {
            // 필수 필드 검증
            const missing = schemaFieldDefs.filter(
                (f) => f.required && (schemaValues[f.key] === undefined || schemaValues[f.key] === "")
            );
            if (missing.length > 0) {
                message.error(`필수 항목을 입력해주세요 : ${missing.map((f) => f.label).join(", ")}`);
                return;
            }
            content = JSON.stringify(schemaValues);
        }
        else {
            if (!docContent.trim()) {
                message.error("문서 내용을 입력해주세요.");
                return;
            }
            content = docContent;
        }

        const [forId, forVersion] = values.formKey.split("-");

        const payload = {
            forId: Number(forId),
            forVersion: Number(forVersion),
            docTitle: values.docTitle,
            docContent: content,
            approverEmpIds: approvers.map((a) => a.empId),
        };

        dispatch(writeDocRequest({data: payload}));
    };

    return (
        <div className="sb-page" style={{maxWidth: 900}}>
            <div className="sb-page-head">
                <div className="sb-page-head__txt">
                    <div className="sb-breadcrumb">
                        <a onClick={() => router.push("/appr/docs")} style={{cursor: "pointer"}}>전자결재</a>
                        <i className="bi bi-chevron-right"/>
                        <a onClick={() => router.push("/appr/docs")} style={{cursor: "pointer"}}>결재 문서함</a>
                        <i className="bi bi-chevron-right"/>
                        <span>문서 작성</span>
                    </div>
                    <h1>결재 문서 작성</h1>
                    <p>선택한 양식으로 새로운 결재 문서를 기안합니다.</p>
                </div>
                <div className="sb-page-head__actions">
                    <Button onClick={() => router.push("/appr/docs")}>목록으로</Button>
                </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="formKey"
                    label="양식 선택"   
                    rules={[{required: true, message: "양식을 선택해주세요."}]}
                >
                    <Select
                        placeholder="작성할 양식을 선택하세요"
                        loading={writableFormsLoading}
                    >
                        {writableForms.map((f) => (
                            <Option
                                key={`${f.forId}-${f.forVersion}`}
                                value={`${f.forId}-${f.forVersion}`}
                            >
                                {f.forTitle} (v{f.forVersion})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>


                <Form.Item
                    name="docTitle"
                    label="문서 제목"
                    rules={[{required: true, message: "문서 제목을 입력해주세요."}]}
                >
                    <Input/>
                </Form.Item>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        border: "1px solid #f0f0f0",
                        borderRadius: 6,
                        marginBottom: 24
                    }}
                >
                    <div>
                        <div style={{fontWeight: 600}}>중요 문서 여부</div>
                        <div style={{fontSize: 13, color: "rgba(0,0,0,0.45)"}}>
                            중요문서로 지정하면 결재선을 3명 지정해야 합니다.
                        </div>
                    </div>
                    <Switch checked={isImportant} onChange={handleImportantChange}/>
                </div>

                {/* 선택한 양식에 따라 동적으로 분기 */}
                {formKey && (
                    isSchemaForm ? (
                        <Form.Item label="문서 내용">
                            <Space direction="vertical" style={{width: "100%"}} size={12}>
                                {schemaFieldDefs.map((field) => (
                                    <div key={field.key}>
                                        <div style={{marginBottom: 4}}>
                                            {field.label}
                                            {field.required && <span style={{color: "red"}}> *</span>}
                                        </div>
                                        {renderSchemaField(field)}
                                    </div>
                                ))}
                            </Space>
                        </Form.Item>
                    ) : (
                        <Form.Item label="문서 내용">
                            <ReactQuill
                                theme="snow"
                                value={docContent}
                                onChange={setDocContent}
                            />
                        </Form.Item>
                    )
                )}

                <Divider>결재선 지정</Divider>

                {noApproversAvailable ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px 20px",
                            color: "var(--sb-ink-faint)",
                            border: "1px solid var(--sb-border)",
                            borderRadius: "var(--sb-radius)",
                            background: "var(--sb-surface)",
                        }}
                    >
                        <i className="bi bi-info-circle" style={{fontSize: 20, display: "block", marginBottom: 8}}/>
                        최고 직급자는 결재선 지정 없이 문서를 기안할 수 없습니다.<br/>
                        관리자에게 문의해주세요.
                    </div>
                ) : (<>

                <Text type="secondary" style={{display: "block", marginBottom: 12}}>
                    {isImportant ? "중요 문서는 결재선을 3명 순서대로 지정해야 합니다." : "일반 문서는 결재선을 1명 지정합니다."}
                </Text>

                {/*
                <Space style={{marginBottom: 12}}>
                        <Button onClick={handleAutoSuggest} loading={apprLinesLoading}>
                            상사 목록 불러오기
                        </Button>
                </Space>
                */}

                <Row gutter={16} style={{marginBottom: 16}}>
                    {/* 부서 트리 */}
                    <Col xs={24} md={6}>
                        <Card size="small" title="부서 선택" bodyStyle={{padding: 8}}>
                            <div style={{maxHeight: 320, overflowY: "auto"}}>
                                <List
                                    size="small"
                                    loading={deptTreeLoading}
                                    dataSource={deptTree}
                                    locale={{ emptyText: "부서 정보를 불러오는 중입니다."}}
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
                    {/* 선택한 부서의 사원 목록 */}
                    <Col xs={24} md={9}>
                        <Card size="small" title="사원 선택" bodyStyle={{padding: 8}}>
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
                                            const already = approverIdSet.has(e.empId);
                                            return (
                                                <div
                                                    key={e.empId}
                                                    className={"appr-emp-row" + (already ? " disabled" : "")}
                                                    onClick={() => {if (!already) handleAddApprover(e);}}
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
                    {/* 선택된 결재선 */}
                    <Col xs={24} md={9}>
                        <Card size="small" title="결재선 순서" bodyStyle={{padding: 8}}>
                            <div className="appr-slots">
                               {approverSlots.map((slot) => {
                                    const { slotIndex: index, approver: a} = slot;
                                    const order = index + 1;
                                    return (
                                        <div
                                            key={index}
                                            className={"appr-slot" + (a ? " filled" : "")}
                                        >
                                            <span className="appr-slot__badge">{order}</span>
                                            {a ? (<>
                                                <span
                                                    className="appr-slot__body"
                                                    style={{cursor: "pointer"}}
                                                    onClick={() => removeApprover(a.empId)}
                                                >
                                                    {a.empName}
                                                    <span className="appr-slot__pos">{a.posName}</span>
                                                </span>
                                                <Space size={0}>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<ArrowUpOutlined/>}
                                                        disabled={index === 0}
                                                        onClick={(e) => {e.stopPropagation(); moveApprover(index, -1);}}
                                                    />
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<ArrowDownOutlined/>}
                                                        disabled={index === approvers.length - 1}
                                                        onClick={(e) => {e.stopPropagation(); moveApprover(index, 1);}}
                                                    />
                                                </Space>
                                            </>) : (
                                                <span className="appr-slot__body appr-slot__empty">
                                                    {order}차 결재자를 선택해주세요
                                                </span>
                                            )}
                                        </div>
                                    );
                               })}
                            </div>
                        </Card>
                    </Col>
                </Row>
                </>
                )}

                <Form.Item>
                    <div style={{display: "flex", justifyContent: "flex-end", gap: 8}}>
                        <Button onClick={() => router.push("/appr/docs")}>취소</Button>
                        <Button 
                            type="primary"
                            htmlType="submit"
                            loading={writeSubmitting}
                            disabled={writeSubmitting || noApproversAvailable}
                        >
                            제출
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}