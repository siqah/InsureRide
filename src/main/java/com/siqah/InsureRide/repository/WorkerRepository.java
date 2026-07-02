package com.siqah.InsureRide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

import com.siqah.InsureRide.entity.CoverageStatus;
import com.siqah.InsureRide.entity.Worker;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByPhoneNumber(String phoneNumber); //getting the worker by phone number

    @Query("SELECT w FROM Worker w WHERE w.coverageStatus  = 'ACTIVE' AND w.coverageExpiry < :now")

    List<Worker> findExpiredActiveWorkers(LocalDateTime now);

    Long countByCoverageStatus(CoverageStatus status);
    
}
