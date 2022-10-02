import React, { useState } from "react";
import GlobalStyle from "../styles/GlobalStyle.css";
import { useNavigate, Navigate } from "react-router-dom";
import style from "../styles/HomeStyle.css";
import waiting from "../assets/svgs/Waiting.svg";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="main-container">
      <div style={{ height: "80%" }}>
        <img
          style={{ width: "100%", height: "100%" }}
          alt="NoImgFound"
          src={waiting}
        />
      </div>
      <div className="titletext">Home</div>
      <div className="subtitletext">Coming Soon</div>
    </div>
  );
}

export default Home;
