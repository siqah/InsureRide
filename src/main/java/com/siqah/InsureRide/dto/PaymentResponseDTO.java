package com.siqah.InsureRide.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PaymentResponseDTO {
    private String workerName;
    private String phoneNumber; 
    private BigDecimal amountpaid;
    private LocalDateTime newExpiryTime;
    private String message; //"coverage extended to [Expiry Date and Time]"


}
