import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
    message, Radio, Form, Input, Select, Switch, Button,
    Space, Row, Col
} from "antd";
import { BankOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { insertFormRequest, resetFormState } from "../../../reducers/appr/apprFormReducer";
import { checkCode, searchCompany, generateAiSchema } from "../../../api/appr/apprFormApi";
import SchemaFieldEditor, {validateSchemaFields} from "../../../components/appr/SchemaFieldEditor";
import apprFormTemplates from "../../../constants/apprFormTemplates";

// react-quill은 SSR이 불가하므로 CSR로 로드
// () => import("react-quill") -> 처음에 로드 하지않고 필요할때 로드
// {ssr: false} -> 서버 렌더링 단계에서는 해당 컴포넌트를 렌더링에서 제외함
const ReactQuill = dynamic( () => import("react-quill"), {ssr: false});
import "react-quill/dist/quill.snow.css";

export default function FormWritePage() {

    const router = useRouter();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { submitting, submitError, success } = useSelector((state) => state.apprForm)

    // 'editor' , 'ai' 양식 내용 구분
    const [contentMode, setContentMode] = useState("editor")
    const [content, setContent] = useState("");
    const [aiPrompt, setAiPrompt] = useState("");
    const [schemaFields, setSchemaFields] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [companyOptions, setCompanyOptions] = useState([]);
    const debounceRef = useRef(null);

    // 양식코드 중복확인 상태
    const [codeStatus, setCodeStatus] = useState(null);
    const forCodeValue = Form.useWatch("forCode", form);
    const comIdValue = Form.useWatch("comId", form);

    useEffect(() => {
        setCodeStatus(null);
    }, [forCodeValue, comIdValue]);

    // 등록 성공하면 목록으로 이동, 실패하면 에러 메세지 표시
    useEffect(() => {
        if (success) {
            message.success("양식이 등록되었습니다.");
            router.push("/appr/forms");
        }
    }, [success]);

    useEffect( () => {
        if(submitError) {
            message.error(submitError);
        }
    }, [submitError]);

    // 페이지 나갈때 submit 상태 초기화 / 이전 제출 결과 남아있지 않게
    useEffect( () => {
        return () => {
            dispatch(resetFormState());
        };
    }, [dispatch]);

    const handleCompanySearch = async (keyword) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!keyword) {
            setCompanyOptions([]);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            try {
                const companies = await searchCompany(keyword);
                setCompanyOptions(companies.map((c) => ({
                    label: `${c.comName} (${c.bizNo})`,
                    value: c.comId
                })));
            } catch (e) {
                message.error("회사 검색에 실패했습니다.");
            }
        }, 300);
    };

    const handleGenerateSchema = async () => {
        if (!aiPrompt.trim()) {
            message.warning("생성할 양식에 대한 설명을 입력해주세요.");
            return;
        }

        setAiLoading(true);

        try {
            const res = await generateAiSchema(aiPrompt);
            if (res.success) {
                // 서버가 준 스키마 JSON 파싱해서 편집 가능하게 세팅
                const parsed = JSON.parse(res.schema);
                setSchemaFields(parsed.fields || []);

                // 제목을 안적었을때만 채우기
                if (parsed.title && !form.getFieldValue("forTitle")){
                    form.setFieldsValue({forTitle: parsed.title});
                }

                message.success("AI 스키마가 생성되었습니다. \n필드를 확인/수정한 뒤 등록해주세요.")
            }
            else {
                message.error(res.message || "AI 양식 생성에 실패했습니다.")
            }
        } catch (e) {
            message.error("AI 양식 생성 중 오류가 발생했습니다.")
        } finally {
            setAiLoading(false);
        }
    };

    const handleCodeCheck = async () => {
        const forCode = form.getFieldValue("forCode");
        const comId = form.getFieldValue("comId");
        if (!forCode || !comId){
            message.warning("회사와 양식 코드를 먼저 입력해주세요.");
            return;
        }
        
        try {
            const res = await checkCode(forCode, comId, null);
            setCodeStatus(res.available ? "available" : "duplicate");
            if (res.available) {
                message.success("사용 가능한 코드입니다.")
            }
            else {
                message.error("이미 사용 중인 코드입니다.");
            }
        } catch (e) {
            setCodeStatus(null);
            message.error("코드 확인 중 오류 발생");
        }
    };

    // 템플릿 주입 - 기존 내용 있을시 확인후 덮어씀
    const handleInjectTemplate = (type) => {
        if (content && content !== "<p><br></p>") {
            if (!window.confirm("선택한 결재 템플릿을 불러오시겠습니까? 기존 작성 내용은 사라집니다.")) {
                return;
            }
        }
        setContent(apprFormTemplates[type]);
    };

    const handleSubmit = (values) => {

        // 코드 중복확인 안했거나, 확인한 값이 중복(duplicate)일경우 제출 차단
        if (codeStatus !== "available") {
            message.warning("양식 코드 중복확인을 먼저 진행해주세요.");
            return;
        }

        let payload;

        if (contentMode === "ai") {
            const errorMsg = validateSchemaFields(schemaFields);
            if (errorMsg) {
                message.error(errorMsg);
                return;
            }
            payload = {
                ...values,
                forContent: null,
                forSchema: JSON.stringify({fields: schemaFields}),
            };
        }
        else {
            if (!content.trim() || content === "<p><br></p>") {
                message.error("양식 내용을 입력해주세요.");
                return;
            }
            payload = {
                ...values,
                forContent: content,
                forSchema: null,
            };
        }

        dispatch(insertFormRequest(payload));
    }

    return (
        <div className="sb-page" style={{maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box"}}>
            <div className="sb-page-head">
                <div className="sb-page-head__txt">
                    <div className="sb-breadcrumb">
                        <a onClick={() => router.push("/appr/forms")} style={{cursor: "pointer"}}>전자결재</a>
                        <i className="bi bi-chevron-right"/>
                        <a onClick={() => router.push("/appr/forms")} style={{cursor: "pointer"}}>양식 관리</a>
                        <i className="bi bi-chevron-right"/>
                        <span>양식 작성</span>
                    </div>
                    <h1>결재 양식 작성</h1>
                    <p>새로운 결재 양식을 등록합니다.</p>
                </div>
                <div className="sb-page-head__actions">
                    <Button onClick={() => router.push("/appr/forms")}>목록으로</Button>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{forStatus: true}}
            >
                <Form.Item
                    name="comId"
                    label="양식을 추가할 회사"
                    rules={[{ required: true, message: "회사를 선택해주세요."}]}
                >
                    <Select
                        showSearch
                        placeholder="회사명을 검색하세요."
                        filterOption={false}
                        suffixIcon={<BankOutlined/>}
                        onSearch={handleCompanySearch}
                        options={companyOptions}
                    />
                </Form.Item>

                <Form.Item label="양식 코드" required>
                    <Input.Group compact style={{display: "flex"}}>
                        <Form.Item
                            name="forCode"
                            noStyle
                            rules={[{required: true, message: "양식 코드를 입력해주세요."}]}
                        >
                            <Input
                                style={{flex: 1}}
                                placeholder="ex) TEST-01"
                                status={codeStatus === "duplicate" ? "error" : undefined}
                                suffix={
                                    codeStatus === "available" ? (
                                        <CheckCircleFilled style={{color: "#52c41a"}}/>
                                    ) : codeStatus === "duplicate" ? (
                                        <CloseCircleFilled style={{color: "#ff4d4f"}}/>
                                    ) : null
                                }
                            />
                        </Form.Item>
                        <Button style={{width: 100}} onClick={handleCodeCheck}>
                            중복확인
                        </Button>
                    </Input.Group>
                    {codeStatus === "available" && (
                        <Text
                            type="success"
                            style={{display: "block", marginTop: 4, fontSize: 13}}
                        >
                            사용 가능한 양식코드입니다.
                        </Text>
                    )}
                    {codeStatus === "duplicate" && (
                        <Text
                            type="danger"
                            style={{display: "block", marginTop: 4, fontSize: 13}}
                        >
                            중복된 양식코드입니다.
                        </Text>
                    )}
                </Form.Item>

                <Form.Item
                    name="forTitle"
                    label="양식 제목"
                    rules={[{required: true, message: "양식 제목을 입력해주세요."}]}
                >
                    <Input placeholder="ex) 병가신청서" />
                </Form.Item>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="작성 방식">
                            <Radio.Group
                                value={contentMode}
                                onChange={(e) => setContentMode(e.target.value)}
                            >
                                <Radio.Button value="editor">직접 작성</Radio.Button>
                                <Radio.Button value="ai">AI 생성</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="forStatus"
                            label="활성화 여부"
                            valuePropName="checked"
                            extra="활성화된 양식만 문서 작성 시 선택 목록에 나타납니다."
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                {contentMode === "editor" ? (
                    <Form.Item label="양식 내용">
                        <Space style={{marginBottom: 8}} wrap>
                            <Text type="secondary" style={{fontSize: 13}}>기본 양식 프레임 주입</Text>
                            <Button size="small" onClick={() => handleInjectTemplate("leave")}>휴가 신청서</Button>
                            <Button size="small" onClick={() => handleInjectTemplate("expense")}>지출 결의서</Button>
                            <Button size="small" onClick={() => handleInjectTemplate("biz")}>일반 기안서</Button>
                        </Space>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                        />
                    </Form.Item>    
                ) : (<>
                    <Form.Item label="AI 프롬프트">
                        <Input.Group compact>
                            <Input
                                style={{width: "calc(100% - 100px)"}}
                                placeholder="예: 휴가 신청서"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                            <Button
                                style={{width: 100}}
                                loading={aiLoading}
                                onClick={handleGenerateSchema}
                            >
                                생성
                            </Button>
                        </Input.Group>
                    </Form.Item>
                    
                    {schemaFields.length > 0 && (
                        <Form.Item label="생성된 필드 구성 (수정 가능)">
                            <SchemaFieldEditor
                                fields={schemaFields}
                                onChange={setSchemaFields}
                            />
                        </Form.Item>
                    )}

                </>
            )}
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <Form.Item>
                        <Space>
                            <Button onClick={() => router.push("/appr/forms")}>취소</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                            >
                                작성
                            </Button>
                        </Space>
                    </Form.Item>
                </div>
            </Form>
        </div>
    )
}