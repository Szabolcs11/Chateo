import React, { useEffect, useState } from "react";
import twofa from "./../assets/images/TwoFactor.png";
import style from "./../styles/TwoFaComponent.css";
// import style from "../styles/ChatComponent.css";

function TwoFaComponent() {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    console.log(checked);
  }, [checked]);

  return (
    <div
      style={{
        maxWidth: 500,
        height: 200,
        backgroundColor: "#6E00FF",
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
                onChange={() => setChecked(!checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoFaComponent;
