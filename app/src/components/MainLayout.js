import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function MainLayout(props) {
  return (
    <div className="MainLayout">
      <Navbar userdatas={props.userdatas} />
      <div style={{ paddingLeft: 40, width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
