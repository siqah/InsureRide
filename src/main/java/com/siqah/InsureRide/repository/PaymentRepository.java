package com.siqah.InsureRide.repository;
import  com.siqah.InsureRide.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByWorkerIdOrderByPaymentDateDesc(Long workerId);

}
