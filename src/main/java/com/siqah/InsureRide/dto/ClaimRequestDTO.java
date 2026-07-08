package com.siqah.InsureRide.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

//hospital sends this to our backend when a worker comes to claim
@Data
public class ClaimRequestDTO {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^0\\d{9}$", message = "Phone number must be a valid 10-digit number starting with 0")
    private String workerPhoneNumber;

    @NotNull(message = "Bill amount is required")
    @Positive(message = "Bill amount must be greater than zero")
    private BigDecimal billAmount;
}
