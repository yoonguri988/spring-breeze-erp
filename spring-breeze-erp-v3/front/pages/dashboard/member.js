import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Row, Col, Table, Button, Spin, Empty} from "antd";
import { loadUserRequest } from "../../reducers/auth/authReducer";
import { fetchWriterInfoRequest } from "../../reducers/appr/apprDocReducer";
import { fetchSummaryRequest } from "../../reducers/dashboard/memberDashboardReducer";
import StatusBadge from "../../components/appr/StatusBadge";

// 대시보드 통계 카드
function StatCard({ icon, label, value}) {
    return (
        <div className="sb-stat">
            <div className="sb-stat__top">
                <span className="sb-stat__ico">
                    <i className={`bi ${icon}`}/>
                </span>
                <span className="sb-stat__label">{label}</span>
            </div>
            <div className="sb-stat__val">{value}</div>
        </div>
    );
}

export default function Home() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation(["common", "appr"]);

    const { user, accessToken } = useSelector((state) => state.auth);
    const { writerInfo } = useSelector((state) => state.apprDoc);
    const { summary, summaryLoading, summaryError} = useSelector((state) => state.memberDashboard);

    // 로그인 정보 로드
    useEffect(() => {
        dispatch(loadUserRequest());
        dispatch(fetchWriterInfoRequest());
    }, [dispatch]);

    // 대시보드 요약 조회
    useEffect(() => {
        dispatch(fetchSummaryRequest());
    }, [dispatch]);

    if (summaryLoading || !summary) {
        return (
            <div className="sb-page" style={{textAlign: "center", padding: "80px 0"}}>
                <Spin size="large"/>
            </div>
        );
    }

    if (summaryError) {
        return (
            <div className="sb-page" style={{padding: 24}}>
                <div className="sb-card" bordered="false">
                    <Empty description={summaryError}/>
                </div>
            </div>
        );
    }

    const {
        todoDocCnt,
        todoDocs,
        leaveBalance,
        todayAttendance,
        evalOpen,
        evalProgress,
        recentNotices,
        myProjects,
        myReservations,
    } = summary;

    const attStatusText = !todayAttendance
        ? "미출근"
        : todayAttendance.checkOut
            ? "퇴근 완료"
            : "출근중";

    const todoDocColumns = [
        { title: "문서번호", dataIndex: "docId", key: "docId", width: 90 },
        { title: "제목", dataIndex: "docTitle", key: "docTitle", width: 180, ellipsis: true },
        { title: "기안자", dataIndex: "empName", key: "empName", width: 100 },
        {
            title: "상태", dataIndex: "docStatus", key: "docStatus", width: 90,
            render: (status) => <StatusBadge domain="doc" status={status} />,
        },
        {
            title: "", key: "action", width: 90,
            render: (_, record) => (
                <Button size="small" onClick={() => router.push(`/appr/docs/detail?docId=${record.docId}`)}>
                    결재하기
                </Button>
            ),
        },
    ];

    return (
        <div className="sb-page">
            {/* 인사말 헤더 */}
            <div className="sb-page-head">
                <div className="sb-page-head__txt">
                    <h1>안녕하세요, <b>{user?.empName}</b>님</h1>
                    <p>{writerInfo?.deptName} · {user?.posName} · {user?.comName}</p>
                </div>
                <div className="sb-page-head__actions">
                    <span className="sb-badge sb-badge--blue">
                        <i className="bi bi-calendar3"/>
                        {moment().format("YYYY년 MM월 DD일 (ddd)")}
                    </span>
                </div>
            </div>

            {/* 진행중 인사평가 */}
            {evalOpen && evalProgress && (
                <div
                    className="sb-card"
                    style={{
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        background: "#2563eb",
                        color: "#fff",
                    }}
                >
                    <div style={{display: "flex", alignItems: "center", gap: 12}}>
                        <i className="bi bi-clipboard-data" style={{fontSize: 22}}/>
                        <div>
                            <div style={{fontWeight: 700}}>
                                {evalProgress.periodName} 정기평가 <span className="sb-badge" style={{marginLeft: 6}}>진행중</span>
                            </div>
                            <div style={{fontSize: 13, opacity: 0.85}}>
                                평가 진행률 {evalProgress.submittedCount} / {evalProgress.totalCount}건 제출
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => router.push(`/eval/period/${evalProgress.periodId}`)}>
                        평가하러 가기
                    </Button>
                </div>
            )}
            {/* 통계카드 4개 */}
            <Row gutter={16} style={{marginBottom: 16}}>
                <Col xs={24} sm={12} md={6}>
                    <StatCard
                        icon="bi-file-earmark-text"
                        label="결재 대기"
                        value={`${todoDocCnt}건`}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <StatCard
                        icon="bi-calendar-check"
                        label="잔여 연차"
                        value={leaveBalance ? `${leaveBalance.remainingDays}일`: "-"}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <StatCard
                        icon="bi-clock"
                        label="오늘 근태"
                        value={attStatusText}
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <StatCard
                        icon="bi-kanban"
                        label="진행중 프로젝트"
                        value={`${myProjects?.length ?? 0}건`}
                    />
                </Col>
            </Row>

            {/* 컨텐츠 그리드 */}
            <Row gutter={16} style={{marginBottom: 16}}>
                <Col xs={24} md={12}>
                    <div className="sb-card equal-height-card">
                        <div className="sb-card__head">
                            <h2>결재 대기함</h2>
                            <Button
                                size="small"
                                onClick={() => router.push("/appr/docs?tab=todo")}
                            >
                                전체보기
                            </Button>
                        </div>
                        <div className="sb-card__body">
                            <Table
                                rowKey="docId"
                                columns={todoDocColumns}
                                dataSource={todoDocs}
                                pagination={false}
                                size="small"
                                scroll={{ y: 240 }}
                                locale={{emptyText: "결재 대기중인 문서가 없습니다."}}
                            />
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <div className="sb-card equal-height-card">
                        <div className="sb-card__head">
                            <h2>공지사항</h2>
                            <Button
                                size="small"
                                onClick={() => router.push("/notice/list")}
                            >
                                더보기
                            </Button>
                        </div>
                        <div className="sb-card__body scrollable-timeline">
                            {(!recentNotices || recentNotices.length === 0) ? (
                                <Empty description="등록된 공지가 없습니다."/>
                            ) : (
                                recentNotices.map((n) => (
                                    <div
                                        key={n.bno}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "10px 0",
                                            borderBottom: "1px solid #f0f0f0",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <span style={{fontWeight: 500}}>{n.btitle}</span>
                                        <span style={{fontSize: 12, color: "#8a93a3"}}>
                                            {moment(n.createdAt).format("YYYY-MM-DD")}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </Col>  
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <div className="sb-card equal-height-card">
                        <div className="sb-card__head">
                            <h2>내 프로젝트</h2>
                            <Button size="small" onClick={() => router.push("/proj/proj_list")}>
                                전체보기
                            </Button>
                        </div>
                        <div className="sb-card__body scrollable-timeline">
                            {(!myProjects || myProjects.length === 0) ? (
                                <Empty description="참여중인 프로젝트가 없습니다."/>
                            ) : (
                                myProjects.map((p) => (
                                    <div key={p.proId} style={{marginBottom: 16}}>
                                        <div style={{display: "flex", justifyContent: "space-between", marginBottom: 6}}>
                                            <span style={{fontWeight: 600}}>{p.proName}</span>
                                            {p.endDate && (
                                                <span style={{fontSize: 12, color: "#8a93a3"}}>
                                                    ~{moment(p.endDate).format("YYYY-MM-DD")}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                                            <div style={{flex: 1, height: 6, background: "#f0f0f0", borderRadius: 3}}>
                                                <div style={{
                                                    width: `${p.progressRate}%`,
                                                    height: "100%",
                                                    background: "#2563eb",
                                                    borderRadius: 3
                                                }}
                                                />
                                            </div>
                                            <span style={{fontSize: 12, color: "#8a93a3"}}>{p.progressRate}%</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <div className="sb-card equal-height-card">
                        <div className="sb-card__head">
                            <h2>내 자원예약</h2>
                            <Button
                                size="small"
                                onClick={() => router.push("/resv/my")}
                            >
                                더보기
                            </Button>
                        </div>
                        <div className="sb-card__body scrollable-timeline">
                            {(!myReservations || myReservations.length === 0) ? (
                                <Empty description="최근 신청한 예약이 없습니다."/>
                            ) : (
                                myReservations.map((r) => (
                                    <div
                                        key={r.revId}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "10px 0",
                                            borderBottom: "1px solid #f0f0f0"
                                        }}
                                    >
                                        <div>
                                            <div style={{fontWeight: 500}}>{r.resName}</div>
                                            <div style={{fontSize: 12, color: "#8a93a3"}}>
                                                {moment(r.startDt).format("YYYY-MM-DD HH:mm")} ~ {moment(r.endDt).format("HH:mm")}
                                            </div>
                                        </div>
                                        <span className={`sb-badge ${r.status === "APP"
                                            ? "sb-badge--green" : r.status === "WAI"
                                            ? "sb-badge--amber" : "sb-badge--gray"}`}>
                                                {r.status === "APP" ? "승인" : r.status === "WAI" ? "대기" : r.status}
                                        </span>
                                    </div> 
                                ))
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}   