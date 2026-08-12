package com.sb.erp.appr.controller;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.appr.dto.request.ApprDocRequest;
import com.sb.erp.appr.dto.request.ApprDocSearchCondition;
import com.sb.erp.appr.dto.response.ApprDocInitResponse;
import com.sb.erp.appr.dto.response.ApprDocResponse;
import com.sb.erp.appr.dto.response.ApprDocSummaryResponse;
import com.sb.erp.appr.dto.response.ApprFormResponse;
import com.sb.erp.appr.dto.response.ApprLineResponse;
import com.sb.erp.appr.service.ApprDocService;
import com.sb.erp.dept.dto.response.DeptResponse;
import com.sb.erp.util.dto.PagingUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "결재 문서", description = "전자 결재 문서 작성/조회/승인 API")
@RestController
@RequestMapping("/appr")
@RequiredArgsConstructor
public class ApprDocController {

	private final ApprDocService service;
	
	/*
	 * 보안관련 수업 진행 이후에 수정해야함
	 */

	//////////////////////////// 문서 작성 처리 파트 /////////////////////////////

	// 해당 회사에 있는 활성화된 양식 가져오기
	@Operation(summary = "사용 가능한 양식 목록 조회", description = "해당 회사에서 사용 가능한 양식 조회")
	@GetMapping("/getFormList")
	public ResponseEntity<List<ApprFormResponse>> getFormList(@RequestParam Long comId) {
		return ResponseEntity.ok(service.findForm(comId));
	}

	// 문서 작성 폼 진입시 작성자 인적사항
	@Operation(summary = "문서 작성 초기 정보 조회", description = "문서 작성 화면 진입시 필요한 작성자 인적사항을 조회")
	@GetMapping("/write_doc")
	public ResponseEntity<ApprDocInitResponse> writeDoc(@RequestParam Long empId) {
		ApprDocInitResponse result = service.initResponse(empId);
		return ResponseEntity.ok(result);
	}

	// 문서 작성 처리 (문서 + 결재선 동시 등록)
	@Operation(summary = "문서/결재선 작성", description = "문서와 결재선을 동시에 작성")
	@PostMapping("/write_doc")
	public ResponseEntity<Void> writeDocPost(
			@Valid
			@RequestBody ApprDocRequest req,
			@RequestParam Long empId,
			@RequestParam Long comId
    ) {
		Long docId = service.insertDocAndLine(req, empId, comId);

		URI location = URI.create("/appr/" + docId);
		return ResponseEntity.created(location).build();
	}

	//////////////////////////// 문서 작성 처리 파트 /////////////////////////////

	//////////////////////////// 문서 조회 처리 파트 /////////////////////////////

	@Operation(summary = "문서 목록 조회", description = "결재 했던 문서, 해야될 문서 탭별로 목록 조회")
	@GetMapping("/list_doc")
	public ResponseEntity<Map<String, Object>> listDoc(
			@RequestParam(defaultValue = "history") String tab,
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String status,
			@RequestParam(defaultValue = "1") int page,
			@RequestParam Long empId) {

		ApprDocSearchCondition condition = new ApprDocSearchCondition();
		condition.setEmpId(empId);
		condition.setTab(tab);
		condition.setKeyword(keyword);
		condition.setStatus(status);
		condition.setPage(page);

		int myTodoCnt = service.selectMyTodoDocsCnt(condition);
		Map<String, Object> docCnts = service.selectDocCnt(condition.getEmpId());

		int totalCnt = "todo".equals(tab) ?
				myTodoCnt :
				service.selectMyHistoryDocsCnt(condition);

		PagingUtil paging = new PagingUtil(totalCnt, page);
		condition.setPstartno(paging.getPstartno());
		condition.setOnepagelist(paging.getOnepagelist());

		List<ApprDocSummaryResponse> hisDocs = List.of();
		List<ApprDocSummaryResponse> todoDocs = List.of();

		if ("todo".equals(tab)) {
			todoDocs = service.selectMyTodoDocs(condition);
		} else {
			hisDocs = service.selectMyHistoryDocs(condition);
		}

		// 예전 model.addAttribute와 동일한 키 이름으로 묶어서 반환
		Map<String, Object> result = new HashMap<>();
		result.put("paging", paging);
		result.put("docCnts", docCnts);
		result.put("myTodoCnt", myTodoCnt);
		result.put("hisDocs", hisDocs);
		result.put("todoDocs", todoDocs);
		result.put("activeTab", tab);
		result.put("status", status);
		result.put("keyword", keyword);
		result.put("page", page);

		return ResponseEntity.ok(result);
	}

