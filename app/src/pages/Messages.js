import React, { useEffect, useState } from "react";
import style from "../styles/Messages.css";

import ChatComponent from "../components/ChatComponent";
import Persons from "../components/Persons";
import GroupsComponent from "../components/GroupsComponent";
import axios from "axios";
import { apiurl } from "../config/globalVariables";
import MessagesSearchBarComponent from "../components/MessagesSearchBarComponent";

function Messages(props) {
  return (
    <div className="MessagesMain">
      <div className="container">
        <div className="searchbar">
          <MessagesSearchBarComponent />
        </div>
        <div className="people">
          <Persons
            myid={props.userdatas.id}
            username={props.userdatas.Username}
          />
        </div>

        <div className="main">
          <ChatComponent socket={props.socket} myuserdatas={props.userdatas} />
        </div>
      </div>
    </div>
  );
}

export default Messages;
