package com.bezkoder.springjwt.payload.request;

import java.util.HashSet;
import java.util.Set;

import com.bezkoder.springjwt.models.OrderProduct;
import com.bezkoder.springjwt.models.ShipmentDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;

public class OrderRequest {
    private ShipmentDetails shipmentDetails;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderProduct> orderProducts = new HashSet<>();

    public Set<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(Set<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }

    public ShipmentDetails getShipmentDetails() {
        return shipmentDetails;
    }

    public void setShipmentDetails(ShipmentDetails shipmentDetails) {
        this.shipmentDetails = shipmentDetails;
    }
}
