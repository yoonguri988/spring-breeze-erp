// components/ApplicantAuthLayout.js
// 지원자(채용 공개 사이트) 전용 로그인 레이아웃.
// 사내 직원용 AuthLayout(components/AuthLayout.js)과 같은 2단 구조(좌측 브랜드 패널 + 우측 폼)를
// 그대로 계승하되, 아래 지점에서 의도적으로 다르게 간다.
//  - 색감: ERP 관리자용 블루 그라데이션이 아니라, 채용/커리어 사이트임을 즉시 알 수 있도록
//    다른 톤(딥그린 계열)의 그라데이션을 쓴다. (한 브라우저에서 관리자 로그인 화면과
//    지원자 로그인 화면을 혼동하지 않도록 하는 목적도 있다.)
//  - 카피: 사내 시스템 소개(결재/프로젝트/근태 등)가 아니라 "이 회사에 지원한다"는 맥락의 카피.
//  - 인증수단: 이메일/비밀번호 폼이 아예 없다 — 소셜 로그인 버튼만 노출한다(children으로 주입).
//  - LanguageSwitcher 미포함: sal 모듈과 마찬가지로 채용 모듈도 이번 범위는 다국어 미지원.
import React from "react";

export default function ApplicantAuthLayout({ children }) {
  return (
    <div className="caw">
      <aside className="cab">
        <div className="cab-logo">
          <div className="cab-mark">S</div>
          <span className="cab-name">SBerp Careers</span>
        </div>
        <div className="cab-mid">
          <div className="cab-tagline">
            함께 성장할
            <br />
            동료를 찾습니다
          </div>
          <div className="cab-tagline-sub">
            지원 현황 확인부터 이력서 제출까지,
            <br />
            한 곳에서 편하게 진행하세요.
          </div>
          <div className="cab-feats">
            <div className="cab-feat">
              <span className="cab-feat-dot" />
              <span>소셜 계정으로 간편 로그인 (카카오·네이버·구글)</span>
            </div>
            <div className="cab-feat">
              <span className="cab-feat-dot" />
              <span>지원 후 언제든 진행 상태를 확인</span>
            </div>
            <div className="cab-feat">
              <span className="cab-feat-dot" />
              <span>이력서(PDF) 업로드 및 재제출</span>
            </div>
          </div>
        </div>
        <div className="cab-foot">© SBerp. 채용 지원자를 위한 공간입니다.</div>
      </aside>
      <main className="cap">
        <div className="cap-wrap">{children}</div>
      </main>
    </div>
  );
}
