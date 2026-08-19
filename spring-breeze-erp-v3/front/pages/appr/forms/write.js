import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
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
        <div className="sb-page" style={{maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box"}}>
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
            >
                <Form.Item
                    name="comId"
                    label={t("forms.write.companyLabel")}
                    rules={[{ required: true, message: t("forms.write.companyRequired")}]}
                >
                    <Select
                        showSearch
                        placeholder={t("forms.write.companySearchPlaceholder")}
                        filterOption={false}
                        suffixIcon={<BankOutlined/>}
                        onSearch={handleCompanySearch}
                        options={companyOptions}
                    />
                </Form.Item>

                <Form.Item label={t("forms.write.codeLabel")} required>
                    <Input.Group compact style={{display: "flex"}}>
                        <Form.Item
                            name="forCode"
                            noStyle
                            rules={[{required: true, message: t("forms.write.codeRequired")}]}
                        >
                            <Input
                                style={{flex: 1}}
                                placeholder={t("forms.write.codePlaceholder")}
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
                            {t("forms.write.codeCheckBtn")}
                        </Button>
                    </Input.Group>
                    {codeStatus === "available" && (
                        <Text
                            type="success"
                            style={{display: "block", marginTop: 4, fontSize: 13}}
                        >
                            {t("forms.write.codeAvailableText")}
                        </Text>
                    )}
                    {codeStatus === "duplicate" && (
                        <Text
                            type="danger"
                            style={{display: "block", marginTop: 4, fontSize: 13}}
                        >
                            {t("forms.write.codeDuplicateText")}
                        </Text>
                    )}
                </Form.Item>

                <Form.Item
                    name="forTitle"
                    label={t("forms.write.titleLabel")}
                    rules={[{required: true, message: t("forms.write.titleRequired")}]}
                >
                    <Input placeholder={t("forms.write.titlePlaceholder")} />
                </Form.Item>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label={t("forms.write.modeLabel")}>
                            <Radio.Group
                                value={contentMode}
                                onChange={(e) => setContentMode(e.target.value)}
                            >
                                <Radio.Button value="editor">{t("forms.write.modeEditor")}</Radio.Button>
                                <Radio.Button value="ai">{t("forms.write.modeAi")}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="forStatus"
                            label={t("forms.write.activeLabel")}
                            valuePropName="checked"
                            extra={t("forms.write.activeExtra")}
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                {contentMode === "editor" ? (
                    <Form.Item label={t("forms.write.contentLabel")}>
                        <Space style={{marginBottom: 8}} wrap>
                            <Text type="secondary" style={{fontSize: 13}}>{t("forms.write.templateInjectLabel")}</Text>
                            <Button size="small" onClick={() => handleInjectTemplate("leave")}>{t("forms.write.templateLeaveBtn")}</Button>
                            <Button size="small" onClick={() => handleInjectTemplate("expense")}>{t("forms.write.templateExpenseBtn")}</Button>
                            <Button size="small" onClick={() => handleInjectTemplate("biz")}>{t("forms.write.templateBizBtn")}</Button>
                        </Space>
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                        />
                    </Form.Item>
                ) : (<>
                    <Form.Item label={t("forms.write.aiPromptLabel")}>
                        <Input.Group compact>
                            <Input
                                style={{width: "calc(100% - 100px)"}}
                                placeholder={t("forms.write.aiPromptPlaceholder")}
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                            <Button
                                style={{width: 100}}
                                loading={aiLoading}
                                onClick={handleGenerateSchema}
                            >
                                {t("forms.write.aiGenerateBtn")}
                            </Button>
                        </Input.Group>
                    </Form.Item>

                    {schemaFields.length > 0 && (
                        <Form.Item label={t("forms.write.schemaFieldsGeneratedLabel")}>
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
                            <Button onClick={() => router.push("/appr/forms")}>{t("forms.write.cancelBtn")}</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                            >
                                {t("forms.write.submitBtn")}
                            </Button>
                        </Space>
                    </Form.Item>
                </div>
            </Form>
        </div>
    )
}