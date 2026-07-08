package com.siqah.InsureRide.config;

import com.siqah.InsureRide.repository.HospitalRepository;
import com.siqah.InsureRide.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final HospitalRepository hospitalRepository;
    private final WorkerRepository workerRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            if ("admin".equals(username)) {
                return new AdminUserDetails();
            }

            if (username.matches("^0\\d{9}$")) {
                return workerRepository.findByPhoneNumber(username)
                        .map(WorkerUserDetails::new)
                        .orElseThrow(() -> new UsernameNotFoundException("Worker not found with phone: " + username));
            }

            try {
                Long id = Long.parseLong(username);
                return hospitalRepository.findById(id)
                        .map(HospitalUserDetails::new)
                        .orElseThrow(() -> new UsernameNotFoundException("Hospital not found with ID: " + id));
            } catch (NumberFormatException e) {
                throw new UsernameNotFoundException("User not found: " + username);
            }
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
