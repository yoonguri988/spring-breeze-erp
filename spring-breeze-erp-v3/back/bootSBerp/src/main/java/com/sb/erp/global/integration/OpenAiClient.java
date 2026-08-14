package com.sb.erp.global.integration;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sb.erp.global.integration.openAi.ChatMessage;
import com.sb.erp.global.integration.openAi.ChatRequest;
import com.sb.erp.global.integration.openAi.ChatResponse;
import com.sb.erp.global.integration.openAi.ReportContent;

@Component
public class OpenAiClient {

    @Value("${jsj.openai.api.model}") private String model;

    private final RestClient openAiRestClient;
    private final ObjectMapper objectMapper;
    
    @Autowired
    public OpenAiClient(
            @Qualifier("openAiRestClient") RestClient openAiRestClient,
            ObjectMapper objectMapper) {
        this.openAiRestClient = openAiRestClient;
        this.objectMapper = objectMapper;
    }

    public ReportContent generateReport(List<ChatMessage> messages) {
        try {
            ChatRequest request = new ChatRequest(
                model,
                messages,
                ChatRequest.ResponseFormat.jsonObject(),
                0.3
            );

            ChatResponse response = openAiRestClient.post()
                .uri("/chat/completions")
                .body(request)
                .retrieve()
                .body(ChatResponse.class);

            String contentJson = (response == null) ? null : response.firstContent();
            if (contentJson == null || contentJson.isBlank()) {
                System.err.println("[OpenAiClient] 응답 content가 비어있음");
                return null;
            }

            return objectMapper.readValue(contentJson, ReportContent.class);

        } catch (Exception e) {
            System.err.println("[OpenAiClient] GPT 호출 실패: " + e.getMessage());
            return null;
        }
    }
}
