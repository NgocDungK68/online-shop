package com.bezkoder.springjwt.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "shipmentdetails")
public class ShipmentDetails {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipfrom")
    private String shipFrom;

    @Column(name = "shipto")
    private String shipTo;

    @Column(name = "phonenumber")
    private String phoneNumber;

    @Column(name = "paymentmethod")
    private PaymentMethod paymentMethod;

    public ShipmentDetails(){

    }
    
    public ShipmentDetails(PaymentMethod paymentMethod, String phoneNumber, String shipFrom, String shipTo) {
        this.paymentMethod = paymentMethod;
        this.phoneNumber = phoneNumber;
        this.shipFrom = shipFrom;
        this.shipTo = shipTo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShipFrom() {
        return shipFrom;
    }

    public void setShipFrom(String shipFrom) {
        this.shipFrom = shipFrom;
    }

    public String getShipTo() {
        return shipTo;
    }

    public void setShipTo(String shipTo) {
        this.shipTo = shipTo;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        paymentMethod = paymentMethod.replaceAll(" ", "_").toUpperCase();
        this.paymentMethod = PaymentMethod.valueOf(paymentMethod);
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

}
