import React from "react";
import "./footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div className="left">
        <h3>Attribution to Fady Magdy, <a href="https://www.vecteezy.com/">Vecteezy</a>  </h3>
      </div>
      <div className="right">
        <a href="https://www.linkedin.com/in/fady-magdy-dev/">
          <i className="fa-brands fa-linkedin"></i>
        </a>
        <a href="https://github.com/Fady-Magdy">
          <i className="fa-brands fa-github"></i>
        </a>
        <a href="https://www.facebook.com/fady.magdy.dev">
          <i className="fa-brands fa-square-facebook"></i>
        </a>
      </div>
    </div>
  );
};

export default Footer;
