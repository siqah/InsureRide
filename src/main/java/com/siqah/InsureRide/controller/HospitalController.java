package com.siqah.InsureRide.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.siqah.InsureRide.dto.HospitalResponseDTO;
import com.siqah.InsureRide.service.HospitalService;
import com.siqah.InsureRide.dto.HospitalRegistrationDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
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
    

}
