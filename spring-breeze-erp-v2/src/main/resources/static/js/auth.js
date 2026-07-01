/* ==========================================================================
   SBerp — auth.js  (데모 인증 스토어)
   login.html / reset-password.html에서 공유합니다.
   실제 서버 없이 sessionStorage로 로그인 상태를 관리합니다.
   ========================================================================== */
window.SBAUTH = (function () {
  'use strict';

  /* ---- 데모 계정 (data.js makeEmp 공식으로 계산된 값 사용) ---- */
  var USERS = [
    {
      emp_no: 'E1001', password: 'sberp1234',
      name: '김선빈', dept: '경영지원본부', pos: '팀장',
      email: 'kim.sb@sberp.co.kr', mobile: '010-1000-2000',
    },
    {
      emp_no: 'E1002', password: 'sberp1234',
      name: '이민재', dept: '플랫폼개발팀', pos: '대리',
      email: 'lee.dy@sberp.co.kr', mobile: '010-1037-2053',
    },
    {
      emp_no: 'E1003', password: 'sberp1234',
      name: '박세영', dept: '인사팀', pos: '과장',
      email: 'park.sa@sberp.co.kr', mobile: '010-1074-2106',
    },
  ];

  function norm(s) {
    return String(s || '').replace(/[-\s]/g, '').toLowerCase();
  }

  return {
    /** 사원번호 + 비밀번호 일치 여부 확인. 일치하면 user 객체 반환, 아니면 null. */
    login: function (empNo, password) {
      return USERS.find(function (u) {
        return u.emp_no === empNo.toUpperCase() && u.password === password;
      }) || null;
    },

    /** 비밀번호 찾기 본인 확인 (사원번호 + 이메일 + 휴대폰). 일치하면 user, 아니면 null. */
    verify: function (empNo, email, mobile) {
      return USERS.find(function (u) {
        return (
          u.emp_no === empNo.toUpperCase() &&
          u.email.toLowerCase() === email.toLowerCase() &&
          norm(u.mobile) === norm(mobile)
        );
      }) || null;
    },

    /** 로그인 세션 조회 */
    getSession: function () {
      try { return JSON.parse(sessionStorage.getItem('sberp_auth')); }
      catch (e) { return null; }
    },

    /** 로그인 세션 저장 */
    setSession: function (user) {
      sessionStorage.setItem('sberp_auth', JSON.stringify({
        emp_no: user.emp_no,
        name: user.name,
        dept: user.dept,
        pos: user.pos,
      }));
    },

    /** 세션 + 리셋 플래그 전부 초기화 */
    clearSession: function () {
      sessionStorage.removeItem('sberp_auth');
      sessionStorage.removeItem('sberp_reset_mode');
      sessionStorage.removeItem('sberp_reset_done');
    },
  };
})();
