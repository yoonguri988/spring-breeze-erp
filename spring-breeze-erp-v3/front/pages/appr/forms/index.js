import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import {
    Table, Input, Select, Button, Space, Tag, message,
    Badge, Spin, Card
} from "antd";
import { SearchOutlined, BankOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchFormListRequest, deleteFormRequest } from "../../../reducers/appr/apprFormReducer";
import { searchCompany } from "../../../api/appr/apprFormApi";
import PageHeader from "../../../components/appr/PageHeader";

const { Option } = Select;

export default function FormListPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation(["appr", "common"]);

    const { list, loading, totalCount, page, pageSize } = useSelector((state) => state.apprForm);

    // 서버로 나가는 조회 조건 - 검색 버튼 눌러야 반영
    const [appliedFilters, setAppliedFilters] = useState({comId: undefined, keyword: "", forStatus: undefined});
    const [currentPage, setCurrentPage] = useState(1);

    // 입력중인 값들 - 검색 누르기 전까진 여기까지 바뀜
    const [keywordDraft, setKeywordDraft] = useState("");
    const [statusDraft, setStatusDraft] = useState(undefined);
    const [comIdDraft, setComIdDraft] = useState(undefined);
    const [comNameDraft, setComNameDraft] = useState(undefined);
    

    // 회사검색
    const [companyOptions, setCompanyOptions] = useState([]);
    const [companySearching, setCompanySearching] = useState(false);
    const debounceRef = useRef(null);

    const handleCompanySearch = (value) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!value) {
            setCompanyOptions([]);
            return;
        }

        // 타이핑 마다 호출 막기
        debounceRef.current = setTimeout(async () => {
            setCompanySearching(true);
            try {
                const data = await searchCompany(value);
                setCompanyOptions(data);
            } catch (err) {
                setCompanyOptions([]);
            } finally {
                setCompanySearching(false);
            }
        }, 300);
    };

    const handleCompanySelect = (value, option) => {
        setComIdDraft(value);
        setComNameDraft(option.children);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        setAppliedFilters({
            comId: comIdDraft,
            keyword: keywordDraft,
            forStatus: statusDraft,
        });
    };

    useEffect(() => {

        // 많은 데이터 조회 방지 (회사 선택 전엔 조회하지않음)
        if (!appliedFilters.comId) return;

        dispatch(fetchFormListRequest({
            ...appliedFilters,
            page: currentPage,
            onepagelist: 10,
        }));
    }, [dispatch, appliedFilters, currentPage]);

    const handleDelete = (forId, forVersion) => {
        dispatch(deleteFormRequest({forId, forVersion}));
    };

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
        {
            title: t("forms.list.table.no"),
            key: "no",
            width: 70,
            render: (_, __, index) => (page - 1) * (pageSize || 10) + index + 1,
        },
        {title: t("forms.list.table.forCode"), dataIndex: "forCode", key: "forCode"},
        {title: t("forms.list.table.forTitle"), dataIndex: "forTitle", key: "forTitle", ellipsis: true},
        {
            title: t("forms.list.table.comName"),
            dataIndex: "comName",
            key: "comName",
            width: 160,
            ellipsis: true,
        },
        {title: t("forms.list.table.forVersion"), dataIndex: "forVersion", key: "forVersion", width: 80},
        {
            title: t("forms.list.table.forStatus"),
            dataIndex: "forStatus",
            key: "forStatus",
            width: 110,
            render: (status) => (
                <Badge status={status ? "success" : "default"} text={status ? t("common.statusActive") : t("common.statusInactive")}/>
            ),
        },
        {title: t("forms.list.table.createdAt"), dataIndex: "createdAt", key: "createdAt"},
        {title: t("forms.list.table.updatedAt"), dataIndex: "updatedAt", key: "updatedAt"},
        {
            title: t("forms.list.table.actions"),
            key: "action",
            width: 160,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        onClick={() => router.push(`/appr/forms/detail?forId=${record.forId}&forVersion=${record.forVersion}`)}
                    >
                        {t("forms.list.detailBtn")}
                    </Button>
                    <Button
                        size="small"
                        danger
                        onClick={() => handleDelete(record.forId, record.forVersion)}
                    >
                        {t("forms.list.deleteBtn")}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="sb-page">
            <PageHeader
                breadcrumb={[
                    { label: t("common.breadcrumbRoot"), href: "/appr/forms" },
                    { label: t("forms.list.breadcrumbCurrent") },
                ]}
                title={t("forms.list.title")}
                subtitle={t("forms.list.subtitle")}
                actions={
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => router.push("/appr/forms/write")}>
                        {t("forms.list.addBtn")}
                    </Button>
                }
            />

            <Card>
                <div style={{display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "flex-end"}}>
                    <div>
                        <div style={{marginBottom: 6, fontSize: 13, color: "#666"}}>{t("forms.list.companyLabel")}</div>
                        <Select
                            showSearch
                            placeholder={t("forms.list.companySearchPlaceholder")}
                            style={{width: 260}}
                            optionLabelProp="label"
                            value={comIdDraft}
                            defaultActiveFirstOption={false}
                            filterOption={false} // 서버 검색결과를 그대로 사용
                            suffixIcon={<BankOutlined/>}
                            notFoundContent={companySearching ? <Spin size="small" /> : t("forms.list.companySearchEmpty")}
                            onSearch={handleCompanySearch}
                            onChange={handleCompanySelect}
                            onClear={() => {
                                setComIdDraft(undefined);
                                setComNameDraft(undefined);
                            }}
                            allowClear
                        >
                            {companyOptions.map((c) => (
                                <Option
                                    key={c.comId}
                                    value={c.comId}
                                    label={`${c.comName} (${c.bizNo})`}
                                >
                                    <span
                                        title={`${c.comName} (${c.bizNo})`}
                                        style={{
                                            display: "block",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {c.comName} ({c.bizNo})
                                    </span>
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <div style={{marginBottom: 6, fontSize: 13, color: "#666"}}>{t("forms.list.keywordLabel")}</div>
                        <Input
                            placeholder={t("forms.list.keywordPlaceholder")}
                            style={{width: 220}}
                            value={keywordDraft}
                            onChange={(e) => setKeywordDraft(e.target.value)}
                            onPressEnter={handleSearch}
                            allowClear
                        />
                    </div>

                    <div>
                        <div style={{marginBottom: 6, fontSize: 13, color: "#666"}}>{t("forms.list.activeLabel")}</div>
                        <Select
                            placeholder={t("forms.list.activeAllPlaceholder")}
                            style={{width: 140}}
                            value={statusDraft}
                            onChange={(value) => setStatusDraft(value)}
                            allowClear
                        >
                            <Option value={true}>{t("forms.list.activeOption")}</Option>
                            <Option value={false}>{t("forms.list.inactiveOption")}</Option>
                        </Select>
                    </div>

                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        disabled={!comIdDraft}
                    >
                        {t("forms.list.searchBtn")}
                    </Button>
                </div>
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
                {!appliedFilters.comId ? (
                    <div style={{padding: "80px 0", textAlign: "center", color: "#999"}}>
                        {t("forms.list.selectCompanyMsg")}
                    </div>
                ) : (
                    <Table
                        rowKey={(record) => `${record.forId}-${record.forVersion}`}
                        columns={columns}
                        dataSource={list}
                        loading={loading}
                        scroll={{ x: 1100}}
                        pagination={{
                            current: page || currentPage,
                            pageSize: pageSize || 10,
                            total: totalCount,
                            onChange: (p) => setCurrentPage(p),
                        }}
                    />
                )}
            </Card>
        </div>
    );
}