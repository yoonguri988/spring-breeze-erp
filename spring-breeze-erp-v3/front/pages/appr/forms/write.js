import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { message, Radio, Form, Input, Select, Switch, Button } from "antd";
import { insertFormRequest, resetFormState } from "../../../reducers/appr/apprFormReducer";
import { checkCode, searchCompany, generateAiSchema } from "../../../api/appr/apprFormApi";

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
    const [aiSchema, setAiSchema] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [companyOptions, setCompanyOptions] = useState([]);

    // 등록 성공하면 목록으로 이동, 실패하면 에러 메세지 표시
    useEffect( () => {
        if(success) {
            message.success("양식 등록");
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
        if (!keyword) return;
        try {
            const companies = await searchCompany(keyword);
            setCompanyOptions(companies.map((c) => ({label: c.comName, value: c.comId})));
        } catch (e) {
            message.error("회사 검색에 실패했습니다.");
        }
    }

    const handleGenerateSchema = async () => {
        if (!aiPrompt.trim()) {
            message.warning("생성할 양식에 대한 설명을 입력해주세요.");
            return;
        }

        setAiLoading(true);

        try {
            const res = await generateAiSchema(aiPrompt);
            if (res.success) {
                setAiSchema(res.schema);
                message.success("AI 스키마가 생성되었습니다.");
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
            if (res.available) {
                message.success("사용 가능한 코드입니다.")
            }
            else {
                message.error("이미 사용 중인 코드입니다.");
            }
        } catch (e) {
            message.error("코드 확인 중 오류 발생");
        }
    };

    const handleSubmit = (values) => {
        // XOR 검증 -> 백엔드와 동일하게 체크 UX용, 최종 검증은 서버에서
        const hasContent = contentMode === "editor" && content.trim();
        const hasSchema = contentMode === "ai" && aiSchema.trim();
        if (!hasContent && !hasSchema) {
            message.error("에디터 작성 또는 AI 생성 중 하나는 완료해야합니다.");
            return;
        }

        const payload = {
            ...values,
            forContent: contentMode === "editor" ? content : null,
            forSchema: contentMode === "ai" ? aiSchema : null,
        };

        dispatch(insertFormRequest(payload));
    }

    return (
        <div style={{padding: 24, maxWidth: 720}}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{forStatus: true}}>
                <Form.Item
                    name="comId"
                    label="회사"
                    rules={[{ required: true, message: "회사를 선택해주세요."}]}>
                    <Select
                        showSearch
                        placeholder="회사명을 검색하세요."
                        filterOption={false}
                        onSearch={handleCompanySearch}
                        options={companyOptions}
                    />
                </Form.Item>

                <Form.Item label="양식 코드" required>
                    <Input.Group compact>
                        <Form.Item
                            name="forCode"
                            noStyle
                            rules={[{required: true, message: "양식 코드를 입력해주세요."}]}
                        >
                            <Input style={{width: "calc(100% - 100px)"}}/>
                        </Form.Item>
                        <Button style={{width: 100}} onClick={handleCodeCheck}>
                            중복확인
                        </Button>
                    </Input.Group>
                </Form.Item>

                <Form.Item
                    name="forTitle"
                    label="양식 제목"
                    rules={[{required: true, message: "양식 제목을 입력해주세요."}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="작성 방식">
                    <Radio.Group
                        value={contentMode}
                        onChange={(e) => setContentMode(e.target.value)}>
                        <Radio.Button value="editor">에디터 직접 작성</Radio.Button>
                        <Radio.Button value="ai">AI 생성</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {contentMode === "editor" ? (
                    <Form.Item label="내용">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}/>
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
                    {aiSchema && (
                        <Form.Item label="생성된 스키마 (미리보기)">
                            <Input.TextArea
                                value={aiSchema}
                                readOnly
                                rows={8}
                            />
                        </Form.Item>
                    )}
                </>)}

                <Form.Item
                    name="forStatus"
                    label="활성화"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                    >
                        등록
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}