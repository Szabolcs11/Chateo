import React from "react";

import seenicon from "../assets/svgs/seen.svg";
import { apiurl } from "../config/globalVariables";

function TabComponent({ avatar, name, lastmessage, date, notification, seen }) {
  return (
    <div className="tab">
      <div className="tab-left">
        <img
          alt="NoImgFound"
          src={apiurl + "UsersProfileImg/" + avatar}
          className="group-icon"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <div className="tab-datas">
          <div className="tab-datas-name">{name}</div>
          {lastmessage && (
            <div className="tab-datas-lastmessage">{lastmessage}</div>
          )}
        </div>
      </div>
      <div className="tab-datasandnotifications">
        {date && <div className="tab-date">{date}</div>}
        {/* {notification && notification > 0 && ( */}
        {notification > 0 && (
          <div className="tab-notification">
            <div className="tab-newmessage">{notification}</div>
          </div>
        )}
        {seen && (
          <div className="tab-notification">
            <img src={seenicon} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TabComponent;
