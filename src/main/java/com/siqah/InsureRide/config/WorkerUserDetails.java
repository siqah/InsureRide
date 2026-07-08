package com.siqah.InsureRide.config;

import com.siqah.InsureRide.entity.Worker;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class WorkerUserDetails implements UserDetails {
    private final Worker worker;

    public WorkerUserDetails(Worker worker) {
        this.worker = worker;
    }

    public Worker getWorker() {
        return worker;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_WORKER"));
    }

    @Override
    public String getPassword() {
        return worker.getPin();
    }

    @Override
    public String getUsername() {
        return worker.getPhoneNumber();
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
        return true;
    }
}
