import axios from "axios";
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
const API_URL = "http://localhost:8082/api/auth/";

const initialState = {
  currentUser: null,
  setCurrentUser: (user) => { },
};

const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    // Check for existing user in localStorage on initial render
    () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      const user = JSON.parse(storedUser);
      const token = user.accessToken; 
      //console.log(token);
      const decodedJwt = jwtDecode(token);
      //console.log(decodedJwt.exp*1000 + " " + Date.now());
      if (decodedJwt.exp * 1000 < Date.now()) {
        localStorage.removeItem("user");
        return null;
      }
      return user;
    }
  );

  const login = async (username, password) => {
    try {
      const response = await axios.post(API_URL + "signin", {
        username,
        password,
      });

      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setCurrentUser(response.data);
      }else{
        signup(username,password);
      }

      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw for handling in calling component
    }
  };

  const signup = async (userDetail) => {
    try{
      console.log(userDetail);

      const response = await axios.post(API_URL + "signup", userDetail)

      console.log(response.data.message);
      if(response.data.message == "User registered successfully!"){
        login(userDetail.username,userDetail.password);
      }

      return response.data;
    } catch (error){
      throw error;
    }
  }
  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
