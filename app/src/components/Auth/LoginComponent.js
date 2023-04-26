import React, { useState } from "react";
import { handleLogin } from "../../App";
import { changeAuthPage } from "../../pages/Auth/Auth";

function LoginComponent() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  return (
    <div className="Auth-Main">
      <div className="Auth-Content">
        <div className="Auth-Container-Title">Login</div>

        <div className="SeparatorLine"></div>

        <div className="Auth-Main-Content">
          <input
            type="email"
            placeholder="Email"
            className="Auth-Input"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="Auth-Input"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <div className="forgotpassword">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <div className="Auth-Main-Button" onClick={() => handleLogin(email, password)}>
            Login
          </div>
          <div className="Auth-Main-Button" onClick={() => changeAuthPage("register")}>
            Register
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
