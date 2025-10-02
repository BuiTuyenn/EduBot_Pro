package com.example.backend.service;

import com.example.backend.dto.TruongDTO;
import com.example.backend.entity.Truong;
import com.example.backend.repository.TruongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TruongService {
    
    private final TruongRepository truongRepository;
    
    public List<TruongDTO> getAllTruong() {
        return truongRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TruongDTO getTruongById(Long id) {
        Truong truong = truongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Truong not found with id: " + id));
        return convertToDTO(truong);
    }
    
    public List<TruongDTO> searchTruongByName(String name) {
        return truongRepository.findByTenContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TruongDTO> getTruongByKhuVuc(String khuVuc) {
        return truongRepository.findByKhuVuc(khuVuc).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TruongDTO createTruong(TruongDTO dto) {
        Truong truong = new Truong();
        truong.setTen(dto.getTen());
        truong.setKhuVuc(dto.getKhuVuc());
        truong.setWebsite(dto.getWebsite());
        truong.setMoTa(dto.getMoTa());
        
        Truong saved = truongRepository.save(truong);
        return convertToDTO(saved);
    }
    
    public TruongDTO updateTruong(Long id, TruongDTO dto) {
        Truong truong = truongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Truong not found with id: " + id));
        
        truong.setTen(dto.getTen());
        truong.setKhuVuc(dto.getKhuVuc());
        truong.setWebsite(dto.getWebsite());
        truong.setMoTa(dto.getMoTa());
        
        Truong updated = truongRepository.save(truong);
        return convertToDTO(updated);
    }
    
    public void deleteTruong(Long id) {
        if (!truongRepository.existsById(id)) {
            throw new RuntimeException("Truong not found with id: " + id);
        }
        truongRepository.deleteById(id);
    }
    
    private TruongDTO convertToDTO(Truong truong) {
        return new TruongDTO(
                truong.getId(),
                truong.getTen(),
                truong.getKhuVuc(),
                truong.getWebsite(),
                truong.getMoTa()
        );
    }
}

