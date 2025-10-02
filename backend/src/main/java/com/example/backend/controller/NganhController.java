package com.example.backend.controller;

import com.example.backend.dto.NganhDTO;
import com.example.backend.service.NganhService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nganh")
@RequiredArgsConstructor
public class NganhController {
    
    private final NganhService nganhService;
    
    @GetMapping
    public ResponseEntity<List<NganhDTO>> getAllNganh() {
        return ResponseEntity.ok(nganhService.getAllNganh());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<NganhDTO> getNganhById(@PathVariable Long id) {
        return ResponseEntity.ok(nganhService.getNganhById(id));
    }
    
    @GetMapping("/ma-nganh/{maNganh}")
    public ResponseEntity<NganhDTO> getNganhByMaNganh(@PathVariable String maNganh) {
        return ResponseEntity.ok(nganhService.getNganhByMaNganh(maNganh));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<NganhDTO>> searchNganh(@RequestParam String name) {
        return ResponseEntity.ok(nganhService.searchNganhByName(name));
    }
    
    @PostMapping
    public ResponseEntity<NganhDTO> createNganh(@RequestBody NganhDTO dto) {
        return ResponseEntity.ok(nganhService.createNganh(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<NganhDTO> updateNganh(@PathVariable Long id, @RequestBody NganhDTO dto) {
        return ResponseEntity.ok(nganhService.updateNganh(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNganh(@PathVariable Long id) {
        nganhService.deleteNganh(id);
        return ResponseEntity.noContent().build();
    }
}

