import './orderdetail.scss';
import { useState, useEffect, useContext } from 'react';
import { editOrderStatus, getOrder } from '../../services/order.service';
import { useParams } from 'react-router-dom';
import { Link, useLocation } from "react-router-dom";

export default function OrderDetail() {
    const { orderId } = useParams();
    const [order, setOrder] = useState();
    const [status, setStatus] = useState("");
    const [statusTypes, setStatusTypes] = useState(["Processing", "Shipping", "Completed"]);
    
    useEffect(() => {
        const fetchOrder = async () => {
            const data = await getOrder(orderId);
            setOrder(data);
        }
        fetchOrder();
    }, []);
    
    const handleChangeStatus = (e) => {
        let newStatus = e.target.value;
        console.log("Changing Status to: " + newStatus);
        setStatus(newStatus);
    }
    return (
        <div className='order-detail'>
            {order && (<div className='order-container'>
                <div className='left'>
                    <div className='top'>
                        <strong>Order ID: {order.id}</strong>
                        <br />
                        {order.date}
                        <br />
                        <strong>Order Status: </strong> {order.orderStatus}
                        <br />
                        <strong>Total Price: </strong> ${order.totalPrice}
                    </div>
                    <div className='bottom'>
                        <label className='label'><strong>Edit Status</strong></label>
                        <select className='select' onChange={e => handleChangeStatus(e)}>
                            {statusTypes && statusTypes.map((status)=>{
                                return (
                                    <option value={status} key={status}>{status}</option>
                                )
                            })}
                        </select>
                        <button
                            className='button'
                            onClick={() => editOrderStatus(status, orderId)}
                        >Submit</button>
                    </div>
                </div>
                <div className='right'>
                    <div className='title'> <strong> Order Items </strong> </div>
                    <hr></hr>
                    {order && order.orderProducts.map((prod) => {
                        let product = prod.product;
                        return (
                            <div key={prod.id}>
                                <div className="order-item">
                                    <div className="left">
                                        <div className="image">
                                            <img src={product.images[0]} alt="order-item" />
                                        </div>
                    
                                    </div>
                                    <div className="center">
                                            <Link to={`/product/${product.id}`}>
                                                <h3 className="title">{product.title}</h3>
                                            </Link>
                                            <div className="price-count">
                                                <p className="price">Price: ${product.price} </p>
                                                <p className="count">Quantity: {prod.quantity}</p>
                                            </div>
                                        </div>
                                    <div className="right">
                                        <Link to={`/product/${product.id}`}>
                                            <button>View Product</button>
                                        </Link>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        );
                    })}
                </div>
            </div>)}
        </div>
    )
}