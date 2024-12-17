import React from "react";
import "./profile.scss";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { appContext } from "../../context/AppContext";
import { useEffect } from "react";
import { useAuth } from "../../services/auth.service";

export default function Profile() {
  const {
    favoriteList,
    setfavoriteList,
    addToCart,
    getStars,
    userData,
    ordersData,
    cancelOrder,
    sendNotification,
    productData,
    setProductData,
    currentLocation,
  } = useContext(appContext);

  const{
    currentUser,
  } = useAuth();
  const removeFromfavorite = (currentProductId) => {
    let newfavoriteList = favoriteList;
    newfavoriteList = newfavoriteList.filter(
      (product) => product.id !== currentProductId
    );
    setfavoriteList(newfavoriteList);
    let newData = productData;
    newData[currentProductId - 1].favorite =
      !newData[currentProductId - 1].favorite;
    setProductData(newData);
    localStorage.setItem("productsData", JSON.stringify(productData));
  };
  const location = useLocation();
  useEffect(() => {
    currentLocation.current = location.pathname;
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {currentUser != null ?
      <div className="profile-page">
        <div className="left-side">
          <div className="top">
            <img src={currentUser.username} alt="" />
          </div>
          <div className="image">
            <img src={userData.userImage} alt="user" />
          </div>
          <div className="bottom">
            <h1>{currentUser.username}</h1>
            <h3>
              <span className="info-title">Age:</span>
              <span className="info-text">{userData.userAge} Years Old</span>
            </h3>
            <h3>
              <span className="info-title">Address:</span>
              <span className="info-text"> {userData.address}</span>
            </h3>
            <h3>
              <span className="info-title">Email:</span>
              <span className="info-text">{currentUser.email}</span>
            </h3>
            <h3>
              <span className="info-title">Token:</span>
              <span className="info-text">  {currentUser.accessToken.substring(0,20)}</span>
            </h3>
            <h3>
              <span className="info-title">Role:</span>
              <span className="info-text">  
                <ul>
                  {currentUser.roles &&
                  currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                </ul>
              </span>
            </h3>
          </div>
        </div>
        <div className="center-side">
          <h1 className="favorite-title">Favorite List</h1>
          <div className="favorite-list">
            <hr />
            {favoriteList.length === 0 && (
              <h3 className="empty-list">
                Your Favorite items will appear here
              </h3>
            )}
            {favoriteList.map((item) => {
              return (
                <div key={item.product.id}>
                  <div className="favorite-item">
                    <div className="left">
                      <div className="image">
                        <img src={item.product.images[0]} alt="favorite-item" />
                      </div>
                      <div className="center">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="title">{item.title}</h3>
                        </Link>
                        <div className="rating">
                          <div className="stars">
                            {getStars(item)} ({item.raters})
                          </div>
                        </div>
                        <div className="price-count">
                          <p className="price">Price: ${item.price} </p>
                          <p
                            className={`count ${
                              item.count >= 5 ? "high" : "low"
                            }`}
                          >
                            {item.count} In Stock
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="right">
                      <button
                        onClick={() => {
                          addToCart(item);
                        }}
                      >
                        Add To Cart
                      </button>
                      <button
                        className="remove"
                        onClick={() => {
                          removeFromfavorite(item.id);
                          sendNotification(
                            "Removed from Favorites",
                            item.title
                          );
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
        <div className="right-side">
          <h1 className="orders-title">Your Orders</h1>
          <hr />
          <div className="orders-list">
            {ordersData.length === 0 && (
              <h3 className="empty-list">Your Orders will appear here</h3>
            )}
            {ordersData.map((item) => {
              let product = item.product;
              return (
                <div key={Math.floor(Math.random() * 100)}>
                  <div className="order-item">
                    <div className="left">
                      <div className="image">
                        <img src={product.images[0]} alt="order-item" />
                      </div>
                      <div className="center">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="title">{product.title}</h3>
                        </Link>
                        <div className="price-count">
                          <p className="price">Price: ${product.price} </p>
                          <p className="count">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      <Link to={`/product/${product.id}`}>
                        <button>Buy it Again</button>
                      </Link>
                      <button
                        className="remove"
                        onClick={() => {
                          cancelOrder(product.id);
                          sendNotification("Order Canceled", product.title);
                        }}
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
      </div> : ""}
    </>
  );
}
