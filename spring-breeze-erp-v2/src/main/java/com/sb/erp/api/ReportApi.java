package com.sb.erp.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sb.erp.dto.WeeklyReportDto;
import com.sb.erp.service.ProjectService;

@Service
public class ReportApi {
	
	@Autowired private OpenAiGpt openAiGpt;
	
	private final RestClient restClient;
	private final ObjectMapper objectMapper = new ObjectMapper();
	
	@Value("${google.report.client-id}")private String clientId;
	@Value("${google.report.client-secret}")private String clientSecret;
	@Value("${google.report.refresh-token}")private String refreshToken;
	
	 // 역할별 템플릿 문서 ID (구글 docs에서 미리 만들어둔 문서)
	// https://docs.google.com/document/d/1LtPrMMW0UqF6Dks-Fg_j3t9wJsRgseGp8yMC_XIvHko/edit?tab=t.0 팀장용
	// https://docs.google.com/document/d/1YcvPLTg2601gLI-Ri0t3F3eOd34XqY-sQOU78UvDoQM/edit?tab=t.0 사원용
    private static final String TEMPLATE_MANAGER_DOC_ID = "1LtPrMMW0UqF6Dks-Fg_j3t9wJsRgseGp8yMC_XIvHko";
    private static final String TEMPLATE_DEVELOPER_DOC_ID = "1YcvPLTg2601gLI-Ri0t3F3eOd34XqY-sQOU78UvDoQM";
	
	public ReportApi(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }
	
    public String getNewAccessToken() {
        try {
            // 🔍 디버깅용: 실제 값 확인 (끝나면 지우세요)
            System.out.println("=== DEBUG ===");
            System.out.println("clientId: [" + clientId + "]");
            System.out.println("clientSecret: [" + clientSecret.substring(0, 10) + "...]");
            System.out.println("refreshToken: [" + refreshToken.substring(0, 15) + "...]");
            System.out.println("refreshToken length: " + refreshToken.length());
            System.out.println("=============");
            
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", clientId);
            formData.add("client_secret", clientSecret);
            formData.add("refresh_token", refreshToken);
            formData.add("grant_type", "refresh_token");

            String response = restClient.post()
                    .uri("https://oauth2.googleapis.com/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(formData)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            return root.path("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Google Access Token 갱신 실패: " + e.getMessage(), e);
        }
    }
    public byte[] createWeeklyReport(WeeklyReportDto dto,String reportRole) { 
        try {
        	String accessToken = getNewAccessToken().trim();
        	//정량 데이터 조회
        //	WeeklyReportDto dto = service.weeklyReport(proId);
        	//Ai에게 정량 데이터 주입 -> 4개 섹션
        	ReportSections sections = openAiGpt.weeklyReportSections(dto, reportRole);
        	//역할에 맞는 탬플릿
        	String templateId ="MANAGER".equalsIgnoreCase(reportRole)?TEMPLATE_MANAGER_DOC_ID : TEMPLATE_DEVELOPER_DOC_ID;
        	
        	String newDocTitle=dto.getProjectName()+"주간보고서_"+dto.getEndDate();
        	String newDocId =copyTemplate(accessToken, templateId, newDocTitle);
            
        	//placeholder 치환
            Map<String, Object> values=new HashMap<>();
            //공통 주간보고서용
            values.put("{{projectName}}", dto.getProjectName());
            values.put("{{endDate}}", String.valueOf(dto.getEndDate()));
            values.put("{{totalTask}}", String.valueOf(dto.getTotalTask()));
            values.put("{{completedThisWeek}}", String.valueOf(dto.getCompletedThisWeek()));
            values.put("{{delayTaskCount}}", String.valueOf(dto.getDelayTaskCount()));
            values.put("{{progressRate}}", dto.getProgressRate() + "%");
            values.put("{{avgTaskDays}}", dto.getAvgTaskDays() + "일");
            values.put("{{avgDelayDays}}", dto.getAvgDelayDays() + "일");
            values.put("{{remainDays}}", String.valueOf(dto.getRemainDays()));
            
            values.put("{{summary}}",sections.summary());
            values.put("{{risks}}",sections.risks());
            values.put("{{priorities}}",sections.priorities());
            
            //팀장
            values.put("{{recommendation}}",sections.recommendation());
            //개발자
            values.put("{{techIssues}}",sections.techIssues());
            
            replacePlaceholders(accessToken, newDocId, values);
            
            //pdf
            byte[]pdfBytes=exportAsPdf(accessToken,newDocId);
            
            return pdfBytes;
        }catch(Exception e) {throw new RuntimeException("주간보고서 생성 중 에러:"+e.getMessage(),e);}
        }
    //템플릿 문서 복사
    private String copyTemplate(String accessToken, String templateId, String newTitle) {
        Map<String, Object> body = Map.of("name", newTitle);
        
            String response = restClient.post()
                    .uri("https://www.googleapis.com/drive/v3/files/{fileId}/copy", templateId)
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);
            try {
            	return objectMapper.readTree(response).path("id").asText();
            }catch(Exception e) {throw new RuntimeException("템플릿 복사 실패:"+e.getMessage(),e);}
    }
    // 사본 문서 안의 {{...}} placeholder들을 실제 값으로 치환
    private void replacePlaceholders(String accessToken, String documentId, Map<String,Object> values) {
        List<Map<String, Object>> requests = values.entrySet().stream()
        									 .map(entry->Map.<String,Object>of(
        									 "replaceAllText",Map.of(
        									 "containsText",Map.of("text",entry.getKey(),"matchCase",true),
        									 "replaceText",entry.getValue())))
        									 .toList();
        Map<String,Object>body=Map.of("requests",requests);
        
        restClient.post()
        .uri("https://docs.googleapis.com/v1/documents/{documentId}:batchUpdate", documentId)
        .header("Authorization", "Bearer " + accessToken)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body)
        .retrieve()
        .toBodilessEntity();
    }
    //완성된 문서를 pdf 바이트로 변환
    private byte[]exportAsPdf(String accessToken,String fileId){
    	return restClient.get()
    		       .uri("https://www.googleapis.com/drive/v3/files/{fileId}/export?mimeType=application/pdf", fileId)
                   .header("Authorization", "Bearer " + accessToken)
                   .retrieve()
                   .body(byte[].class);
    }
    public record ReportSections(String summary, String risks, String priorities, String recommendation,String techIssues) {}
    
}
