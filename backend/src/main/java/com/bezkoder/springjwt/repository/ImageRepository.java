package com.bezkoder.springjwt.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bezkoder.springjwt.models.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long>{
    Boolean existsByImagelink(String imagelink);

    Optional<Image> findByImagelink(String imagelink);
}
