import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
    message, Radio, Form, Input, Select, Switch, Button,
    Space, Row, Col, Typography, Card
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

const { Text } = Typography;

export default function FormWritePage() {

    const router = useRouter();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { t } = useTranslation(["appr", "common"]);

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
            message.success(t("forms.write.successMsg"));
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
                message.error(t("forms.write.companySearchFailedMsg"));
            }
        }, 300);
    };

    const handleGenerateSchema = async () => {
        if (!aiPrompt.trim()) {
            message.warning(t("forms.write.aiPromptRequired"));
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

                message.success(t("forms.write.aiSuccessMsg"))
            }
            else {
                message.error(res.message || t("forms.write.aiFailedMsg"))
            }
        } catch (e) {
            message.error(t("forms.write.aiErrorMsg"))
        } finally {
            setAiLoading(false);
        }
    };

    const handleCodeCheck = async () => {
        const forCode = form.getFieldValue("forCode");
        const comId = form.getFieldValue("comId");
        if (!forCode || !comId){
            message.warning(t("forms.write.codeCheckRequiredMsg"));
            return;
        }

        try {
            const res = await checkCode(forCode, comId, null);
            setCodeStatus(res.available ? "available" : "duplicate");
            if (res.available) {
                message.success(t("forms.write.codeAvailableMsg"))
            }
            else {
                message.error(t("forms.write.codeUnavailableMsg"));
            }
        } catch (e) {
            setCodeStatus(null);
            message.error(t("forms.write.codeCheckErrorMsg"));
        }
    };

    // 템플릿 주입 - 기존 내용 있을시 확인후 덮어씀
    const handleInjectTemplate = (type) => {
        if (content && content !== "<p><br></p>") {
            if (!window.confirm(t("forms.write.templateInjectConfirm"))) {
                return;
            }
        }
        setContent(apprFormTemplates[type]);
    };

    const handleSubmit = (values) => {

        // 코드 중복확인 안했거나, 확인한 값이 중복(duplicate)일경우 제출 차단
        if (codeStatus !== "available") {
            message.warning(t("forms.write.codeCheckFirstWarning"));
            return;
        }

        let payload;

        if (contentMode === "ai") {
            const errorMsg = validateSchemaFields(schemaFields, t);
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
                message.error(t("forms.write.contentRequired"));
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
        <div className="sb-page" style={{maxWidth: 1100, margin: "0 auto"}}>
            <div className="sb-page-head">
                <div className="sb-page-head__txt">
                    <div className="sb-breadcrumb">
                        <a onClick={() => router.push("/appr/forms")} style={{cursor: "pointer"}}>{t("common.breadcrumbRoot")}</a>
                        <i className="bi bi-chevron-right"/>
                        <a onClick={() => router.push("/appr/forms")} style={{cursor: "pointer"}}>{t("forms.write.breadcrumbForms")}</a>
                        <i className="bi bi-chevron-right"/>
                        <span>{t("forms.write.breadcrumbCurrent")}</span>
                    </div>
                    <h1>{t("forms.write.title")}</h1>
                    <p>{t("forms.write.subtitle")}</p>
                </div>
                <div className="sb-page-head__actions">
                    <Button onClick={() => router.push("/appr/forms")}>{t("common.backToListBtn")}</Button>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{forStatus: true}}
                style={{maxWidth: 760}}
            >
                {/* 1. 기본정보 */}
                <Card title="기본 정보" style={{marginBottom: 24}}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
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
                        </Col>

                        <Col xs={24} md={12}>
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
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="forTitle"
                                label="양식 제목"
                                rules={[{required: true, message: "양식 제목을 입력해주세요."}]}
                            >
                                <Input placeholder="ex) 병가신청서" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="작성 방식">
                                <Radio.Group
                                    value={contentMode}
                                    onChange={(e) => setContentMode(e.target.value)}
                                    optionType="button"
                                    buttonStyle="solid"
                                >
                                    <Radio.Button value="editor">직접 작성</Radio.Button>
                                    <Radio.Button value="ai">AI 생성</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
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
                </Card>

                {/* 2. 본문 / 스키마 */}
                <Card title={contentMode === "editor" ? "양식 본문 편집" : "AI 스키마 설정"}>
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
                                // 핸들 영역 겹치는것 방지
                                style={{height: 320, marginBottom: 48}}
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
                                    onPressEnter={handleGenerateSchema}
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
                    
                    <div style={{display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24}}>
                        <Button onClick={() => router.push("/appr/forms")}>취소</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                        >
                            작성
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    )
}