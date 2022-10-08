import React, { useEffect, useState } from "react";
import telephone from "../assets/svgs/telephone.svg";
import camera from "../assets/svgs/camera.svg";
import other from "../assets/svgs/other.svg";
import person1 from "../assets/images/person1.png";
import { apiurl } from "../config/globalVariables";
import axios from "axios";

export let updatestatus;

function HeaderComponent({ avatar, partnername, status, partnerid }) {
  // console.log(partnerid);
  // let [currentStatus, setCurrentStatus] = useState(
  //   JSON.parse(status || {}).Status
  // );

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  let [currentStatus, setCurrentStatus] = useState(status);

  updatestatus = (status) => {
    setCurrentStatus(status);
  };

  // const checkstatuses = () => {
  //   setTimeout(() => {
  //     axios
  //       .post(apiurl + "checkuserstate", {
  //         UserID: partnerid,
  //       })
  //       .then((res) => {
  //         console.log(res.data);
  //         if (res.data.succes) {
  //           let st = JSON.parse(res.data.userdata.Status);
  //           console.log(st);
  //           setCurrentStatus(st.Status);
  //           // status = st.Status;
  //         }
  //       });
  //     checkstatuses();
  //   }, 1000);
  // };

  // useEffect(() => {
  //   checkstatuses();
  // }, []);

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
            <div style={{ display: "flex", gap: 7 }}>
              {status && (
                <>
                  <div
                    style={{
                      height: 20,
                      width: 20,
                      backgroundColor:
                        currentStatus == "Offline"
                          ? "#7C7C7C"
                          : currentStatus == "Away"
                          ? "#F3B559"
                          : currentStatus == "Online"
                          ? "#61FF00"
                          : "#fff",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div className="main-container-header-partner-status">
                    {currentStatus}
                  </div>
                </>
              )}
            </div>
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
