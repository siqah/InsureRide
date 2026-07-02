package com.siqah.InsureRide.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.siqah.InsureRide.entity.Claim;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByWorkerId(Long workerId);
    List<Claim> findByHospitalId(Long hospitalId);
}
