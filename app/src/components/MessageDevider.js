import React, { useEffect, useState } from "react";
import { YYYYMMDDDate } from "../config/globalFunctions";

function MessageDevider({ date }) {
  const [displayDate, setDisplayDate] = useState(new Date(date));
  useEffect(() => {
    if (new Date().getDate() - 1 == new Date(date).getDate()) {
      setDisplayDate("Yesterday");
    }
    if (new Date().getDate() == new Date(date).getDate()) {
      setDisplayDate("Today");
    }
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: 20,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "45%",
          backgroundColor: "#D9D9D9",
          height: 2,
        }}
      ></div>
      <div style={{ fontSize: 18 }}>{YYYYMMDDDate(displayDate)}</div>
      <div
        style={{
          width: "45%",
          backgroundColor: "#D9D9D9",
          height: 2,
        }}
      ></div>
    </div>
  );
}

export default MessageDevider;
