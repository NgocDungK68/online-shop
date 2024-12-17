package com.bezkoder.springjwt.controllers;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bezkoder.springjwt.exception.ResourceNotFoundException;
import com.bezkoder.springjwt.models.Order;
import com.bezkoder.springjwt.models.OrderProduct;
import com.bezkoder.springjwt.models.OrderStatus;
import com.bezkoder.springjwt.models.Product;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.OrderRequest;
import com.bezkoder.springjwt.payload.request.OrderStatusRequest;
import com.bezkoder.springjwt.repository.OrderRepository;
import com.bezkoder.springjwt.repository.ProductRepository;
import com.bezkoder.springjwt.repository.ShipmentDetailsRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.security.services.UserDetailsImpl;




@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired 
    private UserRepository userRepository;
    
    @Autowired 
    private ShipmentDetailsRepository ShipmentDetails;
    
    @PostMapping("/order")
    public Order createOrder(@RequestBody OrderRequest orderRequest){
        Set<OrderProduct> cartProducts = orderRequest.getOrderProducts();
        Order order = new Order();
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).get();
        ZonedDateTime timeNow = ZonedDateTime.now(ZoneId.of("UTC"));


        int totalPrice = 0;
        for(OrderProduct prod : cartProducts){
            Product product = prod.getProduct();
            Optional<Product> fetchedProduct = productRepository.findById(product.getId());
            OrderProduct newOrderProduct = new OrderProduct(order, fetchedProduct.get(), prod.getQuantity());
            order.getOrderProducts().add(newOrderProduct);
            totalPrice += product.getPrice() * prod.getQuantity();
        }

        System.out.println(orderRequest.getShipmentDetails());
        order.setDate(timeNow);
        order.setOrderStatus(OrderStatus.Processing);
        order.setUser(userRepository.findById(user.getId()).get());
        order.setTotalPrice(totalPrice);
        order.setOrderProducts(cartProducts);
        order.setShipmentDetails(orderRequest.getShipmentDetails());
        return orderRepository.save(order);
    }

    @GetMapping("/order")
    public List<Order> getAllOrder(@AuthenticationPrincipal UserDetailsImpl userDetailsImpl){
        Long user_id = userDetailsImpl.getId();
        User user = userRepository.findById(user_id).get();
        return orderRepository.findAllByUser(user);
    }

    @GetMapping("/order/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id){
        Order fetchedOrder = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order is not found"));
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).get();
        if(!Objects.equals(fetchedOrder.getUser().getId(), user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(fetchedOrder);
    }

    @PutMapping("/order/{id}/status")
    public ResponseEntity<Order> changeStatus(@PathVariable Long id, @RequestBody OrderStatusRequest newStatus){
        Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id :" + id));
        order.setOrderStatus(newStatus.getNewStatus());
        Order updatedOrder = orderRepository.save(order);
        return ResponseEntity.ok(updatedOrder);
    }
}
