package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bezkoder.springjwt.models.RatingStatus;

@Repository
public interface RatingStatusRepository extends JpaRepository<RatingStatus, Long> {
    
}
