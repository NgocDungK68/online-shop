import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckOut from "./components/checkout/CheckOut.jsx";
import Footer from "./components/footer/Footer.jsx";
import Login from "./components/login/login.component.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import ProductDetail from "./components/productdetail/ProductDetail.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import Home from "./pages/home/Home.jsx";
import ProductPage from "./pages/products/ProductsPage.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Order from "./pages/orders/Order.jsx"
import OrderDetail from "./components/orderdetail/OrderDetail.jsx";
import { AuthProvider, useAuth, AuthContext} from "./services/auth.service.jsx";
import "./style/app.scss";
import "./style/darkMode.scss";
import SignUp from "./components/signup/SignUp.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("darkMode") !== null) {
      setDarkMode(JSON.parse(localStorage.getItem("darkMode")));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  const { user, login, logout, setUser } = useAuth();
  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <AuthProvider>
        <AppContextProvider>
          <BrowserRouter>
            <Navbar setDarkMode={setDarkMode} />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/orders" element={<Order />}/>
              <Route path="/order/:orderId" element={<OrderDetail/>}/> 
              <Route path="/signup" element={<SignUp></SignUp>}/>
            </Routes>
            <Footer />
            <CheckOut />
          </BrowserRouter>
        </AppContextProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
