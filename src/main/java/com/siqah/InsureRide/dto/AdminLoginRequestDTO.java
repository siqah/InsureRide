package com.siqah.InsureRide.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminLoginRequestDTO {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
