package com.example.backend.repository;

import com.example.backend.entity.Truong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TruongRepository extends JpaRepository<Truong, Long> {
    
    List<Truong> findByTenContainingIgnoreCase(String ten);
    
    List<Truong> findByKhuVuc(String khuVuc);
    
    Optional<Truong> findByWebsite(String website);
}

