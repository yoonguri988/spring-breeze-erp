package com.sb.erp.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ApiOepnAi {
  @Value("${openai.api.key}") private String apiKey;
}
