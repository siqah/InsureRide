package com.siqah.InsureRide.scheduler;

import com.siqah.InsureRide.entity.Worker;
import com.siqah.InsureRide.entity.CoverageStatus;
import com.siqah.InsureRide.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CoverageScheduler {
    
    private final WorkerRepository workerRepository;
    
    // Runs EVERY NIGHT at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void suspendExpiredWorkers() {
        log.info("🕛 Running midnight coverage sweep...");
        
        LocalDateTime now = LocalDateTime.now();
        
        // Find all active workers whose expiry has passed
        List<Worker> expiredWorkers = workerRepository.findExpiredActiveWorkers(now);
        
        int suspendedCount = 0;
        for (Worker worker : expiredWorkers) {
            worker.setCoverageStatus(CoverageStatus.SUSPENDED);
            workerRepository.save(worker);
            suspendedCount++;
            log.info("Suspended worker: {} - {}", worker.getPhoneNumber(), worker.getName());
        }
        
        log.info("✅ Suspended {} workers with expired coverage", suspendedCount);
    }
    
    // Optional: Run every hour to catch any missed suspensions
    @Scheduled(cron = "0 0 * * * ?")
    public void hourlySweep() {
        LocalDateTime now = LocalDateTime.now();
        List<Worker> expiredWorkers = workerRepository.findExpiredActiveWorkers(now);
        
        if (!expiredWorkers.isEmpty()) {
            log.warn("⚠️ Found {} expired workers outside midnight - suspending...", expiredWorkers.size());
            for (Worker worker : expiredWorkers) {
                worker.setCoverageStatus(CoverageStatus.SUSPENDED);
                workerRepository.save(worker);
            }
        }
    }
}
