package com.siqah.InsureRide.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.siqah.InsureRide.dto.WorkerDTO;
import com.siqah.InsureRide.repository.WorkerRepository;
import com.siqah.InsureRide.entity.Worker;
import com.siqah.InsureRide.entity.CoverageStatus;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor 
public class WorkerService {
    private final WorkerRepository workerRepository;

    //create an new worker
    public WorkerDTO registerWorker(String name, String phoneNumber){
        Worker worker = new Worker();
        worker.setName(name);
        worker.setPhoneNumber(phoneNumber);
        worker.setCoverageStatus(CoverageStatus.SUSPENDED);
        worker.setCoverageExpiry(null);

        Worker saved = workerRepository.save(worker);
        return convertToDTO(saved);
    }

     // Utility method to convert Entity -> DTO
    private WorkerDTO convertToDTO(Worker worker) {
        WorkerDTO dto = new WorkerDTO();
        dto.setId(worker.getId());
        dto.setName(worker.getName());
        dto.setPhoneNumber(worker.getPhoneNumber());
        dto.setCoverageStatus(worker.getCoverageStatus());
        dto.setCoverageExpiry(worker.getCoverageExpiry());
        return dto;
    }

    //get all workers
    public List<WorkerDTO> getAllWorkers(){
        return workerRepository.findAll().stream()
                .map(this::convertToDTO)     
                .collect(Collectors.toList());
    }

    //getworker by phonenumber
    public WorkerDTO getWorkerByPhone(String phoneNumber) {
        Worker worker = workerRepository.findByPhoneNumber(phoneNumber)
               .orElseThrow(() -> new RuntimeException("worker not found"));
        return convertToDTO(worker);
    }
    
    //Update worker status(for admin)
    public WorkerDTO updateWorkerStatus(Long workerId, CoverageStatus newStatus){
        Worker worker = workerRepository.findById(workerId)
               .orElseThrow(() -> new RuntimeException("Worker not found"));

        worker.setCoverageStatus(newStatus);
        return convertToDTO(workerRepository.save(worker));
       
    }

    //delete worker
    public void deleteWorker(Long workerId){
        workerRepository.deleteById(workerId);
    }

}
