import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiurl } from "../config/globalVariables";
import {
  handleStartDisableTwoFa,
  handleStartEnableTwoFa,
} from "../pages/Settings";
import twofa from "./../assets/images/TwoFactor.png";
import style from "./../styles/TwoFaComponent.css";
import TurnOnTwoFa from "./TurnOnTwoFa";

export let changecheckedstate;

function TwoFaComponent({ userid }) {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    axios
      .post(apiurl + "gettwofastatus", {
        myid: userid,
      })
      .then((res) => {
        if (res.data.succes) {
          setChecked(res.data.secret);
        }
      });
  }, []);

  // Lekerni van e 2fa ja aktivalva

  const handleChange = (ch) => {
    if (ch == true) {
      handleStartEnableTwoFa(ch);
    } else {
      handleStartDisableTwoFa(true);
    }
  };

  changecheckedstate = (state) => {
    setChecked(state);
  };

  return (
    <>
      <div
        style={{
          maxWidth: 500,
          height: 200,
          // backgroundColor: "#6E00FF",
          backgroundColor: "#20a090",
          borderRadius: 25,
          display: "flex",
          alignItems: "center",
          // justifyContent: "space-around",
          boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            padding: 20,
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={twofa} style={{ width: 150, height: 150 }} />
          </div>

          <div
            style={{
              width: "50%",
              height: "100%",
              color: "white",
              fontFamily: "Roboto, sans-serif",
              fontSize: 25,
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <div>Turn on 2-Step Verification</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    handleChange(!checked);
                  }}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TwoFaComponent;
