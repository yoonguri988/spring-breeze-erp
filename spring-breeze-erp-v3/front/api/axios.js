// api/axios.js
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  // 기본 api 서버 주소, 환경변수 없으면 로컬 서버 사용
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  // refreshToken 이 HttpOnly 쿠키에 저장이 되어 있으면 자동으로 포함 필요
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", // 요청 기본 json
    Accept: "application/json", // 응답을 json 받도록 지정
  },
});
// 요청 인터셉터: 요청보내기 전에 Access Token 을 헤더에 추가
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = Cookies.get("accessToken"); // localStorage → Cookies로 변경
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // CSR 환경에서만 localStorage 접근
      // const accessToken = localStorage.getItem("accessToken"); // 저장된 Access Token 가져오기
      // if (accessToken) {
      //   config.headers.Authorization = `Bearer ${accessToken}`; //Authorization 헤더에 추가
      // }
    }
    return config;
  },
  (error) => Promise.reject(error), // 요청에러처리
);

// 동시 요청용 refreshToken 상태 관리
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  refreshQueue = [];
};

api.interceptors.response.use(
  (res) => res, // 정상 응답 그대로 반환
  async (error) => {
    const original = error.config; // 원래 요청 정보
    const status = error.response?.status; // 응답 상태 코드

    // refresh 요청 자체가 실패한 경우 → 재귀 방지, 즉시 로그아웃 처리
    if (original?.url?.includes("/auth/refresh")) {
      if (typeof window !== "undefined") {
        Cookies.remove("accessToken");
        //window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }

    // 401 발생 Refresh Token 재발급
    if (status === 401 && !original._retry) {
      // 이미 refresh 진행 중이면 큐에 대기했다가 새 토큰으로 재시도
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        });
      }

      original._retry = true; //무한 루프 방지 플래그
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");
        const newAccessToken = data?.accessToken;

        if (typeof window !== "undefined" && newAccessToken) {
          // localStorage.setItem("accessToken", newAccessToken); // local 저장
          Cookies.set("accessToken", newAccessToken);
        }

        processQueue(null, newAccessToken); // 대기 중인 요청 재시도
        original.headers.Authorization = `Bearer ${newAccessToken}`; // 원 요청 헤어 갱신
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if (typeof window !== "undefined") {
          // localStorage.removeItem("accessToken"); // Access Token 제거
          Cookies.remove("accessToken"); // Access Token 제거
          //window.location.href = "/auth/login"; // 로그인 페이지로 이동 (실제 로그인 라우트는 /login이 아니라 /auth/login)
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
