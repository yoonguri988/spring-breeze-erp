package com.sb.erp.res.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sb.erp.emp.dto.EmpDto;
import com.sb.erp.emp.service.EmpService;
import com.sb.erp.res.dto.request.ResRequest;
import com.sb.erp.res.dto.request.ResSearchRequest;
import com.sb.erp.res.dto.response.ResResponse;
import com.sb.erp.res.service.ResourceService;
import com.sb.erp.resv.service.ReservationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name="Resource REST API", description = "자원 관리 REST API")
@RestController
@RequestMapping("/api/res")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class ResourceController {
    @Autowired private ResourceService service;
    @Autowired private ReservationService resvService;
    @Autowired private EmpService empService;

    // 자원 관리 목록 조회 GET /api/res
    // Authentication - comId
    // TODO: Security 적용 후 @AuthenticationPrincipal CustomUserDetails user 파라미터로 받아
    //       search.setComId(user.getUser().getComId()) 로 대체하고, 클라이언트가 comId를 직접
    //       넘기지 못하도록 ResSearchRequest 바인딩에서 comId 파라미터는 무시/검증 처리할 것
    // 검색 조건: null 이면 자원 목록 조회 안함
    @Operation(summary = "자원 목록 조회", description = "검색 조건에 맞는 자원 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ResResponse>> getResources(ResSearchRequest search){
    	return ResponseEntity.ok(service.getResourceList(search));
    }
    
    // 자원 관리 전체 개수 조회 GET /api/res/count  (페이징 계산용)
    // TODO: Security 적용 후 @AuthenticationPrincipal 로 comId 세팅 (목록 조회와 동일)
    @Operation(summary = "자원 전체 개수 조회", description = "검색 조건에 맞는 자원의 전체 개수를 조회합니다.")
    @GetMapping("/count")
    public ResponseEntity<Integer> getResourceCount(ResSearchRequest search) {
        return ResponseEntity.ok(service.getResourceCount(search));
    }
    
    // 자원 관리 단건 조회 GET /api/res/{resId}
    @Operation(summary = "자원 단건 조회", description = "자원 ID로 상세 정보를 조회합니다.")
    @GetMapping("/{resId}")
    public ResponseEntity<ResResponse> getResource(@PathVariable("resId") int resId) {
        ResResponse res = service.getResourceDetail(resId);
        if (res == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(res);
    }
    
    // 자원 관리 등록 POST /api/res
    // Authentication - comId
    // TODO: Security 적용 후 @AuthenticationPrincipal CustomUserDetails user 파라미터로 받아
    //       resDto.setComId(user.getUser().getComId()) 로 덮어써서 요청 바디의 comId를 신뢰하지 말 것
    @Operation(summary = "자원 등록", description = "신규 자원을 등록합니다. 자원코드는 회사 내에서 중복될 수 없습니다.")
    @PostMapping
    public ResponseEntity<Map<String, Object>> insertResource(@RequestBody ResRequest resDto) {
        Map<String, Object> result = new HashMap<>();
 
        // 자원코드 중복 체크
        if (service.isDuplicateResCode(resDto) != null) {
            result.put("success", false);
            result.put("reason", "duplicateResCode");
            result.put("message", "이미 등록된 자원코드입니다.");
            return ResponseEntity.badRequest().body(result);
        }
 
        int inserted = service.insertResource(resDto);
        if (inserted > 0) {
            result.put("success", true);
            result.put("message", "자원 등록 성공");
            result.put("resource", resDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        }
 
        result.put("success", false);
        result.put("message", "자원 등록 실패");
        return ResponseEntity.internalServerError().body(result);
    }
    
    // 자원 관리 수정 PUT /api/res/{resId}
    // TODO: Security 적용 후 해당 자원의 comId와 로그인한 사용자(@AuthenticationPrincipal)의 comId가
    //       일치하는지 검증하는 로직 추가 (다른 회사 자원을 수정하지 못하도록)
    @Operation(summary = "자원 수정", description = "자원 정보를 수정합니다. 전달된 필드만 부분 수정됩니다.")
    @PutMapping("/{resId}")
    public ResponseEntity<Map<String, Object>> updateResource(@PathVariable("resId") Long resId,
                                                              @RequestBody ResRequest resDto) {
        Map<String, Object> result = new HashMap<>();
        resDto.setResId(resId);
 
        int updated = service.updateResource(resDto);
        if (updated > 0) {
            result.put("success", true);
            result.put("message", "자원 수정 성공");
            return ResponseEntity.ok(result);
        }
 
        result.put("success", false);
        result.put("message", "해당 자원을 찾을 수 없습니다.");
        return ResponseEntity.notFound().build();
    }

    // 자원 관리 삭제 DELETE /api/res/{resId}
    // Authentication - empId
    // TODO: Security 적용 후 @AuthenticationPrincipal CustomUserDetails user 파라미터로 받아
    //       empDto.setEmpId(user.getUser().getEmpId()) 로 덮어써서 요청 바디의 empId를 신뢰하지 말 것
    //       (본인 로그인 사용자의 비밀번호로만 검증되도록)
    // empService.matchPassword: 입력한 비밀번호와 저장된 비밀번호가 불일치하면 삭제 불가
    // resvService.countReservationsByResourceId: 예약 처리 중인 자원의 경우 삭제 불가
    @Operation(summary = "자원 삭제", description = "비밀번호 확인 후 자원을 삭제합니다. 진행 중인 예약이 있으면 삭제할 수 없습니다.")
    @DeleteMapping("/{resId}")
    public ResponseEntity<Map<String, Object>> deleteResource(@PathVariable("resId") Integer resId,
                                                              @RequestBody EmpDto empDto) {
        Map<String, Object> result = new HashMap<>();
 
        // 입력한 비밀번호와 저장된 비밀번호 일치 여부 확인
        boolean matched = empService.matchPassword(empDto);
        if (!matched) {
            result.put("success", false);
            result.put("reason", "passwordMismatch");
            result.put("message", "비밀번호가 올바르지 않습니다.");
            return ResponseEntity.badRequest().body(result);
        }
 
        // 예약 처리 중인 자원의 경우 삭제 불가
        int resvCount = resvService.countReservationsByResourceId(resId);
        if (resvCount > 0) {
            result.put("success", false);
            result.put("reason", "hasReservations");
            result.put("message", "이 자원에는 진행 중인 예약이 " + resvCount + "건 있습니다. 예약을 먼저 취소하거나 완료한 뒤 다시 시도해주세요.");
            return ResponseEntity.badRequest().body(result);
        }
 
        service.deleteResource(resId);
        result.put("success", true);
        result.put("message", "자원 삭제 성공");
        return ResponseEntity.ok(result);
    }
    
    
    // 자원코드 중복 체크 GET /api/res/check-rescode
    // Authentication - comId
    // TODO: Security 적용 후 @AuthenticationPrincipal 로 comId를 세팅하고,
    //       RequestParam으로 받는 comId는 제거할 것
    @Operation(summary = "자원코드 중복 체크", description = "회사 내 자원코드 중복 여부를 확인합니다.")
    @GetMapping("/check-rescode")
    public ResponseEntity<Map<String, Boolean>> checkResCode(@RequestParam("comId") Long comId,
                                                             @RequestParam("resCode") String resCode) {
        ResRequest dto = new ResRequest();
        dto.setComId(comId);
        dto.setResCode(resCode);
 
        ResResponse existing = service.isDuplicateResCode(dto);
 
        Map<String, Boolean> result = new HashMap<>();
        result.put("duplicate", existing != null);
        return ResponseEntity.ok(result);
    }
    
    // 예약 가능한 회사 자원 목록 조회 GET /api/res/reservable
    // 예약 화면(자원 선택)에서 사용 - RES_STATUS = 'AVAILABLE' && QUANTITY > 0 인 자원만 조회
    // TODO: Security 적용 후 @AuthenticationPrincipal 로 comId를 세팅 (목록 조회와 동일)
    @Operation(summary = "예약 가능 자원 목록 조회", description = "예약 화면에서 선택 가능한(AVAILABLE, 재고 있음) 자원 목록을 조회합니다.")
    @GetMapping("/reservable")
    public ResponseEntity<List<ResResponse>> getReservableResources(ResSearchRequest search) {
        return ResponseEntity.ok(service.getResListForResv(search));
    }
}


/* 원래 코드 주석 처리
 @GetMapping("/list")
 public String list(ResSearchDto search, Authentication auth, Model model) {
	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
	search.setComId(user.getUser().getComId());
	
	int listtotal = service.getResourceCount(search);
	// 검색 조건이 null
	boolean isEmpty = !search.hasSearchCondition();
	
	List<ResDto> list = new ArrayList<>();
	PagingUtil paging;
	
	if(isEmpty) {
    	paging = new PagingUtil(0, search.getPstartno());
	}else {
		paging = new PagingUtil(listtotal, search.getPstartno(), search.getOnepagelist(), 10);
		list = service.getResourceList(search);
	}
	
    model.addAttribute("resourceList", list);
    model.addAttribute("paging", paging);
    model.addAttribute("search", search);

    return "res/list";
}

// 자원 관리 상세 페이지
@GetMapping("/detail")
//@PreAuthorize("hasRole('ADMIN')")
public String detail(@RequestParam("resId") int resId,
                     @RequestParam(value = "error", required = false) String error,
                     Model model) {
    ResDto dto = service.getResourceDetail(resId);
    model.addAttribute("res", dto);
    model.addAttribute("error", error);
    return "res/detail";
}

// 자원 관리 등록 페이지
@GetMapping("/insert")
@PreAuthorize("hasRole('ADMIN')")
public String insertForm() {
    return "res/insert";
}

// 자원 관리 등록 기능
@PostMapping("/insert")
@PreAuthorize("hasRole('ADMIN')")
public String insert(ResDto resDto, Authentication auth, RedirectAttributes rttr) {
	String msg = "자원관리 등록실패";
	// 현재 로그인 사용자 정보
	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
	resDto.setComId(user.getUser().getComId());
	
	if(service.insertResource(resDto) > 0) { msg = "자원 관리 등록 성공"; }
	
	rttr.addFlashAttribute("msg",msg);
    return "redirect:/res/list";
}

// 자원 관리 수정 페이지
@GetMapping("/update")
@PreAuthorize("hasRole('ADMIN')")
public String updateForm(@RequestParam("resId") int resId, Model model) {
    ResDto resourceDto = service.getResourceDetail(resId);
    model.addAttribute("resource", resourceDto);
    return "res/update";
}

// 자원 관리 수정 등록
@PostMapping("/update")
@PreAuthorize("hasRole('ADMIN')")
public String update(ResDto resourceDto) {
	service.updateResource(resourceDto);
    return "redirect:/res/list";
}

// 자원 관리 삭제 기능
@PostMapping("/delete")
@PreAuthorize("hasRole('ADMIN')")
@ResponseBody
public Map<String, Object> delete(@RequestParam("resId") Integer resId, Authentication auth, EmpDto dto) {
	Map<String, Object> result = new HashMap<>();
	
	// 현재 로그인 사용자 정보
	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
	dto.setEmpId(user.getUser().getEmpId());

	// 입력한 비밀번호와 저장된 비밀 번호가 불일치 (평문, 암호화)
	boolean matched = empService.matchPassword(dto);
	    if (!matched) {
	        result.put("success", false);
	        result.put("message", "비밀번호가 올바르지 않습니다.");
	        return result;
	    }
    // 예약 처리 중인 자원의 경우 삭제 불가
	    int resvRes = resvService.countReservationsByResourceId(resId); 
    if (resvRes> 0) {
    	result.put("success", false);
    	result.put("reason", "hasReservations");
	        result.put("message", "이 자원에는 진행 중인 예약이 "+resvRes+"건 있습니다. 예약을 먼저 취소하거나 완료한 뒤 다시 시도해주세요.");
	        return result;
    }

    service.deleteResource(resId);
    result.put("success", true);
    return result;
}

//자원코드 중복 체크
@GetMapping("/checkCode")
@ResponseBody
@PreAuthorize("hasRole('ADMIN')")
public Map<String, Object> checkCode(String resCode, Authentication auth){
	CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
	
	ResDto dto = new ResDto();
	dto.setComId(user.getUser().getComId());
	dto.setResCode(resCode);
	
	Map<String, Object> res = new HashMap<>();
	ResDto rdto = service.isDuplicateResCode(dto);
	
	if(rdto != null) res.put("duplicate", true);
	else res.put("duplicate", false);
	
	return res;
}*/