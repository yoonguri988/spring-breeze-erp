// constants/industryCode.js
// 업종 대분류(industryGrpCode) <-> 세부업종(industryCode) 공용 매핑.
// 원본: styles/js/industry-code.js (com/form.html, com/edit.html, com-ocr.js 공용 스크립트)를
// React 컴포넌트에서 import 해서 쓸 수 있도록 그대로 이식한 모듈입니다.
//
// [참고] DB(company 테이블)에는 industry_code에 대한 별도 마스터 테이블이 없어
// 여기 있는 목록은 프론트에서 예시로 구성한 참고용입니다.

export const GRP_OPTIONS = [
  { value: "C", label: "제조업" },
  { value: "F", label: "건설업" },
  { value: "G", label: "도매 및 소매업" },
  { value: "H", label: "운수 및 창고업" },
  { value: "I", label: "숙박 및 음식점업" },
  { value: "J", label: "정보통신업" },
  { value: "K", label: "금융 및 보험업" },
  { value: "M", label: "전문, 과학 및 기술 서비스업" },
  { value: "N", label: "사업시설관리, 사업지원 및 임대 서비스업" },
  { value: "S", label: "협회 및 단체, 수리 및 기타 개인 서비스업" },
];

export const GRP_LABEL_MAP = GRP_OPTIONS.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {});

// 업종 대분류 한글 라벨 -> 코드 (OCR 인식 텍스트 매칭용)
export const GRP_TEXT_MAP = GRP_OPTIONS.reduce((acc, cur) => {
  acc[cur.label] = cur.value;
  return acc;
}, {});

// 업종 대분류 -> 세부업종(코드/이름) 목록
export const CODE_MAP = {
  C: [
    { code: "10120", name: "육류 가공 및 저장 처리업" },
    { code: "20421", name: "계면활성제 제조업" },
    { code: "26290", name: "기타 전자부품 제조업" },
  ],
  F: [
    { code: "41221", name: "단독주택 건설업" },
    { code: "42111", name: "도로 건설업" },
  ],
  G: [
    { code: "45111", name: "국산 승용차 판매업" },
    { code: "46900", name: "상품 종합 도매업" },
    { code: "47190", name: "기타 종합 소매업" },
  ],
  H: [
    { code: "49110", name: "철도 운송업" },
    { code: "52941", name: "소화물 전문 운송업(택배)" },
  ],
  I: [
    { code: "55101", name: "호텔업" },
    { code: "56111", name: "한식 음식점업" },
  ],
  J: [
    { code: "58222", name: "응용 소프트웨어 개발 및 공급업" },
    { code: "62010", name: "컴퓨터 프로그래밍 서비스업" },
    { code: "63910", name: "뉴스 제공업" },
  ],
  K: [
    { code: "64121", name: "은행업" },
    { code: "64992", name: "신탁업 및 집합투자업" },
  ],
  M: [
    { code: "70112", name: "지주회사" },
    { code: "71531", name: "기타 엔지니어링서비스업" },
    { code: "72911", name: "사업시설 유지관리 서비스업" },
  ],
  N: [
    { code: "74110", name: "인력 공급 및 고용 알선업" },
    { code: "75291", name: "여행사업" },
  ],
  S: [
    { code: "94120", name: "산업 및 전문가 단체" },
    { code: "95120", name: "컴퓨터 및 주변기기 수리업" },
  ],
};

export const CODE_LABEL_MAP = Object.values(CODE_MAP)
  .flat()
  .reduce((acc, cur) => {
    acc[cur.code] = cur.name;
    return acc;
  }, {});

// 세부업종 select 옵션 목록 (대분류 코드 기준)
export function getCodeOptions(grpCode) {
  return (CODE_MAP[grpCode] || []).map((item) => ({
    value: item.code,
    label: `${item.code} · ${item.name}`,
  }));
}

// OCR 등에서 인식한 업종 대분류 텍스트 -> 코드(C/F/G ...)
export function matchGrpFromText(text) {
  if (!text) return "";
  if (GRP_TEXT_MAP[text]) return GRP_TEXT_MAP[text];
  const key = Object.keys(GRP_TEXT_MAP).find(
    (k) => text.includes(k) || k.includes(text),
  );
  return key ? GRP_TEXT_MAP[key] : "";
}

// OCR 등에서 인식한 세부업종(종목) 텍스트 -> grp에 해당하는 코드
export function matchCodeFromText(grp, text) {
  if (!grp || !text) return "";
  const list = CODE_MAP[grp] || [];
  const found = list.find(
    (item) => text.includes(item.name) || item.name.includes(text),
  );
  return found ? found.code : "";
}
