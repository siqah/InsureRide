package com.siqah.InsureRide.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class WorkerLoginRequestDTO {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^0\\d{9}$", message = "Phone number must be a valid 10-digit number starting with 0")
    private String phoneNumber;

    @NotBlank(message = "PIN is required")
    @Pattern(regexp = "^\\d{4}$", message = "PIN must be exactly 4 digits")
    private String pin;
}
