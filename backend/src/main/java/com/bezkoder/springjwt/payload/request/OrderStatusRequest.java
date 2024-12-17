package com.bezkoder.springjwt.payload.request;

import com.bezkoder.springjwt.models.OrderStatus;

public class OrderStatusRequest{
    private String newStatus;

    public OrderStatus getNewStatus() {
        return OrderStatus.valueOf(newStatus);
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }
}