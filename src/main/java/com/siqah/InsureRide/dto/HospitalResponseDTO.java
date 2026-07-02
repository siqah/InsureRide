package com.siqah.InsureRide.dto;

import lombok.Data;

@Data
public class HospitalResponseDTO {
    private Long id;
    private String name;
    private String apikey; //sent this only once during registtraion
    private String message; //"Save tthis api key - you wont see it again"


}
