import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TurnOffTwoFa from "../components/TurnOffTwoFa";
import TurnOnTwoFa from "../components/TurnOnTwoFa";
import TwoFaComponent from "../components/TwoFaComponent";
import UserDatasComponent from "../components/UserDatasComponent";
import { apiurl } from "../config/globalVariables";
import stlye from "../styles/SettingsStyle.css";

export let handleStartEnableTwoFa;

export let handleStartDisableTwoFa;

export let twofaactivated;

function Settings(props) {
  // console.log(props);
  const [currPass, setCurrPass] = useState();
  const [newPass, setNewPass] = useState();
  const [newPassAgn, setNewPassAgn] = useState();

  const [cookies, setCookie, removeCookie] = useCookies(["sessiontoken"]);
  const navigate = useNavigate();

  // 2FA Things \\
  const [enableTwoFa, setEnableTwoFa] = useState();
  const [disableTwoFa, setDisableTwoFa] = useState();

  handleStartEnableTwoFa = (state) => {
    setEnableTwoFa(state);
  };

  handleStartDisableTwoFa = (state) => {
    // console.log("most kene jelenjen");
    setDisableTwoFa(state);
  };

  twofaactivated = () => {
    setEnableTwoFa(false);
  };

  // End of 2FA Things \\
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
        position: "relative",
        // paddingLeft: 40,
      }}
    >
      {enableTwoFa && (
        <TurnOnTwoFa
          userid={props.userdatas.id}
          username={props.userdatas.Username}
        />
      )}
      {disableTwoFa && (
        <TurnOffTwoFa
          userid={props.userdatas.id}
          username={props.userdatas.Username}
        />
      )}
      <div className="SettingsContainer">
        <div style={{ padding: 40 }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: 10,
              // backgroundColor: "red",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "50%" }}>
              <UserDatasComponent
                UserID={props.userdatas.id}
                Avatar={props.userdatas.AvatarURL}
                Username={props.userdatas.Username}
              />
            </div>
            <div style={{ width: "50%" }}>
              <TwoFaComponent userid={props.userdatas.id} />
            </div>
          </div>
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
