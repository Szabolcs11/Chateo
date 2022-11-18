import React, { useRef, useState } from "react";
import img from "../assets/images/Szabylogo.png";
import homeicon from "../assets/svgs/home.svg";
import messagesicon from "../assets/svgs/messages.svg";
import settingsicon from "../assets/svgs/settings.svg";
import searchusers from "../assets/svgs/searchusers.svg";
import leaveicon from "../assets/svgs/leave.svg";
import { useNavigate, Navigate } from "react-router-dom";
import { apiurl } from "../config/globalVariables";
import { handleLogout } from "../App";
import menu from "../assets/svgs/menu.svg";

let routes = [
  {
    url: "/",
    icon: homeicon,
    name: "Home",
  },
  {
    url: "/message",
    icon: messagesicon,
    name: "Messages",
  },
  {
    url: "/search",
    icon: searchusers,
    name: "Search",
  },
  {
    url: "/settings",
    icon: settingsicon,
    name: "Settings",
  },
  {
    url: "/leave",
    icon: leaveicon,
    name: "Sing Out",
  },
];

export let avatarchanged;

function Navbar(props) {
  const [avatrurl, setAvatarUrl] = useState(props.userdatas.AvatarURL);
  // //console.log("props", props.userdatas);
  avatarchanged = (url) => {
    setAvatarUrl(url);
  };
  const navigate = useNavigate();
  const responsivenavigation = useRef();
  const [responsiveNavbarStatus, setresponsiveNavbarStatus] = useState(true);

  return (
    <>
      <div className="Navigation-Main-Container">
        <div className="NavigationSidebar">
          <div className="NavigationBarContent">
            <div className="MyProfile">
              {/* <img src={img} width="100%" height="100%" /> */}
              <img
                width="100%"
                height="100%"
                style={{ borderRadius: "50%" }}
                src={apiurl + "UsersProfileImg/" + avatrurl}
              />
            </div>
            <div className="Navigation-Routes">
              {routes.map((route, index) => {
                if (index + 1 === routes.length) {
                  return (
                    <div
                      onClick={() => {
                        handleLogout(props.userdatas);
                        window.location.href = "/";
                      }}
                      key={`Index_${index}`}
                      className="Navigation-Route-Bottom"
                    >
                      <img src={route.icon} width="50px" height="50px" />
                    </div>
                  );
                }
                return (
                  <div
                    onClick={() => navigate(route.url)}
                    key={`Index_${index}`}
                    className="Navigation-Route"
                    id={
                      route.url === window.location.pathname ? "selected" : ""
                    }
                  >
                    <img src={route.icon} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-navbar">
        <div>
          <img
            alt="ImgNotFound"
            src={menu}
            onClick={() => setresponsiveNavbarStatus(!responsiveNavbarStatus)}
          />
        </div>
        {responsiveNavbarStatus && (
          <div className="responsive-navbar-menus" ref={responsivenavigation}>
            <div className="medium-padding">
              {routes.map((route, index) => {
                if (index + 1 === routes.length) {
                  return (
                    <div
                      onClick={() => {
                        handleLogout(props.userdatas);
                        window.location.href = "/";
                      }}
                      key={`Index_${index}`}
                      className="responsive-navbar-menu"
                    >
                      {route.name}
                    </div>
                  );
                }
                return (
                  <div
                    onClick={() => navigate(route.url)}
                    key={`Index_${index}`}
                    className="responsive-navbar-menu"
                  >
                    {route.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
