package com.siqah.InsureRide.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private String phoneNumber; //worker identifier
    private BigDecimal amount; //amount sends
    private String transactionReference; //unique identifier for the payment it can be Mpesa code 
    

}
