package com.sb.erp.notice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sb.erp.notice.dto.request.NoticeRequest;
import com.sb.erp.notice.dto.request.NoticeSearchRequest;
import com.sb.erp.notice.dto.response.NoticeResponse;
import com.sb.erp.notice.service.NoticeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name="Notice Api", description = "Notice 관련 Api")
@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class NoticeController {
    
	private final NoticeService noticeService;  
    
    // 공지 목록 조회
    @Operation(summary = "공지 목록 조회",description = "긴급 공지+검색 조건에 맞는 공지 목록 조회")
    @GetMapping
    public ResponseEntity<Map<String,Object>>getNotices(@ModelAttribute NoticeSearchRequest search) {
    	
    	List<NoticeResponse> notices = noticeService.getNoticeListWithUrgent(search); // 긴급5 + 일반목록
        int totalCnt = noticeService.selectCount(search);              // 전체 건수 (뱃지용)

        Map<String, Object> result = new HashMap<>();
        result.put("notices", notices);
        result.put("totalCnt", totalCnt);
        return ResponseEntity.ok(result);
    }
    

    // 공지 등록
    @Operation(summary = "공지 등록",description = "신규 공지 등록")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
    @PostMapping(consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String,Object>> createNotice(
    		 @Parameter(description = "공지 등록 정보") @Valid @ParameterObject @ModelAttribute NoticeRequest dto,
    	     @Parameter(description = "첨부파일") @RequestParam(value = "file", required = false) MultipartFile file){
    	Map<String, Object> result = new HashMap<>();
    	
        try {
            noticeService.insert(dto, file);
            result.put("success", true);
            result.put("message", "공지 등록 성공");
            result.put("bno", dto.getBno());
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "공지 등록 실패");
            return ResponseEntity.badRequest().body(result);
        }

    }
    
    // 공지 수정 
    @Operation(summary = "공지 수정",description = "공지 수정")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
    @PutMapping(value = "/{bno}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateNotice(
            @ModelAttribute NoticeRequest dto,
            @PathVariable("bno") Long bno,
            @RequestPart(name = "file", required = false) MultipartFile file) {
   
    	dto.setBno(bno);
		Map<String, Object> result = new HashMap<>();
		
		try {
			noticeService.update(dto, file);
			result.put("success", true);
			result.put("message", "공지 수정 성공");
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			result.put("success", false);
			result.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(result);
		}
    }

    //공지 삭제
    @Operation(summary = "공지 삭제", description = "공지를 삭제합니다.")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROOT')")
	@DeleteMapping("/{bno}")
    public ResponseEntity<Map<String, Object>> deleteNotice(@PathVariable("bno") Long bno) {
		noticeService.delete(bno);
		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("message", "공지 삭제 성공");
		return ResponseEntity.ok(result);
    }

    //공지 상세 조회
	@Operation(summary = "공지 상세조회", description = "공지 상세 정보를 조회합니다. (조회수 1 증가)")
	@GetMapping("/{bno}")
	public ResponseEntity<NoticeResponse> getNotice(@PathVariable("bno") Long bno) {
		noticeService.updateHit(bno);
		NoticeResponse dto = noticeService.select(bno);
		if (dto == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(dto);
	}

    // 검색 결과 카운트
	@Operation(summary = "공지 검색 결과 카운트", description = "검색 조건에 맞는 공지 건수만 조회합니다.")
	@GetMapping("/search-count")
	public ResponseEntity<Long> getSearchCount(NoticeSearchRequest search) {
		return ResponseEntity.ok(noticeService.selectCountNoticeList(search));
	}
}