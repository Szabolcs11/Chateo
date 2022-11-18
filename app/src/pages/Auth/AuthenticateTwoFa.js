import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import style from "./../../styles/AuthenticateTwoFa.css";
import security from "./../../assets/svgs/security.svg";
import axios from "axios";
import { apiurl } from "../../config/globalVariables";
import { useNavigate } from "react-router-dom";
import { handleTwoFaLogin } from "../../App";

function AuthenticateTwoFa() {
  let { key } = useParams();
  const [code, setCode] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (code == undefined || code == "" || code == " ") return;
    handleVerifyCode();
  }, [code]);

  const handleVerifyCode = () => {
    axios
      .post(apiurl + "verifytwofa", {
        key: key,
        token: code,
      })
      .then((res) => {
        if (res.data.urlerror) {
          navigate("/");
          return;
        }
        if (res.data.succes) {
          handleTwoFaLogin(res.data.user, res.data.token);
        }
      });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 600,
          height: 400,
          backgroundColor: "#6e00ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Roboto, sans-serif",
          fontSize: 24,
          color: "white",
          borderRadius: 20,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          <div style={{ textAlign: "center", fontSize: 28, fontWeight: 500 }}>
            Enter Two-Factor Authentication code
          </div>
          <div
            style={{
              width: "100%",
              height: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <div>
              <img src={security} />
            </div>
            <div>
              <input
                onChange={(e) => setCode(e.target.value)}
                placeholder="Type here the code"
                className="Input-Field"
                type="text"
              />
            </div>
            <div onClick={() => handleVerifyCode()} className="Verify-Button">
              Verify
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticateTwoFa;
