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
	
}
