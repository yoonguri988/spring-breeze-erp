import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { message, Form, Input, Select, Switch,
    Button, Descriptions, Tag, Space,
    Popconfirm, List
 } from "antd";
import {
    fetchFormDetailRequest,
    fetchFormVersionsRequest,
    updateFormRequest,
    deleteFormRequest,
    resetFormState,
} from "../../../reducers/appr/apprFormReducer";
import { checkCode, searchCompany } from "../../../api/appr/apprFormApi";
import SchemaFieldEditor, {validateSchemaFields } from "../../../components/appr/SchemaFieldEditor";

// react-quill은 SSR이 불가하므로 CSR로 로드
// () => import("react-quill") -> 처음에 로드 하지않고 필요할때 로드
// {ssr: false} -> 서버 렌더링 단계에서는 해당 컴포넌트를 렌더링에서 제외함
const ReactQuill = dynamic( () => import("react-quill"), {ssr: false});
import "react-quill/dist/quill.snow.css";

export default function FormDetailPage() {

    const router = useRouter();
    const { forId, forVersion } = router.query;
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const {
        detail, detailLoading, detailError,
        versions, versionsLoading,
        submitting, submitError, success,
    } = useSelector((state) => state.apprForm);

    const [editMode, setEditMode] = useState(false);
    const [content, setContent] = useState("");
    const [schemaFields, setSchemaFields] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);

    // forId/forVersion이 준비되면 상세,버전이력 조회
    useEffect( () => {
        if (!forId || !forVersion) return;
        dispatch(fetchFormDetailRequest({forId, forVersion}));
        dispatch(fetchFormVersionsRequest(forId));
    }, [dispatch, forId, forVersion]);

    // detail 조회되면, forSchema가 있으면 필드 파싱, 없으면 에디터 
    useEffect( () => {
        if (detail) {
            form.setFieldsValue({
                comId: detail.comId,
                forCode: detail.forCode,
                forTitle: detail.forTitle,
                forStatus: detail.forStatus
            });
            setCompanyOptions(detail.comName? [{label: detail.comName, value: detail.comId}] : []);

            if (detail.forSchema) {
                // schema 파싱
                try {
                    const parsed = JSON.parse(detail.forSchema);
                    setSchemaFields(parsed.fields || []);
                } catch (err) {
                    setSchemaFields([]);
                }
            }
            else {
                setContent(detail.forContent || "");
            }
        }
    }, [detail, form]);

    // 수정 성공하면 수정모드 종료하고 최신 데이터 재조회
    useEffect( () => {
        if (success) {
            message.success("수정되었습니다.");
            setEditMode(false);
            dispatch(fetchFormDetailRequest({ forId, forVersion}));
            dispatch(fetchFormVersionsRequest(forId));
            dispatch(resetFormState());
        }
    }, [success]);

    useEffect( () => {
        if (submitError) {
            message.error(submitError);
        }
    }, [submitError]);

    // 페이지 나갈때 submit 상태 초기화
    useEffect( () => {
        return () => {
            dispatch(resetFormState());
        };
    }, [dispatch])

    // 회사 검색
    const handleCompanySearch = async (keyword) => {
        if (!keyword) return;
        try {
            const companies = await searchCompany(keyword);
            setCompanyOptions(companies.map( (c) => ({label: c.comName, value: c.comId})));
        } catch (err) {
            message.error("회사 검색에 실패했습니다.");
        }
    };

    // 양식코드 중복 체크
    const handleCodeCheck = async () => {
        const forCode = form.getFieldValue("forCode");
        const comId = form.getFieldValue("comId");
        if (!forCode || !comId) {
            message.warning("회사와 양식 코드를 먼저 입력해주세요.");
            return;
        }

        // 본인 forId 는 제외하고 검사
        try {
            const res = await checkCode(forCode, comId, forId);
            if (res.available) {
                message.success("사용 가능한 코드입니다.");
            }
            else {
                message.error("이미 사용 중인 코드입니다.")
            }
        } catch (err) {
            message.error("코드 확인 중 오류가 발생했습니다.");
        }
    };

    // isSchemaMode는 조회된 원본 기준으로 고정
    const isSchemaMode = detail?.forSchema ? true : false;

    // 양식 수정
    const handleUpdate = (values) => {
        let payload;
        
        if (isSchemaMode) {
            const errorMsg = validateSchemaFields(schemaFields);
            if (errorMsg) {
                message.error(errorMsg);
                return;
            }
            payload = {
                ...values,
                forContent: null,
                forSchema: JSON.stringify({ fields: schemaFields}),
            };
        }

        else {
            if (!content.trim()) {
                message.error("양식 내용을 입력해주세요.");
                return;
            }
            payload = {
                ...values,
                forContent: content,
                forSchema: null,
            };
        }

        dispatch(updateFormRequest({forId, forVersion, data: payload}));
    }

    // 양식 삭제
    const handleDelete = () => {
        dispatch(deleteFormRequest({forId, forVersion}));
        message.success("삭제되었습니다.")
        router.push("/appr/forms");
    };

    // 로딩중 안내
    if (detailLoading || !detail) {
        return <div style={{padding: 24}}>불러오는 중..</div>;
    }

    // 오류 안내
    if (detailError) {
        return <div style={{padding: 24}}>{detailError}</div>;
    }

    return(    
        <div style={{padding: 24, maxWidth: 720}}>
            <Space style={{marginBottom: 16}}>
                <Button onClick={() => router.push("/appr/forms")}>
                    목록으로
                </Button>
                {!editMode && (
                    <Button type="primary" onClick={() => setEditMode(true)}>
                        수정
                    </Button>
                )}
                <Popconfirm title="삭제하시겠습니까?" onConfirm={handleDelete}>
                    <Button danger>삭제</Button>
                </Popconfirm>
            </Space>
            
            {!editMode ? (<>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="회사">{detail.comName}</Descriptions.Item>
                    <Descriptions.Item label="코드">{detail.forCode}</Descriptions.Item>
                    <Descriptions.Item label="제목">{detail.forTitle}</Descriptions.Item>
                    <Descriptions.Item label="버전">{detail.forVersion}</Descriptions.Item>
                    <Descriptions.Item label="상태">
                        <Tag color={detail.forStatus ? "green" : "default"}>
                            {detail.forStatus ? "활성" : "비활성"}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="등록일">{detail.createdAt}</Descriptions.Item>
                </Descriptions>

                <div style={{marginTop: 16}}>
                    <h4>내용</h4>
                    {detail.forContent ? (
                        <div dangerouslySetInnerHTML={{__html: detail.forContent}}/>
                    ) : (
                        <SchemaFieldEditor
                            fields={schemaFields}
                            onChange={() => {}}
                            readOnly
                        />
                    )}
                </div>

                <div style={{marginTop: 24}}>
                    <h4>버전 이력</h4>
                    <List
                        loading={versionsLoading}
                        size="small"
                        bordered
                        dataSource={versions}
                        renderItem={(v) => (
                            <List.Item
                                actions={[
                                    <a
                                    key="view"
                                    onClick={() => router.push(`/appr/forms/${v.forId}/${v.forVersion}`)}
                                >
                                    보기
                                </a>,
                                ]}
                            >
                                v{v.forVersion} - {v.forTitle} ({v.createdAt})
                            </List.Item>
                        )}
                    />
                </div>
                
            </>) : (<>
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                    <Form.Item
                        name="comId"
                        label="회사"
                        rules={[{required: true, message: "회사를 선택해주세요."}]}
                    >
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

                    <Form.Item name="forStatus" label="활성화" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    {isSchemaMode ? (
                        <Form.Item label="양식 필드 구성">
                            <SchemaFieldEditor
                                fields={schemaFields}
                                onChange={setSchemaFields}
                            />
                        </Form.Item>
                    ) : (
                        <Form.Item label="내용">
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                            />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                저장
                            </Button>
                            <Button onClick={() => setEditMode(false)}>취소</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </>)}
        </div>
    );
}