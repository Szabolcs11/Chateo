import React, { useEffect, useState } from "react";
import telephone from "../assets/svgs/telephone.svg";
import camera from "../assets/svgs/camera.svg";
import other from "../assets/svgs/other.svg";
import person1 from "../assets/images/person1.png";
import { apiurl } from "../config/globalVariables";
import axios from "axios";
import style from "../styles/HeaderStyle.css";
import { handleFriendDelete } from "./Persons";
import { toast } from "react-toastify";

export let updateheaderstatus;

function HeaderComponent({ myid, avatar, partnername, status, partnerid }) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [showDeleteFriend, setShowDeleteFriend] = useState(false);

  useEffect(() => {
    setShowDeleteFriend(false);
    setCurrentStatus(status);
    forceUpdate();
  }, [partnername]);
  let [currentStatus, setCurrentStatus] = useState(status);

  updateheaderstatus = (status) => {
    setCurrentStatus(status);
  };

  const handleDeleteFriend = () => {
    console.log(partnerid);
    setShowDeleteFriend(false);
    axios
      .post(apiurl + "deletefriend", {
        myid: myid,
        partnerid: partnerid,
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
        handleFriendDelete(res.data.friendid);
      });
  };

  return (
    <div className="main-container-header">
      <div className="main-container-main">
        <div className="main-container-header-left">
          <div className="main-container-header-avatar-container">
            <img
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
        <div
          className="main-container-header-right"
          style={{ position: "relative" }}
        >
          <img src={telephone} style={{ cursor: "pointer" }} />
          <img src={camera} style={{ cursor: "pointer" }} />
          <div
            onClick={() => {
              setShowDeleteFriend(!showDeleteFriend);
            }}
          >
            <img src={other} style={{ cursor: "pointer" }} />
          </div>
          {showDeleteFriend && currentStatus && (
            <div
              className="DeleteFriendContainer"
              onClick={() => {
                handleDeleteFriend();
              }}
            >
              <div className="DeleteFriendStyle">Delete friend</div>
            </div>
          )}
        </div>
      </div>
      <div className="header-devider-container">
        <div className="header-devider"></div>
      </div>
    </div>
  );
}

export default HeaderComponent;
