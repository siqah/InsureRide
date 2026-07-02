package com.siqah.InsureRide.config;

import com.siqah.InsureRide.entity.*;
import com.siqah.InsureRide.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {
    
    private final WorkerRepository workerRepository;
    private final HospitalRepository hospitalRepository;
    private final PaymentRepository paymentRepository;
    private final ClaimRepository claimRepository;
    
    @Override
    public void run(String... args) throws Exception {
        
        // Check if we already have data (avoid duplicates on restart)
        if (workerRepository.count() == 0) {
            
            System.out.println("🌱 Seeding initial data...");
            
            // 1. Create 3 Workers
            Worker worker1 = new Worker();
            worker1.setName("John Kamau");
            worker1.setPhoneNumber("0712345678");
            worker1.setCoverageStatus(CoverageStatus.ACTIVE);
            worker1.setCoverageExpiry(LocalDateTime.now().plusHours(5)); // Expires in 5 hours
            
            Worker worker2 = new Worker();
            worker2.setName("Mary Wanjiru");
            worker2.setPhoneNumber("0723456789");
            worker2.setCoverageStatus(CoverageStatus.SUSPENDED);
            worker2.setCoverageExpiry(null);
            
            Worker worker3 = new Worker();
            worker3.setName("Peter Ochieng");
            worker3.setPhoneNumber("0734567890");
            worker3.setCoverageStatus(CoverageStatus.ACTIVE);
            worker3.setCoverageExpiry(LocalDateTime.now().plusHours(48)); // Expires in 2 days
            
            workerRepository.saveAll(java.util.List.of(worker1, worker2, worker3));
            
            // 2. Create a Hospital
            Hospital hospital = new Hospital();
            hospital.setName("Nairobi General Hospital");
            hospital.setApikey("TEST-API-KEY-12345");
            hospital.setIsActive(true);
            hospitalRepository.save(hospital);
            
            // 3. Create some Payments for John (worker1)
            Payment payment1 = new Payment();
            payment1.setWorkerId(worker1.getId());
            payment1.setAmount(new BigDecimal("20.00"));
            payment1.setTransactionReference("MPESA-ABC123");
            payment1.setPaymentDate(LocalDateTime.now().minusDays(1));
            
            Payment payment2 = new Payment();
            payment2.setWorkerId(worker1.getId());
            payment2.setAmount(new BigDecimal("20.00"));
            payment2.setTransactionReference("MPESA-DEF456");
            payment2.setPaymentDate(LocalDateTime.now().minusHours(2));
            
            paymentRepository.saveAll(java.util.List.of(payment1, payment2));
            
            // 4. Create a Claim (approved)
            Claim claim = new Claim();
            claim.setWorkerId(worker1.getId());
            claim.setHospitalId(hospital.getId());
            claim.setClaimAmount(new BigDecimal("1500.00"));
            claim.setClaimStatus(ClaimStatus.APPROVED);
            claim.setClaimDate(LocalDateTime.now().minusHours(1));
            claimRepository.save(claim);
            
            System.out.println("✅ Sample data loaded!");
            System.out.println("📊 Workers: John (ACTIVE, expires in 5h), Mary (SUSPENDED), Peter (ACTIVE, expires in 48h)");
            System.out.println("🏥 Hospital: Nairobi General Hospital (API Key: TEST-API-KEY-12345)");
        }
    }
}
