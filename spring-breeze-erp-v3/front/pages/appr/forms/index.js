import { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useRouter } from "next/router";
import { Table, Input, Select, Button, Space, Tag, message } from "antd";
import { fetchFormListRequest, deleteFormRequest } from "../../../reducers/appr/apprFormReducer";

const { Option } = Select;

export default function FormListPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { list, loading, totalCount, page, pageSize } = useSelector((state) => state.apprForm);

    const [keyword, setKeyword] = useState("");
    const [forStatus, setForStatus] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);

    // JWT 전까지 임시값
    const comId = 1;

    useEffect(() => {
        dispatch(fetchFormListRequest({
            comId,
            keyword,
            forStatus,
            page: currentPage,
            onepagelist: 10,
        }));
    }, [dispatch, keyword, forStatus, currentPage]);

    const handleDelete = (forId, forVersion) => {
        dispatch(deleteFormRequest({forId, forVersion}));
    }

    // 검색
    /*
        title -> 테이블 헤더에 보일 텍스트
        dataIndex -> list 배열의 객체에서 어떤 필드를 꺼낼지
        key -> react가 렌더링할때 각 열을 구분하기 위함

        예 ) {title: "코드", dataIndex: "forCode", key: "forCode"}
        코드라는 헤더 아래 forCode값을 값을 뿌려줌

        render -> 인자 2가지 (value, record)
        상태(title)의 경우엔 dataIndex가 있으므로 value 값을 가져오는거고
        관리의 경우엔 dataIndex가 없어서 (_, record) 로
        첫 값(value)를 무시하라는 의미로 _, 를 사용

        상태
        -> forStatus의 true/false를 프론트에 가공해서 출력해야하므로
        antd가 record.forStatus 값을 꺼내서 status에 값을 넘겨줌
        그래서 Tag 안쪽 3항 연산자로 렌더링

        관리
        -> 여러값(forId, forVersion) 이 필요한 열 이므로
        상세 버튼을 누르면 forId,Version을 이용하여 상세 페이지로 이동하고
        삭제 버튼을 누르면 handleDelete를 호출

        정리
        { title, dataIndex, key } -> 필드값을 가공없이 그대로 출력
        { title, dataIndex, key, render: () => ... } 그 필드값 하나를 가공해서 출력할때
        { title, key, render: (_, record) => ... } row 전체 정보가 필요할때
        
    */
    const columns = [
        {title: "코드", dataIndex: "forCode", key: "forCode"},
        {title: "제목", dataIndex: "forTitle", key: "forTitle"},
        {title: "버전", dataIndex: "forVersion", key: "forVersion", width: 80},
        {
            title: "상태",
            dataIndex: "forStatus",
            key: "forStatus",
            width: 100,
            render: (status) => <Tag color={status ? "green" : "default"}>{status ? "활성" : "비활성"}</Tag>,
        },
        {title: "등록일", dataIndex: "createdAt", key: "createdAt"},
        {
            title: "관리",
            key: "action",
            width: 160,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() => router.push(`/appr/forms/${record.forId}/${record.forVersion}`)}
                    >
                        상세
                    </Button>
                    <Button
                        size="small"
                        danger
                        onClick={() => handleDelete(record.forId, record.forVersion)}
                    >
                        삭제
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{padding: 24}}>
            <Space style={{marginBottom: 16}}>
                <Input.Search
                    placeholder="양식 코드/제목 검색"
                    onSearch={(value) => {
                        setKeyword(value);
                        setCurrentPage(1);
                    }}
                    style={{width: 240}}
                    allowClear
                />
                <Select
                    placeholder="상태"
                    onChange={(value) => {
                        setForStatus(value);
                        setCurrentPage(1);
                    }}
                    style={{width: 120}}
                    allowClear
                >
                    <Option value={true}>활성</Option>
                    <Option value={false}>비활성</Option>
                </Select>
                <Button type="primary" onClick={() => router.push("/appr/forms/write")}>
                    양식 등록
                </Button>
            </Space>

            {/*
                react는 리스트를 렌더링할때 항목을 구분할 고유 key가 필요 
                ${record.forId}-${record.ForVersion}의 경우 복합키이기 때문에
                3-1, 3-2 처럼 문자열하나로 만들어서 고유키를 만들어줌
                columns -> 위에 구현한 설계도
                dataSource -> 채워넣을 데이터
                current -> 지금 몇 페이지를 보고있나
                    page는 서버가 알려준 페이지 currentPage는 로컬로 관리하는 값
                    store 값이 있으면 그걸 쓰고 없으면 로컬 값 사용
                pageSize -> 한페이지에 몇개씩 보여줄지
                total -> 전체 데이터 개수
                onChange -> 사용자가 페이지 번호/다음 버튼을 클릭했을때 호출
                    클릭한 페이지 번호를 받아서 setCurrentPage(p)로 로컬 상태를 갱신
            */}
            <Table
                rowKey={(record) => `${record.forId}-${record.forVersion}`}
                columns={columns}
                dataSource={list}
                loading={loading}
                pagination={{
                    current: page || currentPage,
                    pageSize: pageSize || 10,
                    total: totalCount,
                    onChange: (p) => setCurrentPage(p),
                }}
            />
        </div>
    );
}