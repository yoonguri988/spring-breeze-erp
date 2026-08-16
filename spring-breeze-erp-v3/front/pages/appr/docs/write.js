import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
    message, Form, Input, Select, Button, Space, List,
    Tag, Divider, Empty
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
    // empId, empName, posName 순서대로
    const [approvers, setApprovers] = useState([]);
    const [selectDeptId, setSelectDeptId] = useState(null);

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

    // 부서 기준 상사 목록 조회 
    // 결재선 추천 3차 신규기능 추가예정
    const handleAutoSuggest = () => {
        dispatch(fetchApprLinesRequest());
    };

    // 추천된 상사 목록을 순서대로 결재선에 담기
    useEffect(() => {
        if (apprLines.length > 0 && approvers.length === 0) {
            setApprovers(apprLines.map((l) => ({
                empId: l.empId,
                empName: l.empName,
                posName: l.posName
            })));
        }
    }, [apprLines]);

    const handleDeptSelect = (deptId) => {
        setSelectDeptId(deptId);
        dispatch(fetchDeptEmpsRequest(deptId));
    };

    const handleSubmit = (value) => {
        if (!docContent.trim()) {
            message.error("문서 내용을 입력해주세요.");
            return;
        }
        if (approvers.length === 0) {
            message.error("결재선을 1명 이상 지정해주세요.");
            return;
        }

        const [forId, forVersion] = values.formKey.split("-");

        const payload = {
            forId: Number(forId),
            forVersion: Number(forVersion),
            docTitle: values.docTitle,
            docContent,
            approverEmpIds: approvers.map((a) => a.empId),
        };

        dispatch(writeDocRequest({data: payload}));
    };

    return (
        <div style={{padding: 24, maxWidth: 900}}>
            <h2>문서 작성</h2>

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
                        {writableForms.map((f) => {
                            <Option
                                key={`${f.forId}-${f.forVersion}`}
                                value={`${f.forId}-${f.forVersion}`}
                            >
                                {f.forTitle} (v{forVersion})
                            </Option>
                        })}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="docTitle"
                    label="문서 제목"
                    rules={[{required: true, message: "문서 제목을 입력해주세요."}]}
                >
                    <Input/>
                </Form.Item>
                {/* 일단 에디터 방식만 구현 schema 컬럼으로 들어오는거 JSON 파싱하는거 구현해야함 */}
                <Form.Item label="문서 내용">
                    <ReactQuill
                        theme="snow"
                        value={docContent}
                        onChange={setDocContent}
                    />
                </Form.Item>

                <Divider>결재선 지정</Divider>

                <Space style={{marginBottom: 12}}>
                        <Button onClick={handleAutoSuggest} loading={apprLinesLoading}>
                            상사 목록 불러오기
                        </Button>
                </Space>

                <div style={{display: "flex", gap: 16, marginBottom: 16}}>
                    {/* 부서 트리 */}
                    <div style={{flex: 1, border: "1px solid #f0f0f0", padding: 12, borderRadius: 6}}>
                        <div style={{fontWeight: 600, marginBottom: 8}}>부서 선택</div>
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
                    {/* 선택한 부서의 사원 목록 */}

                    {/* 선택된 결재선 */}
                </div>
            </Form>
        </div>
    );
}