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

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClaimService {
    
    private final WorkerRepository workerRepository;
    private final ClaimRepository claimRepository;

    @Transactional
    public ClaimResponseDTO verifyClaim(Long hospitalId, ClaimRequestDTO request) {
        //1 find the worker
        Worker worker = workerRepository.findByPhoneNumber(request.getWorkerPhoneNumber())
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        //2 check coverage
        boolean isCovered = worker.getCoverageStatus() == CoverageStatus.ACTIVE &&
                            worker.getCoverageExpiry().isAfter(LocalDateTime.now());

        //3 create claim record
        Claim claim = new Claim();
        claim.setWorkerId(worker.getId());
        claim.setHospitalId(hospitalId);
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
}
