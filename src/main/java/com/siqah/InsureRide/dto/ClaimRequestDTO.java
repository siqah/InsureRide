package com.siqah.InsureRide.dto;

import java.math.BigDecimal;
import lombok.Data;

//hospital sends this to our backend when a worker comes to claim
@Data
public class ClaimRequestDTO {
    private String workerPhoneNumber;
    private BigDecimal billAmoount;

}
