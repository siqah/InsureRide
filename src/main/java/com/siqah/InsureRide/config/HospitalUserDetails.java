package com.siqah.InsureRide.config;

import com.siqah.InsureRide.entity.Hospital;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class HospitalUserDetails implements UserDetails {
    private final Hospital hospital;

    public HospitalUserDetails(Hospital hospital) {
        this.hospital = hospital;
    }

    public Hospital getHospital() {
        return hospital;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_HOSPITAL"));
    }

    @Override
    public String getPassword() {
        return ""; // API Key logins do not use database-hashed password checks
    }

    @Override
    public String getUsername() {
        return hospital.getApikey();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return hospital.getIsActive();
    }
}
