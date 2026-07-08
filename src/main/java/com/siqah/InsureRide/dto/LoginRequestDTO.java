package com.siqah.InsureRide.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    @NotBlank(message = "API key is required")
    private String apiKey;
}
