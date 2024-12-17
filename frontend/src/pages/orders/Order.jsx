import { useEffect, useContext, useRef, useState, } from "react";
import "./order.scss";
import { appContext } from "../../context/AppContext";
import { getOrders } from "../../services/order.service";
import { Link } from "react-router-dom";

const APIkey =  "e3625de056244a2ab281799fba491185";

const Order = () => {
    const {
        ordersData
    } = useContext(appContext);
    const [orderData, setOrderData] = useState();
    const [tabs, setTabs] = useState([
        { name: "All Orders", link: "/all" },
        { name: "Wishlist", link: "/wishlist" },
        { name: "Buy Again", link: "/buyagain" },
        { name: "Bookmarked", link: "/bookmarked" }
    ]);

    const [currentTab, setCurrentTab] = useState();
    useEffect(() => {
        if (!currentTab) {
            setCurrentTab(tabs[0]);
        }
    }, [])
    useEffect(() => {
        const fetchOrderData = async () => {
            const fetchedOrderData = await getOrders();
            setOrderData(fetchedOrderData);
        }
        fetchOrderData();
    }, []);
    useEffect(() => {
        if (orderData) {
            console.log(orderData[0]);
        }
    }, [orderData]);
    const changeTabs = (tab) => {
        setCurrentTab(tab);
    }
    const count = useRef(0);
    count.current = 0;
    return (
        <div className="order-page">
            <div className="order-header">
                Manage Your Orders
            </div>
            <div className="order-container">
                <ul className="order-tab-list">
                    {currentTab && tabs.map((tab) => {
                        return (
                            <li className="order-tab" role="tab" key={tab.name}>
                                {currentTab.name == tab.name ? <a className="a-link-normal selected">{tab.name}</a> : <a className="a-link-normal" onClick={() => changeTabs(tab)}>{tab.name}</a>}
                            </li>
                        )
                    })}

                </ul>
                <div className="order-header-section">
                    <div className="date">Date</div>
                    <div className="details">Order Details</div>
                    <div className="status">Status</div>
                </div>
                <div className="order-list">
                    {orderData && orderData.map((order) => {
                        let products = order.orderProducts;
                        return (
                            <div key={order.id}>
                                <div className="order-item">
                                    <div className="left">
                                        <div className="date">
                                            {order.date}
                                        </div>
                                        <div className="details">
                                            <div className="price">Total Price: ${order.totalPrice}</div>
                                            <div className="address">Address: {order.shipmentDetails.shipTo}</div>
                                        </div>
                                        <div className="status">
                                            {order.orderStatus}
                                        </div>
                                    </div>
                                    <div className="right">
                                        {/*{orderProducts.map((prod) => {
                                            return (
                                                <div className="order-product">
                                                    ProductID: {prod.id}
                                                </div>
                                            );
                                        })}*/}
                                        <Link to={`/order/${order.id}`}>
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        );
                    })}
                </div>
               
            </div>
        </div>
    );
};

export default Order;
