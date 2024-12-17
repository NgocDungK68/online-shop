import React, { useContext, useRef } from "react";
import { useEffect } from "react";
import { appContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import "./checkout.scss";
import { useState } from "react";
import { submitOrder } from "../../services/order.service";
import { useAuth } from "../../services/auth.service";
export default function CheckOut() {
  const {
    cartData,
    cartTotalPrice,
    setCartTotalPrice,
    setCheckOut,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    checkOut,
    userData,
    setCartData,
    setOrdersData,
    productData,
    setProductData,
    setCartCount,
    sendNotification,
  } = useContext(appContext);
  const count = useRef(0);
  const { currentUser } = useAuth();
  const [steps, setSteps] = useState(1);
  const [randomYear, setRandomYear] = useState(
    Math.floor(Math.random() * 10 + 1)
  );

  const [paymentMethods, setPaymentMethods] = useState([
    "Cash",
    "Master Card",
    "Visa Card",
    "Debit Card",
  ]);

  const [shipmentDetails, setShipmentDetails] = useState({
    shipFrom: "",
    shipTo: "",
    phoneNumber: "",
    paymentMethod: "",
  })


  function handleShipmentDetailsChange(e) {
    setShipmentDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }

    })
  }

  function getPaymentMethodValue(method) {
    return method.replace(/ /g, "_").toUpperCase();
  }

  useEffect(() => {
    console.log("setting shipment details");
    setCartData((prev) => {
      return {
        ...prev,
        shipmentDetails: shipmentDetails,
      }
    })
  }, [shipmentDetails])
  
  count.current = 0;
  useEffect(() => {
    if (steps === 3) {
      let newData = productData;
      newData.map((product) => {
        product.addedToCart = false;
      });
      setProductData(newData);
      setOrdersData((prev) => [...prev, ...cartData.orderProducts]);
      setCartData({ orderProducts: [], date: null });
      localStorage.setItem("cartData", JSON.stringify([]));
      setCartCount(0);
      setCartTotalPrice(0);
      sendNotification("New Order Submitted", "You have added new order");
    }
    if (steps === 4) {
      setCheckOut(false);
      setSteps(1);
    }
  }, [
    productData,
    setCartCount,
    setCartData,
    setCartTotalPrice,
    setCheckOut,
    setOrdersData,
    setProductData,
    steps,
  ]);
  useEffect(() => {
    setRandomYear(Math.floor(Math.random() * 10 + 2));
  }, [steps]);
  useEffect(() => {
    setSteps(1);
  }, [checkOut]);
  return (
    <div className={`check-out ${checkOut ? "show" : ""}`}>
      <h1 className="check-out-title">Checkout</h1>
      <hr className="main-hr" />
      <div className={`steps-bar step${steps}`}>
        <div className="step-circle"></div>
        <hr className="step-line" />
        <div className="step-circle"></div>
        <hr className="step-line" />
        <div className="step-circle"></div>
      </div>
      {steps === 1 && (
        <div className="products">
          {cartData.orderProducts && cartData.orderProducts.map((item) => {
            count.current += 1;
            let product = item.product;
            return (
              <div key={count.current}>
                <div className="product">
                  <div className="left">
                    <img src={product.images[0]} alt="product" />
                  </div>
                  <div className="right">
                    <Link to={`/product/${product.id}`}>
                      <h1 className="title">{product.title}</h1>
                    </Link>
                    <p className="price">Price: ${item.product.price}</p>
                    <p className="price">Quantity: {item.quantity}</p>
                    <div className="check-out-buttons">
                      <button
                        className="remove"
                        onClick={removeItem}
                        id={product.id}
                        value={count.current}
                      >
                        Delete
                      </button>
                      <span className="change-buttons">
                        <button
                          className="change-quantity"
                          onClick={decreaseQuantity}
                          id={product.id}
                          data-quantity={item.quantity}
                          data-avquantity={item.avQuantity}
                          value={count.current}
                        >
                          -
                        </button>
                        <button
                          className="change-quantity"
                          onClick={increaseQuantity}
                          id={product.id}
                          data-quantity={item.quantity}
                          data-avquantity={item.avQuantity}
                          value={count.current}
                        >
                          +
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            );
          })}
        </div>
      )}
      {steps === 2 && (
        <div className="step2">
          <div className="step2-container">
            <h2>Check you info before submitting</h2>
            <div className="checkout-user-detail">
              <h3>Your Name: </h3>
              <span>{currentUser.username}</span>
            </div>
            <div className="checkout-user-detail">
              <h3>Ship to: </h3>
              <div className="form-group">
                <input
                  placeholder="Desired Address"
                  type="text"
                  name="shipTo"
                  onChange={handleShipmentDetailsChange}
                  className="form-field"
                  required
                ></input>
                <label for="shipTo" class="form-label">Your Address</label>
              </div>
            </div>
            <div className="checkout-user-detail">
              <h3>Phone: </h3>
              <div className="form-group">
                <input
                  placeholder="Phone Number"
                  type="input"
                  name="phoneNumber"
                  onChange={handleShipmentDetailsChange}
                  className="form-field"
                  required
                ></input>
                <label for="phoneNumber" class="form-label"> Your Phone</label>
              </div>
            </div>
            <div className="checkout-user-detail">
              <h3>Payment Method: </h3>
              <select
                name="paymentMethod"
                onChange={handleShipmentDetailsChange}>
                {paymentMethods.map((method) => {
                  return (
                    <option value={getPaymentMethodValue(method)} name="paymentMethod">{method}</option>
                  )
                })}
              </select>
            </div>
            <div className="checkout-user-detail">
              <h3>Arrive in: </h3>
              <span>2 Days</span>
            </div>
            <h3>
              <strong>Notice!</strong> This is not real order, don't worry
            </h3>
          </div>
        </div>
      )}
      {steps === 3 && (
        <div className="last-step">
          <h1 className="success">Success</h1>
          <h2>You order will arrive in {randomYear} Years</h2>
          <h3>Because we don't have any product</h3>
        </div>
      )}
      <div
        onClick={() => {
          setSteps(1);
          setCheckOut(false);
        }}
        className="exit"
      >
        X
      </div>
      {steps !== 3 && (
        <h2 className="total">Total To Pay: ${cartTotalPrice}</h2>
      )}
      <div className="buttons">
        <button
          onClick={() => {
            setSteps((prev) => prev + 1);
            if (steps == 2) {
              submitOrder(cartData);
            }
          }}
          className="next-step"
        >
          {steps === 1 && "Next Step"} {steps === 2 && "Submit Order"}{" "}
          {steps === 3 && "Close"}
        </button>

        {steps === 3 && (
          <Link
            onClick={() => {
              setCheckOut(false);
            }}
            to="/profile"
          >
            <button className="next-step">Check orders</button>
          </Link>
        )}
      </div>
    </div>
  );
}
