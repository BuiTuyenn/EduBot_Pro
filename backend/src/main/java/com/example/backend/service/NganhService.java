package com.example.backend.service;

import com.example.backend.dto.NganhDTO;
import com.example.backend.entity.Nganh;
import com.example.backend.repository.NganhRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NganhService {
    
    private final NganhRepository nganhRepository;
    
    public List<NganhDTO> getAllNganh() {
        return nganhRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public NganhDTO getNganhById(Long id) {
        Nganh nganh = nganhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nganh not found with id: " + id));
        return convertToDTO(nganh);
    }
    
    public NganhDTO getNganhByMaNganh(String maNganh) {
        Nganh nganh = nganhRepository.findByMaNganh(maNganh)
                .orElseThrow(() -> new RuntimeException("Nganh not found with ma_nganh: " + maNganh));
        return convertToDTO(nganh);
    }
    
    public List<NganhDTO> searchNganhByName(String name) {
        return nganhRepository.findByTenContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public NganhDTO createNganh(NganhDTO dto) {
        if (nganhRepository.findByMaNganh(dto.getMaNganh()).isPresent()) {
            throw new RuntimeException("Nganh with ma_nganh already exists: " + dto.getMaNganh());
        }
        
        Nganh nganh = new Nganh();
        nganh.setTen(dto.getTen());
        nganh.setMaNganh(dto.getMaNganh());
        nganh.setKhoiXetTuyen(dto.getKhoiXetTuyen());
        
        Nganh saved = nganhRepository.save(nganh);
        return convertToDTO(saved);
    }
    
    public NganhDTO updateNganh(Long id, NganhDTO dto) {
        Nganh nganh = nganhRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nganh not found with id: " + id));
        
        nganh.setTen(dto.getTen());
        nganh.setMaNganh(dto.getMaNganh());
        nganh.setKhoiXetTuyen(dto.getKhoiXetTuyen());
        
        Nganh updated = nganhRepository.save(nganh);
        return convertToDTO(updated);
    }
    
    public void deleteNganh(Long id) {
        if (!nganhRepository.existsById(id)) {
            throw new RuntimeException("Nganh not found with id: " + id);
        }
        nganhRepository.deleteById(id);
    }
    
    private NganhDTO convertToDTO(Nganh nganh) {
        return new NganhDTO(
                nganh.getId(),
                nganh.getTen(),
                nganh.getMaNganh(),
                nganh.getKhoiXetTuyen()
        );
    }
}

