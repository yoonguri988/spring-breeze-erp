package com.sb.erp.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sb.erp.dto.ProjectAnalysisDto;

@Service
public class OpenAiGpt {
	
	@Value("${openai.api.key}")private String apikey;
	@Value("${kjy.openai.api.key}") private String kjyapikey;
	
	private static final String API_URL="https://api.openai.com/v1/chat/completions";
	private final ObjectMapper objectMapper = new ObjectMapper();
	private final RestClient restClient;
	 
	public OpenAiGpt(RestClient.Builder restClientBuilder) {
		this.restClient = restClientBuilder.baseUrl(API_URL).build();
	}
	
	public String analyzeProject(ProjectAnalysisDto dto) {
		String prompt=String.format("""
									당신은 10년 이상의 경력을 가진 IT 프로젝트 관리자(PM)입니다
									아래 프로젝트 정보를 분석하여 프로젝트의 위험도를 판단해주세요.
									프로젝트명:%s
									진행률:%d%%
									전체태스크:%d
									TODO:%d
									DOING:%d
									DONE:%d
									지연태스크:%d
									남은기간:%d일
									다음 형식으로만 답변하세요.
									프로젝트명:
									위험도:
									(HIGH/MEDIUM,LOW중 하나)
									리스크 분석:
									권장 조치:
									다른 설명은 하지 마세요.
									""",
				 dto.getProjectName(),dto.getProgressRate(),dto.getTotalTask(),dto.getTodoCount()
				,dto.getDoingCount(),dto.getDoneCount(),dto.getDelayCount(),dto.getRemainDays());
				Map<String,Object> body=Map.of("model","gpt-4o-mini",
											   "messages",List.of(
										Map.of("role","user","content",prompt)));
	try {
		String responseBody = restClient.post()
							  .contentType(MediaType.APPLICATION_JSON)
							  .header("Authorization", "Bearer "+apikey)
							  .body(body)
							  .retrieve()
							  .body(String.class);
		JsonNode root = objectMapper.readTree(responseBody);
		return root.path("choices").get(0).path("message").path("content").asText();
		}catch(Exception e) {throw new RuntimeException("openAi호출 실패");}
	
	}
	
	// KJY
	public String formSchema(String userPrompt) {
		
		
		String systemPrompt = """
			당신은 사내 전자결재 시스템의 양식 설계 도우미입니다.
			사용자가 원하는 결재 양식을 설명하면, 필요한 입력 필드들을 설계해주세요.
			
			각 필드는 다음 구조를 따릅니다:
			{
				"key": "필드의 영문 식별자 (snake_case)",
				"label": "필드의 한글 라벨",
				"type": "text, textarea, data, number, select 중 하나",
				"required": true 또는 false,
				"options": ["select 타입일 때만 존재하는 선택지 배열"]
			}
			
			반드시 아래 형식의 JSON 객체만 응답하세요. 다른 설명은 절대 하지 마세요.
			{
				"title": "양식 제목 추천",
				"fields": [...]
			}		
			""";
		
		Map<String, Object> body = Map.of(
				"model", "gpt-4o-mini",
				"messages", List.of(
					Map.of("role", "system", "content", systemPrompt),
					Map.of("role", "user", "content", userPrompt)
				),
				"response_format", Map.of("type", "json_object")
		);
		
		try {
			String responseBody = restClient.post()
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", "Bearer " + kjyapikey)
					.body(body)
					.retrieve()
					.body(String.class);
			JsonNode root = objectMapper.readTree(responseBody);
			return root.path("choices").get(0).path("message").path("content").asText();
		} catch (Exception e) {
			throw new RuntimeException("openAi 양식 생성 실패", e);
		}
		
	}
	
}
