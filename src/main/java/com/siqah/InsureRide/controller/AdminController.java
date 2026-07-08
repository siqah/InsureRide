package com.siqah.InsureRide.controller;

import com.siqah.InsureRide.dto.AdminLoginRequestDTO;
import com.siqah.InsureRide.dto.LoginResponseDTO;
import com.siqah.InsureRide.dto.WorkerDTO;
import com.siqah.InsureRide.entity.Claim;
import com.siqah.InsureRide.entity.CoverageStatus;
import com.siqah.InsureRide.entity.Payment;
import com.siqah.InsureRide.repository.ClaimRepository;
import com.siqah.InsureRide.repository.PaymentRepository;
import com.siqah.InsureRide.service.WorkerService;
import com.siqah.InsureRide.config.JwtService;
import com.siqah.InsureRide.config.AdminUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final WorkerService workerService;
    private final ClaimRepository claimRepository;
    private final PaymentRepository paymentRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginAdmin(@Valid @RequestBody AdminLoginRequestDTO request) {
        if (!"admin".equals(request.getUsername())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Hashed password for "admin123" is "$2a$10$rN2h5sM7NphJzCmsmP/h9OhFep3T6GgN4d7V181.n1Vp9g0b1Z0yK"
        if (!passwordEncoder.matches(request.getPassword(), "$2a$10$rN2h5sM7NphJzCmsmP/h9OhFep3T6GgN4d7V181.n1Vp9g0b1Z0yK")) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = jwtService.generateToken(new AdminUserDetails());
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @GetMapping("/workers")
    public ResponseEntity<List<WorkerDTO>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @PutMapping("/workers/{id}/status")
    public ResponseEntity<WorkerDTO> updateWorkerStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        CoverageStatus status = CoverageStatus.valueOf(statusStr.toUpperCase());
        
        WorkerDTO worker = workerService.updateWorkerStatus(id, status);
        System.out.printf("📱 [SMS SIMULATOR ALERT] SMS sent to %s (%s): Your coverage status has been manually changed to %s by Admin.%n",
                worker.getName(), worker.getPhoneNumber(), status);
                
        return ResponseEntity.ok(worker);
    }

    @GetMapping("/claims")
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimRepository.findAll());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }
}
