import React, { useState } from "react";
import { handleRegister } from "../../App";
import { changeAuthPage } from "../../pages/Auth/Auth";
import LoadingComponent from "../LoadingComponent";

export let registerresponse;

function RegisterComponent() {
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmRegPassword, setConfirmRegPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  registerresponse = () => {
    setIsLoading(false);
  };

  return (
    <div className="Auth-Main">
      <div className="Auth-Content">
        <div className="Auth-Container-Title">Register</div>

        <div className="SeparatorLine"></div>

        <div className="Auth-Main-Content">
          <input
            type="email"
            placeholder="E-mail"
            className="Auth-Input"
            onChange={(e) => {
              setRegEmail(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Full Name"
            className="Auth-Input"
            onChange={(e) => {
              setRegFullName(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="Auth-Input"
            onChange={(e) => {
              setRegPassword(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="Auth-Input"
            onChange={(e) => {
              setConfirmRegPassword(e.target.value);
            }}
          />
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <div
              className="Auth-Main-Button"
              onClick={() => {
                setIsLoading(true);
                handleRegister(regFullName, regEmail, regPassword, confirmRegPassword);
              }}
            >
              Register
            </div>
          )}
          <div className="Auth-Main-Button" onClick={() => changeAuthPage("login")}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterComponent;
