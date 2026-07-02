package com.siqah.InsureRide.dto;


import lombok.Data;

@Data
public class ClaimResponseDTO {
    private String workerName;
    private String workerPhone;
    private Boolean isCovered;
    private String status; // ""denied" or "approved" 
    private String message; // "Coverage active - claim approved" or ""worker suspended"

    

}
