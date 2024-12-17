import axios from "axios";
import authHeader from "./auth-header";
const PRODUCT_API_BASE_URL = "http://localhost:8082/api/productdata";

const getProducts = async () => {
    try {
        const response = await axios.get(PRODUCT_API_BASE_URL, { headers: authHeader() } );
        //console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Could not fetch products with error: " + error);
    }
}

const getProduct = async (id) => {
    try {
        const response = await axios.get(PRODUCT_API_BASE_URL + '/' + id, { headers: authHeader() } );
        console.log("Getting individual product");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Could not fetch product with error: " + error);
    }
}

const createProduct = async (product) => {
    try {
        console.log(product);
        const response = await axios.post(PRODUCT_API_BASE_URL, product, {headers : authHeader() });
        console.log(response.data);
        //setProductData([...productData, response.data]); // Update local state
    } catch (error) {
        console.error(error);
    }
}

const createProducts = async (products) => {
    try {
        console.log(products);
        const response = await axios.post(PRODUCT_API_BASE_URL + "/batch", products , {headers : authHeader() });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const updateProduct = async (product) => {
    try{
        productId = product.id;
        const response = await axios.post(PRODUCT_API_BASE_URL + '/' + productId, product, {headers : authHeader()});
        console.log(response.data);
    } catch(error){
        console.log(error);
    }
}

export {createProduct, createProducts, getProduct, getProducts, updateProduct};