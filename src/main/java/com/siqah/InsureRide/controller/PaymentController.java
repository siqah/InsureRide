package com.siqah.InsureRide.controller;

import org.springframework.web.bind.annotation.RestController;

import com.siqah.InsureRide.service.PaymentService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import com.siqah.InsureRide.dto.PaymentRequestDTO;
import com.siqah.InsureRide.dto.PaymentResponseDTO;
import com.siqah.InsureRide.entity.Payment;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    //the 20 kes payment endpoint
    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDTO> processPayment(
            @Valid @RequestBody PaymentRequestDTO request){
                PaymentResponseDTO response = paymentService.processPayment(request);
                return ResponseEntity.ok(response);

            }

    @GetMapping("/worker/{phoneNumber}")
    public ResponseEntity<List<Payment>> getWorkerPayments(
           @PathVariable String phoneNumber
      ){
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication = 
                (org.springframework.security.authentication.UsernamePasswordAuthenticationToken) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }

        String currentUsername = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !currentUsername.equals(phoneNumber)) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(paymentService.getWorkerPayments(phoneNumber));
       }
    

}
