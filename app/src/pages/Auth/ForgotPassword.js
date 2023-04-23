import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiurl } from "../../config/globalVariables";

function ForgotPassword() {
  const [email, setEmail] = useState();

  const handleForgotPassword = () => {
    console.log(email);
    axios
      .post(apiurl + "forgot-password", {
        email: email,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
        console.log(res);
      });
  };

  return (
    <div>
      <div className="Auth-Main">
        <input onChange={(e) => setEmail(e.target.value)} type="email" />
        <div>
          <button onClick={handleForgotPassword}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
