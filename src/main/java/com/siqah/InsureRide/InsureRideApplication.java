package com.siqah.InsureRide;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication 
@EnableScheduling // crucial for the scheduler to work
public class InsureRideApplication {
	public static void main(String[] args) {
		SpringApplication.run(InsureRideApplication.class, args);
	}

}
