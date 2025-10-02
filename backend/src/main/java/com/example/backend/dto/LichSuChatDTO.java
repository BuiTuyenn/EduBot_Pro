package com.example.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LichSuChatDTO {
    private Long id;
    private Long idUser;
    private String sessionId;
    private String cauHoi;
    private String cauTraLoi;
    private LocalDateTime timestamp;
}

