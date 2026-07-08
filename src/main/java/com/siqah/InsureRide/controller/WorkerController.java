package com.siqah.InsureRide.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.siqah.InsureRide.dto.WorkerLoginRequestDTO;
import com.siqah.InsureRide.dto.LoginResponseDTO;
import com.siqah.InsureRide.service.WorkerService;
import com.siqah.InsureRide.dto.WorkerDTO;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // allow react to connect
public class WorkerController {
    private final WorkerService workerService;

    @PostMapping("/register")
    public ResponseEntity<WorkerDTO> registerWorker(@Valid @RequestBody WorkerDTO request) {
        WorkerDTO worker = workerService.registerWorker(request.getName(), request.getPhoneNumber());
        return new ResponseEntity<>(worker, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginWorker(@Valid @RequestBody WorkerLoginRequestDTO request) {
        String token = workerService.login(request.getPhoneNumber(), request.getPin());
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @GetMapping
    public ResponseEntity<List<WorkerDTO>> getAllWorkers(){
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/phone/{phoneNumber}")
    public ResponseEntity<WorkerDTO> getWorkerByphone(@PathVariable String phoneNumber){
        UsernamePasswordAuthenticationToken authentication = 
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String currentUsername = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !currentUsername.equals(phoneNumber)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(workerService.getWorkerByPhone(phoneNumber));
    }

    @PutMapping("/{workerId}/status")
    public ResponseEntity<WorkerDTO> updateStatus(
           @PathVariable Long workerId,
           @RequestBody WorkerDTO request){
        return ResponseEntity.ok(workerService.updateWorkerStatus(workerId, request.getCoverageStatus()));    
    }
    
    @DeleteMapping("/{workerId}")
    public ResponseEntity<Map<String, String>> deleteWorker(@PathVariable Long workerId){
        workerService.deleteWorker(workerId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Worker deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    

}
