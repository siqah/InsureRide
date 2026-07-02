package com.siqah.InsureRide.service;

import org.springframework.stereotype.Service;
import com.siqah.InsureRide.repository.WorkerRepository;

import jakarta.transaction.Transactional;

import com.siqah.InsureRide.dto.ClaimResponseDTO;
import com.siqah.InsureRide.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClaimService {
    
    private final WorkerRepository workerRepository;
    private final ClaimRepository claimRepository;

    @Transactional
    public ClaimResponseDTO verifyClaim
}
