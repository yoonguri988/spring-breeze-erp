/* ==========================================================================
   SBerp — com-ocr.js
   회사 등록(com/add) 전용: 사업자등록증 OCR 자동입력 모달 로직.
   app.js(SB.toast)를 사용하며, com/add.html 인라인 스크립트가 window에 노출한
   syncIndustryCode() / checkBizNo()를 그대로 재사용합니다.
   ========================================================================== */
(function () {
  "use strict";

  /* select의 한글 라벨 <-> 코드 매핑 (industryGrpCode select와 동일해야 함) */
  const INDUSTRY_MAP = {
    "제조업": "C",
    "건설업": "F",
    "도매 및 소매업": "G",
    "운수 및 창고업": "H",
    "숙박 및 음식점업": "I",
    "정보통신업": "J",
    "금융 및 보험업": "K",
    "전문, 과학 및 기술 서비스업": "M"
  };

  function mapIndustryGrpCode(text) {
    if (!text) return "";
    if (INDUSTRY_MAP[text]) return INDUSTRY_MAP[text];
    const key = Object.keys(INDUSTRY_MAP).find((k) => text.includes(k) || k.includes(text));
    return key ? INDUSTRY_MAP[key] : "";
  }

  function resetOcrModal() {
    document.getElementById("ocrFile").value = "";
    document.getElementById("ocrResultFields").style.display = "none";
    document.getElementById("ocrApplyBtn").disabled = true;
    document.getElementById("ocrIndustryRaw").textContent = "";
    ["ocrBizNo", "ocrComName", "ocrComCeo", "ocrStartDt"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    document.getElementById("ocrIndustryGrpCode").value = "";
  }

  function handleOcrFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const loading = document.getElementById("ocrLoading");
    const applyBtn = document.getElementById("ocrApplyBtn");
    const resultFields = document.getElementById("ocrResultFields");

    applyBtn.disabled = true;
    resultFields.style.display = "none";
    loading.classList.remove("d-none");

    const formData = new FormData();
    formData.append("file", file);

    const csrfToken  = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;
    const fetchHeaders = {};
    if (csrfToken && csrfHeader) {
        fetchHeaders[csrfHeader] = csrfToken;
    }

    fetch("/api/util/ocr", {
        method: "POST",
        headers: fetchHeaders,
        body: formData
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            const d = json.data;
            document.getElementById("ocrBizNo").value = d.bizNo || "";
            document.getElementById("ocrComName").value = d.comName || "";
            document.getElementById("ocrComCeo").value = d.comCeo || "";
            document.getElementById("ocrStartDt").value = d.startDt || "";

            const code = mapIndustryGrpCode(d.industryGrpText);
            document.getElementById("ocrIndustryGrpCode").value = code;
            document.getElementById("ocrIndustryRaw").textContent = d.industryGrpText
                ? 'OCR 인식 원문: "' + d.industryGrpText + '"' + (code ? "" : " (자동 매칭 실패 - 직접 선택해주세요)")
                : "";

            resultFields.style.display = "";
            applyBtn.disabled = false;
            if (window.SB) SB.toast("사업자등록증 인식이 완료되었습니다. 내용을 확인해주세요.", "ok");
        } else {
            if (window.SB) SB.toast(json.message || "OCR 인식에 실패했습니다.", "warn");
        }
    })
    .catch(() => {
        if (window.SB) SB.toast("서버 요청 중 오류가 발생했습니다.", "warn");
    })
    .finally(() => {
        loading.classList.add("d-none");
    });
}

  function applyOcrToForm() {
    document.getElementById("bizNo").value   = document.getElementById("ocrBizNo").value.trim();
    document.getElementById("comName").value = document.getElementById("ocrComName").value.trim();
    document.getElementById("comCeo").value  = document.getElementById("ocrComCeo").value.trim();
    document.getElementById("startDt").value = document.getElementById("ocrStartDt").value;

    const grp = document.getElementById("ocrIndustryGrpCode").value;
    document.getElementById("industryGrpCode").value = grp;
    if (typeof window.syncIndustryCode === "function") window.syncIndustryCode();

    /* 값이 바뀌었으니 진위확인 스냅샷 무효화 로직(input 리스너)을 정상 트리거 */
    ["bizNo", "comCeo", "startDt"].forEach((id) => {
      document.getElementById(id).dispatchEvent(new Event("input", { bubbles: true }));
    });
    document.getElementById("industryGrpCode").dispatchEvent(new Event("change", { bubbles: true }));

    /* 사업자번호 중복 체크 자동 실행 */
    if (typeof window.checkBizNo === "function") window.checkBizNo();

    const modalEl = document.getElementById("ocrModal");
    const inst = bootstrap.Modal.getInstance(modalEl);
    if (inst) inst.hide();

    if (window.SB) SB.toast("OCR 인식 결과를 폼에 적용했습니다. 진위확인 후 등록해주세요.", "ok");
  }

  function init() {
    const fileEl   = document.getElementById("ocrFile");
    const applyBtn = document.getElementById("ocrApplyBtn");
    const modalEl  = document.getElementById("ocrModal");
    if (!fileEl || !applyBtn || !modalEl) return; // 모달이 없는 페이지에서는 조용히 종료

    fileEl.addEventListener("change", handleOcrFile);
    applyBtn.addEventListener("click", applyOcrToForm);
    modalEl.addEventListener("hidden.bs.modal", resetOcrModal);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();