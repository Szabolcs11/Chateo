import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserDatasComponent from "../components/UserDatasComponent";
import { apiurl } from "../config/globalVariables";
import stlye from "../styles/SettingsStyle.css";

function Settings(props) {
  const [currPass, setCurrPass] = useState();
  const [newPass, setNewPass] = useState();
  const [newPassAgn, setNewPassAgn] = useState();

  const [cookies, setCookie, removeCookie] = useCookies(["sessiontoken"]);
  const navigate = useNavigate();
  const handleChangePassword = () => {
    axios
      .post(apiurl + "changepassword", {
        myid: props.userdatas.id,
        currpass: currPass,
        newpass: newPass,
        newpassagn: newPassAgn,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
          // removeCookie("sessiontoken");
          // window.location.href = "/auth";
        } else {
          toast.error(res.data.message);
        }
      });
  };

  const handleAccountDelete = () => {
    axios
      .post(apiurl + "deleteaccount", {
        myid: props.userdatas.id,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
          window.location.href = "/";
        } else {
          toast.error(res.data.message);
        }
      });
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        // paddingLeft: 40,
      }}
    >
      <div className="SettingsContainer">
        <div style={{ padding: 40 }}>
          <UserDatasComponent
            UserID={props.userdatas.id}
            Avatar={props.userdatas.AvatarURL}
            Username={props.userdatas.Username}
          />
          <div
            style={{
              marginTop: 30,
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              // width: 500,
              maxWidth: 500,
              height: 400,
              // backgroundColor: "red",
              alignItems: "center",
            }}
          >
            <input
              className="Input"
              type="text"
              placeholder="Current Password"
              style={{
                width: 300,
                outline: "none",
                border: "none",
                borderBottom: "solid",
                borderBottomWidth: 2,
                fontFamily: "Roboto, sans-serif",
                fontSize: 20,
                textAlign: "center",
                margin: 20,
              }}
              onChange={(e) => {
                setCurrPass(e.target.value);
              }}
            />
            <input
              className="Input"
              type="text"
              placeholder="New Password"
              style={{
                width: 300,
                outline: "none",
                border: "none",
                borderBottom: "solid",
                borderBottomWidth: 2,
                fontFamily: "Roboto, sans-serif",
                fontSize: 20,
                textAlign: "center",
                margin: 20,
              }}
              onChange={(e) => {
                setNewPass(e.target.value);
              }}
            />
            <input
              className="Input"
              type="text"
              placeholder="New Password 2x"
              style={{
                width: 300,
                outline: "none",
                border: "none",
                borderBottom: "solid",
                borderBottomWidth: 2,
                fontFamily: "Roboto, sans-serif",
                fontSize: 20,
                textAlign: "center",
                margin: 20,
              }}
              onChange={(e) => {
                setNewPassAgn(e.target.value);
              }}
            />

            <div
              onClick={() => handleChangePassword()}
              style={{
                width: 300,
                height: 60,
                backgroundColor: "#6E00FF",
                borderRadius: 25,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Roboto, sans-serif",
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              Change Password
            </div>

            <div
              onClick={() => handleAccountDelete()}
              style={{
                position: "absolute",
                bottom: 100,
                width: 400,
                height: 60,
                backgroundColor: "white",
                boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.25)",
                borderRadius: 25,
                color: "red",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Roboto, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Delete your account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
