package com.siqah.InsureRide.service;

import org.springframework.stereotype.Service;
import com.siqah.InsureRide.repository.WorkerRepository;

import jakarta.transaction.Transactional;
import com.siqah.InsureRide.dto.ClaimRequestDTO;
import com.siqah.InsureRide.dto.ClaimResponseDTO;
import com.siqah.InsureRide.repository.ClaimRepository;
import com.siqah.InsureRide.entity.Worker;
import com.siqah.InsureRide.entity.CoverageStatus;
import com.siqah.InsureRide.entity.Claim;
import com.siqah.InsureRide.entity.ClaimStatus;

import com.siqah.InsureRide.repository.HospitalRepository;
import com.siqah.InsureRide.entity.Hospital;
import com.siqah.InsureRide.dto.ClaimHistoryResponseDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClaimService {
    
    private final WorkerRepository workerRepository;
    private final ClaimRepository claimRepository;
    private final HospitalRepository hospitalRepository;

    @Transactional
    public ClaimResponseDTO verifyClaim(String apiKey, ClaimRequestDTO request) {
        // Resolve the hospital by its API key
        Hospital hospital = hospitalRepository.findByApikey(apiKey)
                .orElseThrow(() -> new RuntimeException("Invalid API Key"));

        //1 find the worker
        Worker worker = workerRepository.findByPhoneNumber(request.getWorkerPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        //2 check coverage
        boolean isCovered = worker.getCoverageStatus() == CoverageStatus.ACTIVE &&
                            worker.getCoverageExpiry().isAfter(LocalDateTime.now());

        //3 create claim record
        Claim claim = new Claim();
        claim.setWorkerId(worker.getId());
        claim.setHospitalId(hospital.getId());
        claim.setClaimAmount(request.getBillAmount());
        claim.setClaimStatus(isCovered ? ClaimStatus.APPROVED : ClaimStatus.REJECTED);
        if (!isCovered) {
            claim.setRejectionReason("worker suspended or coverage expired");          
        }
        claimRepository.save(claim);

        //4 build and return response
        ClaimResponseDTO response = new ClaimResponseDTO();
        response.setWorkerName(worker.getName());
        response.setWorkerPhone(worker.getPhoneNumber());
        response.setIsCovered(isCovered);
        response.setStatus(isCovered ? "approved" : "denied");
        response.setMessage(isCovered ? "Coverage active - claim approved" : "worker suspended or coverage expired");
        return response;
    }

    public List<ClaimHistoryResponseDTO> getClaimHistory(String apiKey) {
        Hospital hospital = hospitalRepository.findByApikey(apiKey)
                .orElseThrow(() -> new RuntimeException("Invalid API Key"));

        List<Claim> claims = claimRepository.findByHospitalId(hospital.getId());

        return claims.stream().map(claim -> {
            ClaimHistoryResponseDTO dto = new ClaimHistoryResponseDTO();
            dto.setId(claim.getId());
            dto.setAmount(claim.getClaimAmount());
            dto.setStatus(claim.getClaimStatus() == ClaimStatus.APPROVED ? "APPROVED" : "DENIED");
            dto.setDate(claim.getClaimDate());

            workerRepository.findById(claim.getWorkerId()).ifPresent(worker -> {
                dto.setWorkerName(worker.getName());
                dto.setWorkerPhone(worker.getPhoneNumber());
            });

            return dto;
        }).collect(Collectors.toList());
    }
}
