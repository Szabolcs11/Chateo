import React, { useState } from "react";
import { apiurl } from "../config/globalVariables";
import whiteplus from "../assets/svgs/whiteplus.svg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { avatarchanged } from "./Navbar";

function UserDatasComponent({ UserID, Avatar, Username }) {
  const [AvatarSrc, setAvatarSrc] = useState(Avatar);

  const handleChange = async (e) => {
    const data = new FormData();
    data.append("file", e.target.files[0]);
    const cc_res = await axios({
      method: "POST",
      url: apiurl + "upploadimage",
      data,
    });
    axios
      .post(apiurl + "changeuseravatar", {
        myid: UserID,
        avatarurl: cc_res.data.file,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
          setAvatarSrc(cc_res.data.file);
          avatarchanged(cc_res.data.file);
        }
      });
  };
  return (
    <div
      style={{
        // width: 500,
        maxWidth: 500,
        height: 200,
        backgroundColor: "#6E00FF",
        borderRadius: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div style={{ width: 150, height: 150, position: "relative" }}>
        <img
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: "white",
            backgroundColor: "black",
          }}
          alt="ImgNotFound"
          src={apiurl + "UsersProfileImg/" + AvatarSrc}
        />
        <label htmlFor="file-input">
          <img
            alt="ImgNotFound"
            src={whiteplus}
            onClick={() => {
              console.log();
            }}
            style={{
              position: "absolute",
              color: "white",
              right: 2,
              top: 115,
              cursor: "pointer",
            }}
          />
        </label>

        <input
          style={{ display: "none" }}
          id="file-input"
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={handleChange}
          multiple
        />
      </div>
      <div
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: 36,
          color: "white",
        }}
      >
        {Username}
      </div>
    </div>
  );
}

export default UserDatasComponent;
