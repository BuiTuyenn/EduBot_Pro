package com.example.backend.service;

import com.example.backend.dto.DiemChuanDTO;
import com.example.backend.entity.DiemChuan;
import com.example.backend.entity.Nganh;
import com.example.backend.entity.Truong;
import com.example.backend.repository.DiemChuanRepository;
import com.example.backend.repository.NganhRepository;
import com.example.backend.repository.TruongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiemChuanService {
    
    private final DiemChuanRepository diemChuanRepository;
    private final TruongRepository truongRepository;
    private final NganhRepository nganhRepository;
    
    public List<DiemChuanDTO> getAllDiemChuan() {
        return diemChuanRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public DiemChuanDTO getDiemChuanById(Long id) {
        DiemChuan diemChuan = diemChuanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DiemChuan not found with id: " + id));
        return convertToDTO(diemChuan);
    }
    
    public List<DiemChuanDTO> getDiemChuanByTruong(Long truongId) {
        return diemChuanRepository.findByTruongId(truongId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<DiemChuanDTO> getDiemChuanByNganh(Long nganhId) {
        return diemChuanRepository.findByNganhId(nganhId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<DiemChuanDTO> getDiemChuanByNam(Integer nam) {
        return diemChuanRepository.findByNam(nam).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public DiemChuanDTO getDiemChuanByTruongNganhNam(Long truongId, Long nganhId, Integer nam) {
        DiemChuan diemChuan = diemChuanRepository.findByTruongIdAndNganhIdAndNam(truongId, nganhId, nam)
                .orElseThrow(() -> new RuntimeException("DiemChuan not found"));
        return convertToDTO(diemChuan);
    }
    
    public DiemChuanDTO createDiemChuan(DiemChuanDTO dto) {
        Truong truong = truongRepository.findById(dto.getIdTruong())
                .orElseThrow(() -> new RuntimeException("Truong not found with id: " + dto.getIdTruong()));
        
        Nganh nganh = nganhRepository.findById(dto.getIdNganh())
                .orElseThrow(() -> new RuntimeException("Nganh not found with id: " + dto.getIdNganh()));
        
        DiemChuan diemChuan = new DiemChuan();
        diemChuan.setTruong(truong);
        diemChuan.setNganh(nganh);
        diemChuan.setNam(dto.getNam());
        diemChuan.setDiem(dto.getDiem());
        
        DiemChuan saved = diemChuanRepository.save(diemChuan);
        return convertToDTO(saved);
    }
    
    public DiemChuanDTO updateDiemChuan(Long id, DiemChuanDTO dto) {
        DiemChuan diemChuan = diemChuanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DiemChuan not found with id: " + id));
        
        Truong truong = truongRepository.findById(dto.getIdTruong())
                .orElseThrow(() -> new RuntimeException("Truong not found with id: " + dto.getIdTruong()));
        
        Nganh nganh = nganhRepository.findById(dto.getIdNganh())
                .orElseThrow(() -> new RuntimeException("Nganh not found with id: " + dto.getIdNganh()));
        
        diemChuan.setTruong(truong);
        diemChuan.setNganh(nganh);
        diemChuan.setNam(dto.getNam());
        diemChuan.setDiem(dto.getDiem());
        
        DiemChuan updated = diemChuanRepository.save(diemChuan);
        return convertToDTO(updated);
    }
    
    public void deleteDiemChuan(Long id) {
        if (!diemChuanRepository.existsById(id)) {
            throw new RuntimeException("DiemChuan not found with id: " + id);
        }
        diemChuanRepository.deleteById(id);
    }
    
    private DiemChuanDTO convertToDTO(DiemChuan diemChuan) {
        return new DiemChuanDTO(
                diemChuan.getId(),
                diemChuan.getTruong().getId(),
                diemChuan.getTruong().getTen(),
                diemChuan.getNganh().getId(),
                diemChuan.getNganh().getTen(),
                diemChuan.getNam(),
                diemChuan.getDiem()
        );
    }
}

