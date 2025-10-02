package com.example.backend.repository;

import com.example.backend.entity.Nganh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NganhRepository extends JpaRepository<Nganh, Long> {
    
    Optional<Nganh> findByMaNganh(String maNganh);
    
    List<Nganh> findByTenContainingIgnoreCase(String ten);
    
    List<Nganh> findByKhoiXetTuyenContaining(String khoiXetTuyen);
}

