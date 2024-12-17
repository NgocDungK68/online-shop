import axios from "axios";
import authHeader from "./auth-header";

const ORDER_API_BASE_URL = "http://localhost:8082/api/order";


const submitOrder = async(cartData) => {
    try {
        console.log("Submitting Order");
        console.log(cartData)
        const response = await axios.post(ORDER_API_BASE_URL, cartData, {headers : authHeader() });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}


const getOrders = async() => {
    try{
        console.log("Fetching Orders");
        const response = await axios.get(ORDER_API_BASE_URL, {headers: authHeader()});
        console.log(response.data);
        return response.data;
    } catch(error){
        console.error(error);
    }
}

const getOrder = async(orderId) => {
    try{    
        console.log(orderId);
        const response = await axios.get(ORDER_API_BASE_URL + '/' + orderId, {headers: authHeader()});
        console.log(response.data);
        return response.data;
    } catch(error){
        console.error(error);
    }
}

const editOrderStatus = async(status, orderId) => {
    try{
        console.log(status);
        const response = await axios.put(ORDER_API_BASE_URL + '/' + orderId + "/status", {newStatus : status}, {headers: authHeader()});
        console.log(response.data);
    } catch(error){
        console.error(error);
    }
}

export {submitOrder,getOrders,getOrder,editOrderStatus};