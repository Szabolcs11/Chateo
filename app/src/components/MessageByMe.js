import React, { useState } from "react";
import { formatDate } from "../config/globalFunctions";
import { apiurl } from "../config/globalVariables";

function MessageByMe({ text, date, last, imageurls, callback }) {
  return (
    <div className="main-container-message-by-me-container">
      {text && (
        <div className="main-container-message-by-me">
          <div className="main-container-message-by-me-text">{text}</div>
        </div>
      )}

      {imageurls != "" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 40,
          }}
        >
          <div
            style={{
              gap: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {imageurls.map((i) => {
              return (
                <div key={i} style={{ width: 300, height: 200 }}>
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
        </div>
      )}
      {last ? (
        <div className="main-container-message-by-me-date">
          {formatDate(new Date(date).getHours()) +
            ":" +
            formatDate(new Date(date).getMinutes())}
        </div>
      ) : null}
    </div>
  );
}

export default MessageByMe;
