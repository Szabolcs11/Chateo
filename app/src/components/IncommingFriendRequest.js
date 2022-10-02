import React from "react";
import x from "../assets/svgs/x.svg";
import pipe from "../assets/svgs/pipe.svg";
import { apiurl } from "../config/globalVariables";

function IncommingFriendRequest({ id, avatar, name, incomcb }) {
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
      <div className="tab-datasandnotifications" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div>
            <img
              alt="Not found"
              src={pipe}
              style={{ cursor: "pointer" }}
              onClick={() => {
                incomcb({ id: id, accepted: true });
              }}
            />
          </div>
          <div style={{ marginLeft: 20 }}>
            <img
              style={{ cursor: "pointer" }}
              alt="Not found"
              src={x}
              onClick={() => {
                incomcb({ id: id, accepted: false });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncommingFriendRequest;
