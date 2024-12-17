package com.bezkoder.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bezkoder.springjwt.models.Order;
import com.bezkoder.springjwt.models.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
   public List<Order> findAllByUser(User user);
}
