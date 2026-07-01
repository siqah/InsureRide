package com.siqah.InsureRide.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "claims")
@NoArgsConstructor
@AllArgsConstructor
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long workerId; //reference to the workers table

    @Column(nullable = false)
    private Long hospitalId; //reference to the hospitals table

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal claimAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus claimStatus; // approved or rejected

    private String rejectionReason;

    private LocalDateTime claimDate;  
    
    @PrePersist
    protected void onCreate(){
        claimDate = LocalDateTime.now();
    }
    
    
    
    
    

}
