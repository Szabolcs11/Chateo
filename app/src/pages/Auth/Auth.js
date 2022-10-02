import React, { useState } from "react";
import AuthStyle from "../../styles/AuthStyle.css";
import { useNavigate } from "react-router-dom";
import LoginComponent from "../../components/Auth/LoginComponent";
import RegisterComponent from "../../components/Auth/RegisterComponent";

export let changeAuthPage;

function Auth() {
  const navigate = useNavigate();

  const [page, setPage] = useState("login");

  changeAuthPage = (page) => {
    setPage(page);
  };

  return (
    <div className="Auth-Container">
      {page === "login" ? <LoginComponent /> : <RegisterComponent />}
    </div>
  );
}

export default Auth;
