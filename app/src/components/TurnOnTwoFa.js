import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import x from "../assets/svgs/whitex.svg";
import { apiurl } from "../config/globalVariables";
import { handleStartEnableTwoFa } from "../pages/Settings";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { changecheckedstate } from "./TwoFaComponent";

function TurnOnTwoFa({ userid, username }) {
  const [url, setUrl] = useState();
  const [secret, setSecret] = useState();

  const twofacode = useRef();
  const handleStartEnableTwoFaClick = async () => {
    if (
      twofacode.current.value == " " ||
      twofacode.current.value == "" ||
      isNaN(twofacode.current.value)
    )
      return;
    // console.log(twofacode.current.value);
    // console.log(secret);
    axios
      .post(apiurl + "turnontwofa", {
        key: twofacode.current.value,
        secret: secret,
        myid: userid,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
          handleStartEnableTwoFa(false);
          changecheckedstate(true);
        } else {
          toast.error(res.data.message);
        }
      });
  };

  useEffect(() => {
    const func = async () => {
      const res = await axios.get(apiurl + "generateqrcode");
      console.log(res);
      setUrl(res.data.qrcodedeurl);
      setSecret(res.data.seecret);
    };
    func();
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(135, 135, 135, 0.5)",
        zIndex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
      }}
    >
      <div
        style={{
          width: "50%",
          height: "60%",
          backgroundColor: "rgba(97, 45, 209, 0.95)",
          position: "relative",
          borderRadius: 25,
          color: "white",
          textAlign: "center",
          fontFamily: "Roboto, sans-serif",
          fontSize: 24,
          border: "3px solid #fff",
        }}
      >
        <img
          src={x}
          style={{
            position: "absolute",
            right: 13,
            top: 13,
            cursor: "pointer",
          }}
          onClick={() => handleStartEnableTwoFa(false)}
        />
        <div
          style={{
            padding: 20,
            height: "95%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 30 }}>Turn on 2FA</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "40%",
                height: "100%",
                // backgroundColor: "green",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{ width: "80%" }}
                // src="https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/core_market_full/generator/dist/generator/assets/images/websiteQRCode_noFrame.png"
                src={url}
              />
            </div>
            <div
              style={{
                width: "60%",
                height: "100%",
                // backgroundColor: "rebeccapurple",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "column",
              }}
            >
              <div>Type here the code</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexDirection: "column",
                  height: "50%",
                  gap: 20,
                }}
              >
                <input
                  style={{
                    width: "80%",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    borderBottom: "2px solid rgb(212, 212, 212)",
                    fontSize: 26,
                    color: "white",
                    opacity: 1,
                    textAlign: "center",
                  }}
                  ref={twofacode}
                  // placeholder="Type here the code"
                  type="text"
                />

                <div
                  style={{
                    width: "50%",
                    height: 50,
                    backgroundColor: "red",
                    backgroundColor: "#6E00FF",
                    border: "1px solid #FFFFFF",
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    cursor: "pointer",
                  }}
                  onClick={() => handleStartEnableTwoFaClick()}
                >
                  Save
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TurnOnTwoFa;
