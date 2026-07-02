package com.siqah.InsureRide.service;

import com.siqah.InsureRide.dto.PaymentRequestDTO;
import com.siqah.InsureRide.dto.PaymentResponseDTO;
import com.siqah.InsureRide.repository.PaymentRepository;
import com.siqah.InsureRide.repository.WorkerRepository;
import com.siqah.InsureRide.entity.CoverageStatus;
import com.siqah.InsureRide.entity.Worker; 
import com.siqah.InsureRide.entity.Payment;

import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final WorkerRepository workerRepository;

    //The 20 kes payment logic
    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO request){
        //1. validate the amount is exactly 20 KES
        if(request.getAmount().compareTo(new BigDecimal("20.00")) !=0){
            throw new RuntimeException("Amount must be exactly 20.00 KES");
        }

        //2. find the worker
        Worker worker = workerRepository.findByPhoneNumber(request.getPhoneNumber())
               .orElseThrow(() -> new RuntimeException("Worker not found"));

        //3calculate new expire date
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime newExpiry;

        if(worker.getCoverageStatus() == CoverageStatus.SUSPENDED || worker.getCoverageExpiry() == null){
            //first payment or suspend :start fresh 24h hours from now 
            newExpiry = now.plusHours(24);
        }else if(worker.getCoverageExpiry().isBefore(now)){
            //expired but still marked as active fix and restart
            newExpiry = now.plusHours(24);
        }else{
            newExpiry = worker.getCoverageExpiry().plusHours(24);
        }

        //4 update the worker
        worker.setCoverageStatus(CoverageStatus.ACTIVE);
        worker.setCoverageExpiry(newExpiry);
        workerRepository.save(worker);

        //5 record the payment transactions 
        Payment payment = new Payment();
        payment.setWorkerId(worker.getId());
        payment.setAmount(request.getAmount());
        payment.setTransactionReference(request.getTransactionReference());
        paymentRepository.save(payment);

        // 6 build response 
        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setWorkerName(worker.getName());
        response.setPhoneNumber(worker.getPhoneNumber());
        response.setAmountPaid(request.getAmount());
        response.setNextExpiryTime(newExpiry);
        response.setMessage(String.format("Coverage extended until %s", newExpiry));

        return response;
    }
   
    

}
