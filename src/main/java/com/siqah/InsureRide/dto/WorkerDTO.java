package com.siqah.InsureRide.dto;

import com.siqah.InsureRide.entity.CoverageStatus;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class WorkerDTO {
    private Long id;
    private String name;
    private String phoneNumber;
    private CoverageStatus coverageStatus;
    private LocalDateTime coverageExpiry;

}
