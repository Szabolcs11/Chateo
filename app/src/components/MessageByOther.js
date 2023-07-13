import React from "react";
import { formatDate } from "../config/globalFunctions";
import { apiurl } from "../config/globalVariables";

function MessageByOther({ avatar, text, date, last, imageurls, callback }) {
  // console.log(imageurls);
  return (
    <div className="main-container-message-by-other-container">
      <div className="main-container-message-by-other">
        <div className="main-container-message-by-other-avatar">
          {last && <img src={apiurl + "UsersProfileImg/" + avatar} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />}
        </div>
        {text && <div className="main-container-message-by-other-text">{text}</div>}
      </div>
      {imageurls != "" && (
        <div>
          {imageurls.map((i) => {
            return (
              <div key={i} style={{ width: 300, maxHeight: 500, marginLeft: 70 }}>
                <img
                  onClick={() => callback(apiurl + "UsersProfileImg/" + i)}
                  style={{ width: "100%", height: "100%", cursor: "pointer" }}
                  alt={"ImgNotFound"}
                  src={apiurl + "UsersProfileImg/" + i}
                />
              </div>
            );
          })}
        </div>
      )}
      {last && (
        <div className="main-container-message-by-other-date">
          {formatDate(new Date(date).getHours()) + ":" + formatDate(new Date(date).getMinutes())}
        </div>
      )}
    </div>
  );
}

export default MessageByOther;
