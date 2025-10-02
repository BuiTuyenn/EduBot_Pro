package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diem_chuan", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"id_truong", "id_nganh", "nam"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiemChuan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_truong", nullable = false)
    private Truong truong;
    
    @ManyToOne
    @JoinColumn(name = "id_nganh", nullable = false)
    private Nganh nganh;
    
    @Column(nullable = false)
    private Integer nam;
    
    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal diem;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

