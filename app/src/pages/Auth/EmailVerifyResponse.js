import React from "react";
import { useNavigate } from "react-router-dom";
function EmailVerifyResponse() {
  const navigate = useNavigate();
  return (
    <div className="Auth-Container">
      <div className="Auth-Main">
        <div className="Auth-Content">
          <div className="Auth-Container-Title">Successfull email verification</div>

          <div className="SeparatorLine"></div>

          <div className="Auth-Main-Content">
            <div style={{ fontFamily: "roboto", fontSize: 22, color: "#20a090" }}>You can now login</div>
            <a href="/auth" className="Auth-Main-Button" onClick={() => {}}>
              Login
            </a>
          </div>
        </div>
      </div>
      {/* <p>Succesfull email verification</p>
      <div onClick={() => navigate("/auth")}>
        <p>Go to login</p>
      </div> */}
    </div>
  );
}

export default EmailVerifyResponse;
