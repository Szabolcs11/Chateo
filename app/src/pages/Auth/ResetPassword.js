import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiurl } from "../../config/globalVariables";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const navigate = useNavigate();
  const handleResetPassword = () => {
    console.log(password);
    console.log(passwordConfirm);
    console.log(token);
    axios
      .post(apiurl + "reset-password", {
        Token: token,
        Password: password,
        PasswordConfirm: passwordConfirm,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
          navigate("/auth");
        } else {
          toast.error(res.data.message);
        }
      });
  };
  return (
    <div>
      <div className="Auth-Main">
        <input placeholder="new password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <br></br>
        <input placeholder="new password again" type="password" onChange={(e) => setPasswordConfirm(e.target.value)} />
        <div onClick={() => handleResetPassword()}>
          <button>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
