import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiurl } from "../../config/globalVariables";
import LoadingComponent from "../../components/LoadingComponent";

function ForgotPassword() {
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const handleForgotPassword = () => {
    console.log(email);
    axios
      .post(apiurl + "forgot-password", {
        email: email,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
          setIsLoading(false);
        } else {
          toast.error(res.data.message);
          setIsLoading(false);
        }
      });
  };

  return (
    <div className="Auth-Container">
      <div className="Auth-Main">
        <div className="Auth-Content">
          <div className="Auth-Container-Title">Forgot password</div>

          <div className="SeparatorLine"></div>

          <div className="Auth-Main-Content">
            <div style={{ fontFamily: "roboto", fontSize: 22, color: "#20a090" }}>Enter your email address</div>
            <input
              type="email"
              placeholder="Email"
              className="Auth-Input"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <div
                className="Auth-Main-Button"
                onClick={() => {
                  handleForgotPassword();
                  setIsLoading(true);
                }}
              >
                Reset password
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
