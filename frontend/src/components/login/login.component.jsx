import React, { Component, useContext, useEffect, useState } from "react";
import { appContext } from "../../context/AppContext";
import { AuthProvider, useAuth } from "../../services/auth.service";

import "./login.component.scss";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

export default function Login() {
  const {
    setShowLogin,
    setIsLogin,
  } = useContext(appContext)
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    password: ""
  });

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    login(formData.username, formData.password).then(
      () => {
        setShowLogin(false);
        setIsLogin(true);
        setLoading(false);
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  }

  return (
    <div className="user-login-container">
      <img
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        alt="profile-img"
        className="profile-img-card"
      />

      <form
        onSubmit={handleLogin}
      >
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            type="text"
            className="form-field"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            validations={[required]}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            className="form-field"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            validations={[required]}
          />
        </div>

        <div className="form-group">
          <button
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Login</span>
          </button>
        </div>

        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
        <button
          style={{ display: "none" }}

        />
      </form>
    </div>
  );
}