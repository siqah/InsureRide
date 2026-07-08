package com.siqah.InsureRide.dto;

import com.siqah.InsureRide.entity.CoverageStatus;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class WorkerDTO {
    private Long id;

    @NotBlank(message = "Worker name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^0\\d{9}$", message = "Phone number must be a valid 10-digit number starting with 0")
    private String phoneNumber;

    private CoverageStatus coverageStatus;
    private LocalDateTime coverageExpiry;
}
