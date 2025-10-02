package com.example.backend.controller;

import com.example.backend.dto.TruongDTO;
import com.example.backend.service.TruongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/truong")
@RequiredArgsConstructor
public class TruongController {
    
    private final TruongService truongService;
    
    @GetMapping
    public ResponseEntity<List<TruongDTO>> getAllTruong() {
        return ResponseEntity.ok(truongService.getAllTruong());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TruongDTO> getTruongById(@PathVariable Long id) {
        return ResponseEntity.ok(truongService.getTruongById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<TruongDTO>> searchTruong(@RequestParam String name) {
        return ResponseEntity.ok(truongService.searchTruongByName(name));
    }
    
    @GetMapping("/khu-vuc/{khuVuc}")
    public ResponseEntity<List<TruongDTO>> getTruongByKhuVuc(@PathVariable String khuVuc) {
        return ResponseEntity.ok(truongService.getTruongByKhuVuc(khuVuc));
    }
    
    @PostMapping
    public ResponseEntity<TruongDTO> createTruong(@RequestBody TruongDTO dto) {
        return ResponseEntity.ok(truongService.createTruong(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TruongDTO> updateTruong(@PathVariable Long id, @RequestBody TruongDTO dto) {
        return ResponseEntity.ok(truongService.updateTruong(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTruong(@PathVariable Long id) {
        truongService.deleteTruong(id);
        return ResponseEntity.noContent().build();
    }
}

