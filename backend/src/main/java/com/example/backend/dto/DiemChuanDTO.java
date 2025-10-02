package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiemChuanDTO {
    private Long id;
    private Long idTruong;
    private String tenTruong;
    private Long idNganh;
    private String tenNganh;
    private Integer nam;
    private BigDecimal diem;
}

