import React from "react";
import { useNavigate } from "react-router-dom";
function EmailVerifyResponse() {
  const navigate = useNavigate();
  return (
    <div className="Auth-Main">
      <p>Succesfull email verification</p>
      <div onClick={() => navigate("/auth")}>
        <p>Go to login</p>
      </div>
    </div>
  );
}

export default EmailVerifyResponse;
