import React from "react";
import { useNavigate } from "react-router-dom";
import error404 from "../assets/svgs/404.svg";
import style from "../styles/404Style.css";

function Error404() {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "90%" }}>
        <img
          style={{ width: "100%", height: "100%" }}
          alt="ImgNotFound"
          src={error404}
        />
      </div>
      <div
        style={{
          fontFamily: "Roboto, sans-serif",
          textAlign: "center",
          marginTop: 50,
          fontSize: 50,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          onClick={() => handleRedirect()}
          className="errorbutton"
          style={{
            width: "20%",
            backgroundColor: "#5d17a4",
            borderRadius: 25,
            color: "white",
            cursor: "pointer",
            fontSize: 40,
            padding: 10,
          }}
        >
          Go To Home Page
        </div>
      </div>
    </div>
  );
}

export default Error404;
