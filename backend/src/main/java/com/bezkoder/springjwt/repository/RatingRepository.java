package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bezkoder.springjwt.models.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
}
