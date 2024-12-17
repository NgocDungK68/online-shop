import { createContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import UserData from "../userData";
import authService from "../services/auth.service";
export const appContext = createContext();
import { createProduct, getProduct, getProducts } from "../services/product.service";

export default function AppContextProvider(props) {
  const [productData, setProductData] = useState(
  );
  const [cartData, setCartData] = useState({
    orderProducts: [],
    date: null,
  });
  const [ordersData, setOrdersData] = useState([]);
  const [favoriteList, setfavoriteList] = useState([]);
  const [userData, setUserData] = useState(UserData);
  const [currentUser, setCurrentUser] = useState(null);
  const searchValue = useRef("");
  const [isLogin, setIsLogin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [cartCount, setCartCount] = useState(cartData.length);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationMsgCount, setNotificationMsgCount] = useState(0);
  const [notificationList, setNotificationList] = useState([]);
  const [checkOut, setCheckOut] = useState(false);
  const [randomSortedProductData, setRandomSortedProductData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const currentLocation = useRef("");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result);
          if (result.state === "granted") {

          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  function handleLocationCLick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(pos) {
    var crd = pos.coords;
    setLocation(getLocationInfo(crd.latitude, crd.longitude));
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }

  function getLocationInfo(latitude, longitude) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${APIkey}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status.code === 200) {
          console.log("results:", data.results);
          setLocation(data.results[0].formatted);
        } else {
          console.log("Reverse geolocation request failed.");
        }6
      })
      .catch((error) => console.error(error));
  }
  function error() {
    console.log("Unable to retrieve your location");
  }

  useEffect(() => {
    fetchData();
    localStorage.setItem("cartData", JSON.stringify(cartData));
  }, []);
  const fetchData = async () => {
    console.log("Fetching products");
    const fetchedProducts = await getProducts();
    setProductData(fetchedProducts);
    console.log(fetchedProducts);
  };
  const searchProduct = () => {
    setFilteredData([
      ...productData.filter(
        (product) =>
          product.title.toLowerCase().includes(searchValue.current) ||
          product.description.toLowerCase().includes(searchValue.current) ||
          product.category.toLowerCase().includes(searchValue.current)
      ),
    ]);
  };
  useEffect(() => {
    //console.log(productData);
    if (!productData) return;
    console.log("Product Data Changed");
    localStorage.setItem("productData", JSON.stringify(productData));
    setFilteredData(productData);
    setfavoriteList(productData.filter((product) => product.favorite));
    setRandomSortedProductData(Array.from(productData));
  }, [productData]);
  useEffect(() => {
    if (randomSortedProductData) {
      setRandomSortedProductData(
        randomSortedProductData.sort((a, b) => 0.5 - Math.random())
      );
      //console.log(randomSortedProductData);
    }
  }, [randomSortedProductData])
  useEffect(() => {
    localStorage.setItem("ordersData", JSON.stringify(ordersData));
  }, [ordersData]);
  useEffect(() => {
    if (!cartData.products) return;
    localStorage.setItem("cartData", JSON.stringify(cartData));
    setCartCount(cartData.products.length);
    let totalPriceOfCart = 0;
    cartData.products.forEach((item) => (totalPriceOfCart += item.price));
    setCartTotalPrice(totalPriceOfCart);
  }, [cartData]);
  //  Functions
  const sendNotification = (msg, item) => {
    let newList = notificationList;
    newList.push({ id: notificationMsgCount, message: msg, item: item });
    setNotificationList(newList);
    setNotificationMsgCount((prev) => prev + 1);
  };
  const cancelOrder = (index) => {
    let newOrdersList = ordersData;
    newOrdersList = newOrdersList.filter((product) => product.id !== index);
    setOrdersData(newOrdersList);
  };
  const getStars = (prod) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i >= prod.rating) {
        stars.push(<i key={i} className="fa-regular fa-star"></i>);
      } else {
        stars.push(<i key={i} className="fa-solid fa-star"></i>);
      }
    }
    return stars;
  };
  const getArrows = (ref) => {
    return (
      <>
        <div
          className="arrow right-arrow"
          onClick={() => {
            goRight(ref);
          }}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </div>
        <div
          className="arrow left-arrow"
          onClick={() => {
            goLeft(ref);
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </div>
      </>
    );
  };
  const addToCart = async (productId) => {
    let prod = await getProduct(productId);
    if(!prod){
      sendNotification("Could not find product with id: " + productId);
      return;
    }
    if (!prod.addedToCart) {
      setCartCount((prev) => prev + 1);
      setCartData((prev) => {
        console.log("added product: " + prod.title);
        return {
          orderProducts: [
            ...(prev.orderProducts || []),
            {
              product: { ...prod },
              quantity: 1,
              avQuantity: 100,
            }]
        }
      });
      console.log(cartData);
      setCartTotalPrice((prev) => prev + prod.price);
      let newData = productData;
      setProductData(newData);
      sendNotification(`Item Added to Cart`, prod.title);
    } else {
      sendNotification(`Item Already in Cart`);
    }
    localStorage.setItem("productsData", JSON.stringify(productData));
    localStorage.setItem("cartData", JSON.stringify(cartData));
  };
  function increaseQuantity(e) {
    let avQuantity = +e.target.getAttribute("data-avquantity");
    let quantity = +e.target.getAttribute("data-quantity");

    let newCartData = cartData;
    console.log(e.target.value);
    console.log(cartData.orderProducts[e.target.value - 1]);
    newCartData.orderProducts[e.target.value - 1].quantity += 1;
    setCartData(newCartData);

    let newTotalPrice = 0;
    for (let i = 0; i < newCartData.orderProducts.length; i++) {
      let prod = newCartData.orderProducts[i];
      newTotalPrice += prod.quantity * prod.product.price;
    }
    setCartTotalPrice(newTotalPrice);
  }
  function decreaseQuantity(e) {
    let quantity = e.target.getAttribute("data-quantity");
    if (quantity > 1) {
      let newCartData = cartData;
      newCartData.orderProducts[e.target.value - 1].quantity -= 1;
      setCartData(newCartData);

      let newTotalPrice = 0;
      for (let i = 0; i < newCartData.orderProducts.length; i++) {
        let prod = newCartData.orderProducts[i];
        newTotalPrice += prod.quantity * prod.product.price;
      }
      setCartTotalPrice(newTotalPrice);
    }
  }
  function removeItem(e) {
    let newCartData = cartData;
    newCartData.orderProducts.splice(e.target.value - 1, 1);
    setCartData(newCartData);
    setCartCount((prev) => prev - 1);
    localStorage.setItem("productsData", JSON.stringify(productData));
    localStorage.setItem("cartData", JSON.stringify(cartData));
    let newTotalPrice = 0;
    for (let i = 0; i < newCartData.orderProducts.length; i++) {
      let prod = newCartData.orderProducts[i];
      newTotalPrice += prod.quantity * prod.product.price;
    } 
    setCartTotalPrice(newTotalPrice);
  }
  const goRight = (ref) => {
    ref.current.scrollBy(308, 0);
  };
  const goLeft = (ref) => {
    ref.current.scrollBy(-308, 0);
  };
  const showItems = (prod) => {
    let result = prod.map((product) => {
      let stars = [];
      let ratingCount = 0;
      for (let i = 0; i < 5; i++) {
        if (ratingCount >= product.rating) {
          stars.push(<i key={i} className="fa-regular fa-star"></i>);
        } else {
          stars.push(<i key={i} className="fa-solid fa-star"></i>);
        }
        ratingCount++;
      }
      return (
        <div className="product" key={product.id}>
          <div className="top">
            <img src={product.images[0]} alt="Product" />
          </div>
          <div className="bottom">
            <div className="title-view">
              <h1 className="title">{product.title}</h1>
              <Link to={`/product/${product.id}`}>View</Link>
            </div>
            <div className="rating">
              <div className="stars">
                {stars} 
              </div>
            </div>
            <p className="description">{product.description}</p>
            <div className="price-count">
              <p className="price">Price: ${product.price}</p>
              <p className={`count ${product.amount >= 5 ? "high" : "low"}`}>
                {product.amount} In Stock
              </p>
            </div>
          </div>
        </div>
      );
    });
    return result;
  };

  const addAllToDB = (prod) => {

  }
  const value = {
    searchValue,
    cartData,
    setCartData,
    cartTotalPrice,
    setCartTotalPrice,
    productData,
    setProductData,
    cartCount,
    setCartCount,
    notificationCount,
    setNotificationCount,
    favoriteList,
    setfavoriteList,
    showItems,
    addToCart,
    getStars,
    userData,
    setUserData,
    checkOut,
    setCheckOut,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    randomSortedProductData,
    getArrows,
    ordersData,
    setOrdersData,
    cancelOrder,
    sendNotification,
    notificationList,
    setNotificationList,
    currentLocation,
    filteredData,
    setFilteredData,
    searchProduct,
    isLogin,
    setIsLogin,
    showLogin,
    setShowLogin,
    currentUser,
    setCurrentUser,
  };
  return (
    <appContext.Provider value={value}>{props.children}</appContext.Provider>
  );
}
