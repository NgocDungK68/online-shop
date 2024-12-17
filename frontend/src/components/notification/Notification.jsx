import React from "react";
import "./notification.scss";
import { useContext, useEffect, useRef } from "react";
import { appContext } from "../../context/AppContext";
export default function Notification(props) {
  const { notificationList, setNotificationList } = useContext(appContext);
  const msgRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      msgRef.current.style.transform = " translateX(-520px)";
    }, 10);
    setTimeout(() => {
      msgRef.current.style.transform = " translateX(0)";
    }, 5000);
    setTimeout(() => {
      let newList = notificationList;
      newList.splice(
        newList.find((key) => key.id === props.index),
        1
      );
      setNotificationList(newList);
    }, 6000);
  }, []);
  return (
    <div ref={msgRef} className={`notification-msg`}>
      <div className="top">
        <i className="fa-solid fa-bell"></i>
        <p>{props.msg}</p>
      </div>
      <p>{props.item}</p>
    </div>
  );
}
