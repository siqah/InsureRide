package com.siqah.InsureRide.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;

import com.siqah.InsureRide.service.ClaimService;
import com.siqah.InsureRide.dto.ClaimRequestDTO;
import com.siqah.InsureRide.dto.ClaimResponseDTO;

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
      Long hospitalId = 1L; //Temporary

      ClaimResponseDTO response = claimService.verifyClaim(hospitalId, request);
      return ResponseEntity.ok(response);
    }

    
    
    

}
