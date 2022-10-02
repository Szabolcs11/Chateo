import React, { useState } from "react";
import { apiurl } from "../config/globalVariables";

function MessageByMe({ text, date, last, imageurls }) {
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
                    style={{ width: "100%", height: "100%" }}
                    alt={"ImgNotFound"}
                    src={apiurl + "UsersProfileImg/" + i}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {last && (
        <div className="main-container-message-by-me-date">
          {new Date(date).getHours() + ":" + new Date(date).getMinutes()}
        </div>
      )}
    </div>
  );
}

export default MessageByMe;

// import React from "react";

// function MessageByMe({ text, date, last }) {
//   return (
//     <div className="main-container-message-by-me-container">
//       <div className="main-container-message-by-me">
//         {/* <div> */}
//         <div className="main-container-message-by-me-text">{text}</div>

//         {/* {true && (
//             <div style={{ backgroundColor: "red", width: 200, height: 150 }}>
//               <img
//                 style={{ width: "100%", height: "100%" }}
//                 src={
//                   "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
//                 }
//               />
//             </div>
//           )} */}
//         {/* </div> */}
//       </div>
//       {last && (
//         <div className="main-container-message-by-me-date">
//           {new Date(date).getHours() + ":" + new Date(date).getMinutes()}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MessageByMe;
