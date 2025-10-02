package com.example.backend.repository;

import com.example.backend.entity.LichSuChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuChatRepository extends JpaRepository<LichSuChat, Long> {
    
    List<LichSuChat> findByUserIdOrderByTimestampDesc(Long userId);
    
    List<LichSuChat> findTop10ByUserIdOrderByTimestampDesc(Long userId);
}

