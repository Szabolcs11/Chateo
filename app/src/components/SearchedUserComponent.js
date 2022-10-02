import React from "react";
import plus from "../assets/svgs/plus.svg";
import { apiurl } from "../config/globalVariables";

function SearchedUserComponent({ id, avatar, name, callback }) {
  return (
    <div className="tab" style={{ cursor: "default" }}>
      <div className="tab-left">
        <img
          alt="NoImgFound"
          src={apiurl + "UsersProfileImg/" + avatar}
          className="group-icon"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <div className="tab-datas">
          <div className="tab-datas-name">{name}</div>
        </div>
      </div>
      <div
        className="tab-datasandnotifications"
        style={{ cursor: "pointer" }}
        onClick={() => {
          callback(id);
        }}
      >
        <img src={plus} />
      </div>
    </div>
  );
}

export default SearchedUserComponent;
