package com.example.backend.controller;

import com.example.backend.dto.LichSuChatDTO;
import com.example.backend.service.LichSuChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lich-su-chat")
@RequiredArgsConstructor
public class LichSuChatController {
    
    private final LichSuChatService lichSuChatService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LichSuChatDTO>> getLichSuChatByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(lichSuChatService.getLichSuChatByUser(userId));
    }
    
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<LichSuChatDTO>> getRecentLichSuChat(@PathVariable Long userId) {
        return ResponseEntity.ok(lichSuChatService.getRecentLichSuChat(userId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLichSuChat(@PathVariable Long id) {
        lichSuChatService.deleteLichSuChat(id);
        return ResponseEntity.noContent().build();
    }
}

