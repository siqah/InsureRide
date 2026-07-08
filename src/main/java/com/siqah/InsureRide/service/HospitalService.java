package com.siqah.InsureRide.service;
import lombok.RequiredArgsConstructor;
import com.siqah.InsureRide.repository.HospitalRepository;
import com.siqah.InsureRide.dto.HospitalResponseDTO;
import com.siqah.InsureRide.entity.Hospital;
import com.siqah.InsureRide.dto.HospitalRegistrationDTO;
import com.siqah.InsureRide.config.JwtService;
import com.siqah.InsureRide.config.HospitalUserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.UUID;


import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class HospitalService {
    private final HospitalRepository hospitalRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    private Long parseHospitalIdFromApiKey(String apiKey) {
        if (apiKey == null || !apiKey.contains(".")) {
            return null;
        }
        try {
            return Long.parseLong(apiKey.split("\\.")[0]);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Transactional
    public HospitalResponseDTO registerHospital(HospitalRegistrationDTO request){
        //check if the hospital already registered
        hospitalRepository.findByName(request.getName())
                .ifPresent(h -> {throw new RuntimeException("Hospital already registered");
                });

        //create the hospital with temp key
        Hospital hospital = new Hospital();
        hospital.setName(request.getName());
        hospital.setApikey("TEMP");
        hospital.setIsActive(true);
        Hospital saved = hospitalRepository.save(hospital);

        //generate secure api key and prefix with database id
        String apiKeySecret = UUID.randomUUID().toString().replace("-","").substring(0, 32);
        String plainApiKey = saved.getId() + "." + apiKeySecret;

        //hash key and save
        saved.setApikey(passwordEncoder.encode(plainApiKey));
        hospitalRepository.save(saved);

        HospitalResponseDTO response = new HospitalResponseDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setApikey(plainApiKey);
        response.setMessage("Save this api key - you won't see it again! " + plainApiKey);

        return response;
    }

    //validate api key (used by security filter later)
    public boolean isvalidApiKey(String apiKey){
        Long hospitalId = parseHospitalIdFromApiKey(apiKey);
        if (hospitalId == null) {
            return false;
        }
        return hospitalRepository.findById(hospitalId)
               .map(hospital -> hospital.getIsActive() && passwordEncoder.matches(apiKey, hospital.getApikey()))
               .orElse(false);
    }

    public String login(String apiKey) {
        Long hospitalId = parseHospitalIdFromApiKey(apiKey);
        if (hospitalId == null) {
            throw new RuntimeException("Invalid API Key format");
        }
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Invalid API Key"));

        if (!passwordEncoder.matches(apiKey, hospital.getApikey())) {
            throw new RuntimeException("Invalid API Key");
        }

        if (!hospital.getIsActive()) {
            throw new RuntimeException("Hospital account is suspended");
        }

        return jwtService.generateToken(new HospitalUserDetails(hospital));
    }

    public HospitalResponseDTO getHospitalDetails(String apiKey) {
        Long hospitalId = parseHospitalIdFromApiKey(apiKey);
        if (hospitalId == null) {
            throw new RuntimeException("Invalid API Key format");
        }
        Hospital hospital = hospitalRepository.findById(hospitalId)
               .orElseThrow(() -> new RuntimeException("Hospital not found or invalid API Key"));
        
        if (!passwordEncoder.matches(apiKey, hospital.getApikey())) {
            throw new RuntimeException("Hospital not found or invalid API Key");
        }
        
        HospitalResponseDTO response = new HospitalResponseDTO();
        response.setId(hospital.getId());
        response.setName(hospital.getName());
        response.setApikey(null); // Omit key in responses
        return response;
    }

    public HospitalResponseDTO getHospitalDetailsById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        HospitalResponseDTO response = new HospitalResponseDTO();
        response.setId(hospital.getId());
        response.setName(hospital.getName());
        response.setApikey(null);
        return response;
    }
}
