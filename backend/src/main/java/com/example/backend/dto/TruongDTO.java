package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TruongDTO {
    private Long id;
    private String ten;
    private String khuVuc;
    private String website;
    private String moTa;
}

