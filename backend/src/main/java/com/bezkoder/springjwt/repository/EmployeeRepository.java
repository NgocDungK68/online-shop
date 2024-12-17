package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bezkoder.springjwt.models.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>{
    
    
}