	//////////////////////////// 문서 조회 처리 파트 /////////////////////////////

	//////////////////////////// 문서 승인,반려 처리 ///////////////////////////////

	// 상세보기
	@Operation(summary = "문서 상세 조회", description = "문서 상세 정보와 결재선, 현재 로그인한 사용자의 결재 가능 여부 반환")
	@GetMapping("/detail_doc/{docId}")
	public ResponseEntity<Map<String, Object>> detailDoc(
			@PathVariable Long docId,
			@RequestParam Long empId
	) {

		ApprDocResponse doc = service.selectDocDetail(docId);
		List<ApprLineResponse> lines = service.selectLinesByDocId(docId);

		// 전체 결재선 목록에 결재상태가 'WAI'인 데이터가 있나 검증
		boolean canProcess = lines.stream()
				.anyMatch(l -> l.getEmpId().equals(empId) && "WAI".equals(l.getLinStatus()));

		Map<String, Object> result = new HashMap<>();
		result.put("doc", doc);
		result.put("lines", lines);
		result.put("canProcess", canProcess);

		return ResponseEntity.ok(result);
	}

	// 승인 처리
	@Operation(summary = "문서 승인 처리", description = "해당 결재선의 상태를 승인처리")
	@PostMapping("/detail_doc/{docId}/app")
	public ResponseEntity<Void> detailDocApp(
			@PathVariable Long docId,
			@RequestParam Long empId
	) {
		service.processLine(docId, empId, "APP");
		return ResponseEntity.noContent().build();
	}

	// 반려 처리
	@Operation(summary = "문서 반려 처리", description = "해당 결재선의 상태를 반려 처리")
	@PostMapping("/detail_doc/{docId}/rej")
	public ResponseEntity<Void> detailDocRej(
			@PathVariable Long docId,
			@RequestParam Long empId
	) {
		service.processLine(docId, empId, "REJ");
		return ResponseEntity.noContent().build();
	}

	//////////////////////////// 문서 승인,반려 처리 ///////////////////////////////

	//////////////////////////// 결재선 파트 ///////////////////////////////

	// 기안자 상사들 목록
	@Operation(summary = "기안자 상자 목록 조회", description = "기안자의 부서를 기준으로 결재선에 지정 가능한 상사 목록을 조회")
	@GetMapping("/getApprLines")
	public ResponseEntity<List<ApprLineResponse>> getApprLines(@RequestParam Long empId) {
		return ResponseEntity.ok(service.approversByEmpId(empId));
	}

	// 결재선 지정 가능 인원수 / (service 부터 수정후 이쪽도 수정)
	@Operation(summary = "결재선 지정용 부서 트리 조회", description = "부서 상위 체계를 따라가며 각 부서별 결재선 지정 가능 인원수를 함께 반환")
	@GetMapping("/getDeptTree")
	public ResponseEntity<List<DeptResponse>> getDeptTree(
			@RequestParam Long deptId,
			@RequestParam Long empId
	) {
		return ResponseEntity.ok(service.cntApprovers(deptId, empId));
	}

	// 특정 부서 소속 사원 목록
	@Operation(summary = "부서 소속 사원 목록 조회", description = "특정 부서에 소속된 사원 목록을 조회합니다.")
	@GetMapping("/getDeptEmps")
	public ResponseEntity<List<ApprLineResponse>> getDeptEmps(@RequestParam Long deptId) {
		return ResponseEntity.ok(service.selectDeptEmpsForLines(deptId));
	}

	//////////////////////////// 결재선 파트 ///////////////////////////////
}
