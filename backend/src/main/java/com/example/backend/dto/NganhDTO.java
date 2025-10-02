package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NganhDTO {
    private Long id;
    private String ten;
    private String maNganh;
    private String khoiXetTuyen;
}

