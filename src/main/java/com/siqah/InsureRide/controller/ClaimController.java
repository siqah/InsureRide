package com.siqah.InsureRide.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;

import com.siqah.InsureRide.service.ClaimService;
import com.siqah.InsureRide.dto.ClaimRequestDTO;
import com.siqah.InsureRide.dto.ClaimResponseDTO;
import com.siqah.InsureRide.dto.ClaimHistoryResponseDTO;

import java.util.List;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class ClaimController {
    private final ClaimService claimService;

    @PostMapping("/verify")
    public ResponseEntity<ClaimResponseDTO> verifyClaim(
        @RequestBody ClaimRequestDTO request,
        @RequestHeader("X-API-KEY") String apiKey //Hospital sends Api key here
    ){
      ClaimResponseDTO response = claimService.verifyClaim(apiKey, request);
      return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ClaimHistoryResponseDTO>> getClaimHistory(
        @RequestHeader("X-API-KEY") String apiKey
    ) {
      List<ClaimHistoryResponseDTO> response = claimService.getClaimHistory(apiKey);
      return ResponseEntity.ok(response);
    }
}
