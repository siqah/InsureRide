package com.siqah.InsureRide.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.siqah.InsureRide.dto.HospitalResponseDTO;
import com.siqah.InsureRide.service.HospitalService;
import com.siqah.InsureRide.entity.Hospital;
import com.siqah.InsureRide.dto.HospitalRegistrationDTO;
import com.siqah.InsureRide.dto.LoginRequestDTO;
import com.siqah.InsureRide.dto.LoginResponseDTO;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.siqah.InsureRide.config.HospitalUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class HospitalController {

    private final HospitalService hospitalService;

    @PostMapping("/register")
    public ResponseEntity<HospitalResponseDTO> registerHospital(
             @RequestBody HospitalRegistrationDTO request){
        HospitalResponseDTO response = hospitalService.registerHospital(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        String token = hospitalService.login(request.getApiKey());
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
    
    @GetMapping("/me")
    public ResponseEntity<HospitalResponseDTO> getHospitalDetails() {
        UsernamePasswordAuthenticationToken authentication = 
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        HospitalUserDetails userDetails = (HospitalUserDetails) authentication.getPrincipal();
        Hospital hospital = userDetails.getHospital();
        
        HospitalResponseDTO response = hospitalService.getHospitalDetailsById(hospital.getId());
        return ResponseEntity.ok(response);
    }

}
