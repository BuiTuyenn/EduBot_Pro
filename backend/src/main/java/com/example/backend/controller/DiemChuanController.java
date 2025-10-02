package com.example.backend.controller;

import com.example.backend.dto.DiemChuanDTO;
import com.example.backend.service.DiemChuanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diem-chuan")
@RequiredArgsConstructor
public class DiemChuanController {
    
    private final DiemChuanService diemChuanService;
    
    @GetMapping
    public ResponseEntity<List<DiemChuanDTO>> getAllDiemChuan() {
        return ResponseEntity.ok(diemChuanService.getAllDiemChuan());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DiemChuanDTO> getDiemChuanById(@PathVariable Long id) {
        return ResponseEntity.ok(diemChuanService.getDiemChuanById(id));
    }
    
    @GetMapping("/truong/{truongId}")
    public ResponseEntity<List<DiemChuanDTO>> getDiemChuanByTruong(@PathVariable Long truongId) {
        return ResponseEntity.ok(diemChuanService.getDiemChuanByTruong(truongId));
    }
    
    @GetMapping("/nganh/{nganhId}")
    public ResponseEntity<List<DiemChuanDTO>> getDiemChuanByNganh(@PathVariable Long nganhId) {
        return ResponseEntity.ok(diemChuanService.getDiemChuanByNganh(nganhId));
    }
    
    @GetMapping("/nam/{nam}")
    public ResponseEntity<List<DiemChuanDTO>> getDiemChuanByNam(@PathVariable Integer nam) {
        return ResponseEntity.ok(diemChuanService.getDiemChuanByNam(nam));
    }
    
    @GetMapping("/search")
    public ResponseEntity<DiemChuanDTO> getDiemChuanByTruongNganhNam(
            @RequestParam Long truongId,
            @RequestParam Long nganhId,
            @RequestParam Integer nam
    ) {
        return ResponseEntity.ok(diemChuanService.getDiemChuanByTruongNganhNam(truongId, nganhId, nam));
    }
    
    @PostMapping
    public ResponseEntity<DiemChuanDTO> createDiemChuan(@RequestBody DiemChuanDTO dto) {
        return ResponseEntity.ok(diemChuanService.createDiemChuan(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DiemChuanDTO> updateDiemChuan(@PathVariable Long id, @RequestBody DiemChuanDTO dto) {
        return ResponseEntity.ok(diemChuanService.updateDiemChuan(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiemChuan(@PathVariable Long id) {
        diemChuanService.deleteDiemChuan(id);
        return ResponseEntity.noContent().build();
    }
}

