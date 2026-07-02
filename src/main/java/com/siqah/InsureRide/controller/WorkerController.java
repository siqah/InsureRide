package com.siqah.InsureRide.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;


import com.siqah.InsureRide.service.WorkerService;
import com.siqah.InsureRide.entity.CoverageStatus;
import com.siqah.InsureRide.dto.WorkerDTO;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // allow react to connect
public class WorkerController {
    private final WorkerService workerService;

    @PostMapping("/register")
    public ResponseEntity<WorkerDTO> registerWorker(
           @RequestParam String name,
           @RequestParam String phoneNumber) {
        WorkerDTO worker = workerService.registerWorker(name, phoneNumber);
        return new ResponseEntity<>(worker, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<WorkerDTO>> getAllWorkers(){
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<WorkerDTO> getWorkerByphone(@PathVariable String phoneNumber){
        return ResponseEntity.ok(workerService.getWorkerByPhone(phoneNumber));
    }

    @PutMapping("/{workerId}/status")
    public ResponseEntity<WorkerDTO> updateStatus(
           @PathVariable Long workerId,
           @RequestParam CoverageStatus newStatus){
        return ResponseEntity.ok(workerService.updateWorkerStatus(workerId, newStatus));    
    }
    
    @DeleteMapping("/{workerId}")
    public ResponseEntity<Void> deleteWorker(@PathVariable Long workerId){
        workerService.deleteWorker(workerId);
        return ResponseEntity.noContent().build();
    }
    
    

}
