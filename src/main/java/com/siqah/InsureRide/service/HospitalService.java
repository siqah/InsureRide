package com.siqah.InsureRide.service;
import lombok.RequiredArgsConstructor;
import com.siqah.InsureRide.repository.HospitalRepository;
import com.siqah.InsureRide.dto.HospitalResponseDTO;
import com.siqah.InsureRide.entity.Hospital;
import com.siqah.InsureRide.dto.HospitalRegistrationDTO;
import java.util.UUID;


import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class HospitalService {
    private final HospitalRepository hospitalRepository;

    @Transactional
    public HospitalResponseDTO registerHospital(HospitalRegistrationDTO request){
        //check if the hospital already registered
        hospitalRepository.findByName(request.getName())
                .ifPresent(h -> {throw new RuntimeException("Hospital already registerd");

                });

        //generate a seucure api key(random UUID)
        String apiKey = UUID.randomUUID().toString().replace("-","").substring(0, 32);


        //create the hospital
        Hospital hospital = new Hospital();
        hospital.setName(request.getName());
        hospital.setApikey(apiKey);  //in production you would hash this with BCrypt
        hospital.setIsActive(true);

        Hospital saved = hospitalRepository.save(hospital);

        HospitalResponseDTO response = new HospitalResponseDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setApikey(apiKey);
        response.setMessage("Save this api key - you won't see it again!"+apiKey);

        return response;
       
    }
    //validate api key (used by security filter later)
    public boolean isvalidApiKey(String apiKey){
        return hospitalRepository.findByApikey(apiKey)
               .map(hospital -> hospital.getIsActive())
               .orElse(false);
    }
    
        
    

    
}
