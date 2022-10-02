import React, { useEffect, useState } from "react";
import style from "../styles/Messages.css";
import searchicon from "../assets/svgs/search.svg";

import ChatComponent from "../components/ChatComponent";
import Persons from "../components/Persons";
import GroupsComponent from "../components/GroupsComponent";
import axios from "axios";
import { apiurl } from "../config/globalVariables";

function Messages(props) {
  return (
    <div className="MessagesMain">
      <div className="container">
        <div className="searchbar">
          <div className="searchbar-main">
            <div className="searchbar-icon">
              <img alt="NoImgFound" src={searchicon} />
            </div>
            <div className="searchbar-text">
              <input
                className="searchbar-input"
                placeholder="Search"
                type="text"
              />
            </div>
          </div>
        </div>

        {/* <div className="groups">
          <GroupsComponent />
        </div> */}

        <div className="people">
          <Persons myid={props.userdatas.id} />
        </div>

        <div className="main">
          <ChatComponent myuserdatas={props.userdatas} />
        </div>
      </div>
    </div>
  );
}

export default Messages;

//
{
  /* <div className='main-container-header'>
                <div className='main-container-header-content'>

                  <div className='main-container-header-left'>
                    <div className='main-container-header-avatar-container'>
                      <img src={person1} style={{width: '75px', height: '75px', borderRadius: '50%'}} />
                    </div>
                    <div className='main-container-header-partner-datas'>
                      <div className='main-container-header-partner-name'>Anil</div>
                      <div className='main-container-header-partner-status'>Online - Last seen, 2.02pm</div>
                    </div>
                  </div>

                  <div className='main-container-header-right'>
                    <img src={telephone} style={{cursor: 'pointer'}}/>
                    <img src={camera} style={{cursor: 'pointer'}}/>
                    <img src={other} style={{cursor: 'pointer'}}/>
                  </div>
                </div>
                <div className='header-devider-container'>
                  <div className='header-devider'></div>
                </div>
              </div>
              <div className='main-contianer-main'>
                  <div className='main-container-messages'>
                    
                  </div>
              </div> */
}
