import { Input, Select, Checkbox, Button, Space, Tag } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const FIELD_TYPES = ["text", "textarea", "date", "number", "select"];

// key는 영문, 숫자, 언더바 만 허용
function sanitizeKey(value) {
    return value.replace(/[^a-zA-Z0-9_]/g, "");
}

export default function SchemaFieldEditor({ fields, onChange, readOnly = false }) {
    const updateField = (index, patch) => {
        const next = fields.map((f, i) => (i === index ? {...f, ...patch} : f));
        onChange(next);
    };

    const removeField = (index) => {
        onChange(fields.filter((_, i) => i !== index));
    };

    const addField = () => {
        onChange([...fields, {key: "", label: "", type: "text", required: false, options: []}]);
    };

    return (
        <div>
            <Space direction="vertical" style={{width: "100%"}} size={12}>
                {fields.map( (field, index) => (
                    <div
                        key={index}
                        style={{border: "1px solid #d9d9d9", borderRadius: 6, padding: 12}}
                    >
                        <Space wrap style={{width: "100%"}}>
                            <div>
                                <div style={{fontSize: 12, marginBottom: 4}}>필드 라벨</div>
                                <Input
                                    style={{width: 160}}
                                    value={field.label}
                                    disabled={readOnly}
                                    onChange={(e) => updateField(index, {label: e.target.value})}
                                />
                            </div>

                            <div>
                                <div style={{fontSize: 12, marginBottom: 4}}>타입</div>
                                <Select
                                    style={{width: 120}}
                                    value={field.type}
                                    disabled={readOnly}
                                    onChange={(value) => updateField(index, {type: value})}
                                    options={FIELD_TYPES.map((t) => ({label: t, value: t}))}
                                />
                            </div>

                            <div>
                                <div style={{fontSize: 12, marginBottom: 4}}>key</div>
                                <Input
                                    style={{width: 160}}
                                    placeholder="예: trip_reason"
                                    value={field.key}
                                    disabled={readOnly}
                                    onChange={(e) => updateField(index, {key: sanitizeKey(e.target.value)})}
                                />
                            </div>

                            <div style={{paddingTop: 20}}>
                                <Checkbox
                                    checked={field.required}
                                    disabled={readOnly}
                                    onChange={(e) => updateField(index, {required: e.target.checked})}
                                >
                                    필수 입력 여부
                                </Checkbox>
                            </div>

                            {!readOnly && (
                            <div style={{paddingTop: 20}}>
                                <Button 
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeField(index)}
                                >
                                    삭제
                                </Button>
                            </div>
                            )}
                        </Space> 

                        {field.type === "select" && (
                            <div style={{marginTop: 8}}>
                                <div style={{fontSize: 12, marginBottom: 4}}>선택지 (Enter로 추가)</div>
                                <Select
                                    mode="tags"
                                    style={{width: "100%"}}
                                    value={field.options || []}
                                    onChange={(options) => updateField(index, {options})}
                                    tokenSeparators={[","]}
                                />
                            </div>
                        )}   
                    </div>
                ))}
            </Space>

            {!readOnly && (
            <Button
                type="dashed"
                icon={<PlusOutlined/>}
                onClick={addField}
                style={{ marginTop: 12}}
            >
                필드 추가
            </Button>
            )}
        </div>
    );
}

// 저장 전 검증
export function validateSchemaFields(fields) {
    // 필드가 존재하는지 확인
    if (fields.length === 0) {
        return "최소 1개 이상의 필드가 필요합니다.";
    }

    const keys = fields.map( (f) => f.key.trim());

    // key 입력란 비어있는지 확인
    if (keys.some( (k) => k === "")) {
        return "모든 필드의 key 값을 입력해주세요.";
    }

    // key 값 중복 확인
    if (new Set(keys).size !== keys.length) {
        return "key 값이 중복되었습니다. 각 필드는 고유한 key를 가져야합니다."
    }

    return null;
}