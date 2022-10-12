import React, { useRef, useState } from "react";
import x from "../assets/svgs/whitex.svg";
import { ToastContainer, toast } from "react-toastify";
import { handleStartDisableTwoFa } from "../pages/Settings";
import openlock from "../assets/svgs/openlock.svg";
import axios from "axios";
import { apiurl } from "../config/globalVariables";
import { changecheckedstate } from "./TwoFaComponent";

function TurnOffTwoFa({ userid }) {
  const handleDisableTwoFa = () => {
    if (
      inputref.current.value == " " ||
      inputref.current.value == "" ||
      isNaN(inputref.current.value)
    )
      return;
    axios
      .post(apiurl + "turnofftwofa", {
        myid: userid,
        key: inputref.current.value,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.succes) {
          handleStartDisableTwoFa(false);
          changecheckedstate(false);
        }
      });
  };
  const inputref = useRef();
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
          onClick={() => handleStartDisableTwoFa(false)}
        />
        <div
          style={{
            padding: 20,
            height: "95%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 30 }}>Turn off 2FA</div>
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
                style={{ width: "80%", marginBottom: 20 }}
                // src="https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/core_market_full/generator/dist/generator/assets/images/websiteQRCode_noFrame.png"
                src={openlock}
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
                  ref={inputref}
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
                  onClick={() => handleDisableTwoFa()}
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

export default TurnOffTwoFa;
