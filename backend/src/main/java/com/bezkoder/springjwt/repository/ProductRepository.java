package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bezkoder.springjwt.models.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
