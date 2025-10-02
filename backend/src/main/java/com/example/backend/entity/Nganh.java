package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "nganh")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Nganh {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String ten;
    
    @Column(name = "ma_nganh", nullable = false, unique = true, length = 50)
    private String maNganh;
    
    @Column(name = "khoi_xet_tuyen", length = 100)
    private String khoiXetTuyen;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "nganh", cascade = CascadeType.ALL)
    private List<DiemChuan> diemChuanList;
}

