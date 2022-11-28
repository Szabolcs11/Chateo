import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { apiurl } from "./../src/config/globalVariables";

import Auth from "./pages/Auth/Auth";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import MainLayout from "./components/MainLayout";
import SearchFriends from "./pages/SearchFriends";
import AuthenticateTwoFa from "./pages/Auth/AuthenticateTwoFa";

import io from "socket.io-client";

export let handleLogin;
export let handleTwoFaLogin;
export let handleRegister;
export let handleLogout;

function App() {
  const socket = io.connect(apiurl);
  // console.log("app render");
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["sessiontoken"]);

  useEffect(() => {
    const sessiontoken = cookies.sessiontoken || undefined;
    if (sessiontoken) {
      axios
        .post(apiurl + "authenticate", {
          Token: sessiontoken,
        })
        .then((res) => {
          if (res.data.succes) {
            setUser(res.data.user);
            // window.location.href = "/";
          } else {
            removeCookie("sessiontoken");
          }
        });
    }
  }, []);

  handleTwoFaLogin = (userdatas, token) => {
    //console.log(userdatas);
    //console.log(token);
    setUser(userdatas);
    setCookie("sessiontoken", token);
    toast.success("Succesful login!");
    navigate("/");
  };

  handleLogin = (username, password) => {
    axios
      .post(apiurl + "login", {
        headers: { "Access-Control-Allow-Origin": "*" },
        Username: username,
        Password: password,
      })
      .then((res) => {
        //console.log(res.data);
        if (res.data.succes) {
          if (res.data.twofalogin) {
            navigate("/authenticate/" + res.data.Token);
          } else {
            setCookie("sessiontoken", res.data.token);
            setUser(res.data.user);
          }
        } else {
          toast.error(res.data.message);
        }
      });
  };

  handleRegister = (username, email, password) => {
    axios
      .post(apiurl + "register", {
        Username: username,
        Password: password,
        Email: email,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      });
  };

  handleLogout = (userdatas) => {
    removeCookie("sessiontoken");
    axios
      .post(apiurl + "logout", {
        myid: userdatas.id,
      })
      .then((res) => {
        //console.log(res.data);
        if (res.data.succes) {
          setUser(false);
        }
      });
  };
  if (user) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route element={<MainLayout userdatas={user} />}>
            {/* <Route path="/" element={(window.location.href = "/home")} /> */}
            <Route path="/" element={<Home />} />
            <Route
              path="/message"
              element={<Messages userdatas={user} socket={socket} />}
            />
            <Route
              path="/search"
              element={<SearchFriends userdatas={user} />}
            />
            <Route path="/settings" element={<Settings userdatas={user} />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </>
    );
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/authenticate/:key" element={<AuthenticateTwoFa />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default App;
{
  /* <Route path="/profile" element={<div>Profile</div>} /> */
}
