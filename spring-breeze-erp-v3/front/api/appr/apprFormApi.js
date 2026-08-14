import api from "../axios"

const BASE = "/api/appr/forms";

// 양식 코드 중복 확인
export const checkCode = (forCode, comId, forId) =>
    api.get(`${BASE}/check-code`, {params: {forCode, comId, forId}}).then((res) => res.data);

// 회사 검색
export const searchCompany = (keyword) =>
    api.get(`${BASE}/companies`, {params: {keyword}}).then((res) => res.data);

// AI 스키마 생성
export const generateAiSchema = (prompt) =>
    api.post(`${BASE}/ai-schema`, {prompt}).then((res) => res.data);