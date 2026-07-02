package com.siqah.InsureRide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.siqah.InsureRide.entity.Hospital;

@Repository
public interface HospitalRepostory extends JpaRepository<Hospital, Long> {
    Optional<Hospital> findByApikey(String apikey);
    Optional<Hospital> findByName(String name);

}
