import React from "react";
import telephone from "../assets/svgs/telephone.svg";
import camera from "../assets/svgs/camera.svg";
import other from "../assets/svgs/other.svg";
import person1 from "../assets/images/person1.png";
import { apiurl } from "../config/globalVariables";

function HeaderComponent({ avatar, partnername, status }) {
  return (
    <div className="main-container-header">
      <div className="main-container-main">
        <div className="main-container-header-left">
          <div className="main-container-header-avatar-container">
            <img
              // src={avatar}
              src={apiurl + "UsersProfileImg/" + avatar}
              style={{ width: "75px", height: "75px", borderRadius: "50%" }}
            />
          </div>
          <div className="main-container-header-partner-datas">
            <div className="main-container-header-partner-name">
              {partnername}
            </div>
            <div className="main-container-header-partner-status">{status}</div>
          </div>
        </div>
        <div className="main-container-header-right">
          <img src={telephone} style={{ cursor: "pointer" }} />
          <img src={camera} style={{ cursor: "pointer" }} />
          <img src={other} style={{ cursor: "pointer" }} />
        </div>
      </div>
      <div className="header-devider-container">
        <div className="header-devider"></div>
      </div>
    </div>
  );
}

export default HeaderComponent;
