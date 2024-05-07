import React, { useState } from "react";

import "./login.css";

const Login = ({ handleClose }) => {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  const handleLoginInput = (e) => {
    const { id, value } = e.target;
    setLogin((prevLogin) => ({
      ...prevLogin,
      [id]: value,
    }));
  };

  const handleRegisterInput = (e) => {
    const { id, value } = e.target;
    setRegister((prevRegister) => ({
      ...prevRegister,
      [id]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const body = JSON.stringify(login);
      const request = await fetch(
        "https://localhost:44321/api/Authentication/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
        }
      )
        .then(async (response) => {
          if (response.status === 200) {
            setLoginError("Login successful!");
            const userData = await response.json();
            window.localStorage.setItem("jwt", userData.token);
            window.localStorage.setItem("user", userData.username);
            window.location.reload();
          } else {
            setLoginError(response.title);
          }
        })
        .catch((error) => console.log(error));
    } catch (e) {
      console.log("Fetching Error");
    }
  };

  const handleRegister = async () => {
    try {
      const body = JSON.stringify(register);
      const request = await fetch(
        "https://localhost:44321/api/Authentication/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setRegisterError("Registration successful!");
          } else {
            setRegisterError(response.title);
          }
        })
        .catch((error) => console.log(error));
    } catch (e) {
      console.log("Fetching Error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-inner">
        <div className="login-content">
          <div className="login-x" onClick={() => handleClose()}>
            X
          </div>
          <div className="login-form">
            <div>Enter your information to login</div>
            <input
              placeholder="Username"
              id="username"
              type="text"
              value={login.username}
              onChange={handleLoginInput}
              className="login-input"
            />
            <input
              placeholder="Password"
              id="password"
              type="password"
              value={login.password}
              onChange={handleLoginInput}
              className="login-input"
            />
            {loginError && <div>{loginError}</div>}
            <div className="button" onClick={() => handleLogin()}>
              LOGIN
            </div>
          </div>
          <div className="divider-vertical"></div>
          <div className="login-form">
            <div>Register a new account</div>
            <input
              placeholder="Username"
              id="username"
              type="text"
              value={register.username}
              onChange={handleRegisterInput}
              className="login-input"
            />
            <input
              placeholder="Email"
              id="email"
              type="text"
              value={register.email}
              onChange={handleRegisterInput}
              className="login-input"
            />
            <input
              placeholder="Password"
              id="password"
              type="password"
              value={register.password}
              onChange={handleRegisterInput}
              className="login-input"
            />
            {registerError && <div>{registerError}</div>}
            <div className="button" onClick={() => handleRegister()}>
              REGISTER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
