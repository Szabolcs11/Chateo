import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiurl } from "../../config/globalVariables";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
          setIsLoading(false);
          navigate("/auth");
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
          <div className="Auth-Container-Title">Reset Password</div>

          <div className="SeparatorLine"></div>

          <div className="Auth-Main-Content">
            <input
              type="password"
              placeholder="Password"
              className="Auth-Input"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="Auth-Input"
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
            />
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <div
                className="Auth-Main-Button"
                onClick={() => {
                  setIsLoading(true);
                  handleResetPassword();
                  // handleRegister(regFullName, regEmail, regPassword, confirmRegPassword);
                }}
              >
                Reset Password
              </div>
            )}
            {/* <div className="Auth-Main-Button" onClick={() => handleResetPassword()}>
              Reset Password
            </div> */}
          </div>
        </div>
      </div>
    </div>
    // <div>
    //   <div className="Auth-Main">
    //     <input placeholder="new password" type="password" onChange={(e) => setPassword(e.target.value)} />
    //     <br></br>
    //     <input placeholder="new password again" type="password" onChange={(e) => setPasswordConfirm(e.target.value)} />
    //     <div onClick={() => handleResetPassword()}>
    //       <button>Reset</button>
    //     </div>
    //   </div>
    // </div>
  );
}

export default ResetPassword;
