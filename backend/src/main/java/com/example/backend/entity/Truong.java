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
@Table(name = "truong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Truong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String ten;
    
    @Column(name = "khu_vuc", length = 100)
    private String khuVuc;
    
    private String website;
    
    @Column(columnDefinition = "TEXT")
    private String moTa;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "truong", cascade = CascadeType.ALL)
    private List<DiemChuan> diemChuanList;
}

