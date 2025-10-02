package com.example.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.backend.dto.ChatRequest;
import com.example.backend.dto.ChatResponse;
import com.example.backend.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatbotService {
    
    private final LichSuChatService lichSuChatService;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${chatbot.api.url:http://localhost:5000/api/chat}")
    private String chatbotApiUrl;
    
    public ChatResponse chat(ChatRequest request) {
        // Get current authenticated user
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        try {
            // Call Flask Chatbot API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("question", request.getQuestion());
            requestBody.put("user_id", user.getId().toString());
            
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(
                    chatbotApiUrl,
                    entity,
                    (Class<Map<String, Object>>)(Class<?>)Map.class
            );
            
            Map<String, Object> responseBody = response.getBody();
            String answer = responseBody != null ? (String) responseBody.get("answer") : "Không nhận được phản hồi từ chatbot.";
            
            // Save to chat history with sessionId
            var savedChat = lichSuChatService.saveLichSuChat(
                    user.getId(),
                    request.getQuestion(),
                    answer,
                    request.getSessionId()
            );
            
            return new ChatResponse(answer, savedChat.getId());
            
        } catch (Exception e) {
            // Fallback response if chatbot service is unavailable
            String fallbackAnswer = "Xin lỗi, hệ thống chatbot tạm thời không khả dụng. Vui lòng thử lại sau.";
            
            var savedChat = lichSuChatService.saveLichSuChat(
                    user.getId(),
                    request.getQuestion(),
                    fallbackAnswer,
                    request.getSessionId()
            );
            
            return new ChatResponse(fallbackAnswer, savedChat.getId());
        }
    }
}

