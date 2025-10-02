package com.example.backend.repository;

import com.example.backend.entity.DiemChuan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiemChuanRepository extends JpaRepository<DiemChuan, Long> {
    
    List<DiemChuan> findByTruongId(Long truongId);
    
    List<DiemChuan> findByNganhId(Long nganhId);
    
    List<DiemChuan> findByNam(Integer nam);
    
    Optional<DiemChuan> findByTruongIdAndNganhIdAndNam(Long truongId, Long nganhId, Integer nam);
    
    @Query("SELECT dc FROM DiemChuan dc WHERE dc.truong.id = :truongId AND dc.nam = :nam")
    List<DiemChuan> findByTruongAndNam(@Param("truongId") Long truongId, @Param("nam") Integer nam);
    
    @Query("SELECT dc FROM DiemChuan dc WHERE dc.nganh.id = :nganhId AND dc.nam = :nam")
    List<DiemChuan> findByNganhAndNam(@Param("nganhId") Long nganhId, @Param("nam") Integer nam);
}

