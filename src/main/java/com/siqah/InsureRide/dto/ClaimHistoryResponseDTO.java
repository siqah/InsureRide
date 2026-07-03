package com.siqah.InsureRide.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ClaimHistoryResponseDTO {
    private Long id;
    private String workerName;
    private String workerPhone;
    private BigDecimal amount;
    private String status; // "APPROVED" or "DENIED"
    private LocalDateTime date;
}
