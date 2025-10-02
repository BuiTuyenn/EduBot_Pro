package com.example.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend.dto.LichSuChatDTO;
import com.example.backend.entity.LichSuChat;
import com.example.backend.entity.User;
import com.example.backend.repository.LichSuChatRepository;
import com.example.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LichSuChatService {
    
    private final LichSuChatRepository lichSuChatRepository;
    private final UserRepository userRepository;
    
    public List<LichSuChatDTO> getLichSuChatByUser(Long userId) {
        return lichSuChatRepository.findByUserIdOrderByTimestampDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<LichSuChatDTO> getRecentLichSuChat(Long userId) {
        return lichSuChatRepository.findTop10ByUserIdOrderByTimestampDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public LichSuChatDTO saveLichSuChat(Long userId, String cauHoi, String cauTraLoi) {
        return saveLichSuChat(userId, cauHoi, cauTraLoi, null);
    }
    
    public LichSuChatDTO saveLichSuChat(Long userId, String cauHoi, String cauTraLoi, String sessionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        LichSuChat lichSuChat = new LichSuChat();
        lichSuChat.setUser(user);
        lichSuChat.setSessionId(sessionId);
        lichSuChat.setCauHoi(cauHoi);
        lichSuChat.setCauTraLoi(cauTraLoi);
        
        LichSuChat saved = lichSuChatRepository.save(lichSuChat);
        return convertToDTO(saved);
    }
    
    public void deleteLichSuChat(Long id) {
        if (!lichSuChatRepository.existsById(id)) {
            throw new RuntimeException("LichSuChat not found with id: " + id);
        }
        lichSuChatRepository.deleteById(id);
    }
    
    private LichSuChatDTO convertToDTO(LichSuChat lichSuChat) {
        return new LichSuChatDTO(
                lichSuChat.getId(),
                lichSuChat.getUser().getId(),
                lichSuChat.getSessionId(),
                lichSuChat.getCauHoi(),
                lichSuChat.getCauTraLoi(),
                lichSuChat.getTimestamp()
        );
    }
}

