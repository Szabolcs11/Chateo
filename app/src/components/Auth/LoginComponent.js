import React, { useState } from "react";
import { handleLogin } from "../../App";
import { changeAuthPage } from "../../pages/Auth/Auth";

function LoginComponent() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  return (
    <div className="Auth-Main">
      <div className="Auth-Content">
        <div className="Auth-Container-Title">Login</div>

        <div className="SeparatorLine"></div>

        <div className="Auth-Main-Content">
          <input
            type="text"
            placeholder="Username"
            className="Auth-Input"
            onChange={(e) => {
              setUsername(e.target.value);
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

          <div
            className="Auth-Main-Button"
            onClick={() => handleLogin(username, password)}
          >
            Login
          </div>
          <div
            className="Auth-Main-Button"
            onClick={() => changeAuthPage("register")}
          >
            Redirect to Register
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
