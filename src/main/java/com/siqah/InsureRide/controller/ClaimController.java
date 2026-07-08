package com.siqah.InsureRide.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import com.siqah.InsureRide.service.ClaimService;
import com.siqah.InsureRide.dto.ClaimRequestDTO;
import com.siqah.InsureRide.dto.ClaimResponseDTO;
import com.siqah.InsureRide.dto.ClaimHistoryResponseDTO;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.siqah.InsureRide.config.HospitalUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

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
        @Valid @RequestBody ClaimRequestDTO request
    ){
      UsernamePasswordAuthenticationToken authentication = 
              (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
      
      if (authentication == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      
      HospitalUserDetails userDetails = (HospitalUserDetails) authentication.getPrincipal();
      Long hospitalId = userDetails.getHospital().getId();
      
      ClaimResponseDTO response = claimService.verifyClaim(hospitalId, request);
      return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ClaimHistoryResponseDTO>> getClaimHistory() {
      UsernamePasswordAuthenticationToken authentication = 
              (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
      
      if (authentication == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }
      
      HospitalUserDetails userDetails = (HospitalUserDetails) authentication.getPrincipal();
      Long hospitalId = userDetails.getHospital().getId();

      List<ClaimHistoryResponseDTO> response = claimService.getClaimHistory(hospitalId);
      return ResponseEntity.ok(response);
    }
}
