import React, { Fragment, useEffect, useState } from "react";
import seen from "../assets/svgs/seen.svg";
import person1 from "../assets/images/person1.png";
import person2 from "../assets/images/person2.png";
import person3 from "../assets/images/person3.png";
import person4 from "../assets/images/person4.png";
import person5 from "../assets/images/person5.png";
import TabComponent from "./TabComponent";
import axios from "axios";

import { apiurl } from "../config/globalVariables";
import {
  createNewGroup,
  handleDeleteChat,
  joinAllPrivateConversation,
  selectPerson,
} from "./ChatComponent";

export let changeusernotificationstatus;

export let personsforceupdate;

export let handleFriendDelete;

export let searchchats;

export let changestatusofuser;

function Persons(props) {
  const [friends, setFriends] = useState();
  const [groups, setGroups] = useState();
  const [chats, setChats] = useState([]);
  const [searchChats, setSearchChats] = useState([]);
  // Force update
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    axios
      .post(apiurl + "getfriends", {
        myid: props.myid,
      })
      .then((res) => {
        if (res.data.succes) {
          console.log("Joinol az osszesbe");
          joinAllPrivateConversation(res.data.chats);
          setChats(res.data.chats);
          setSearchChats(res.data.chats);
        }
      });
  }, []);

  changestatusofuser = (roomkey, status) => {
    let temp = searchChats;
    temp.map((e) => {
      if (e.RoomKey == roomkey) {
        var today = new Date();
        let date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate() +
          " " +
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        let info = {
          Status: status,
          LastUpdate: date,
        };
        e.Status = JSON.stringify(info);
      }
    });
    setSearchChats(temp);
    forceUpdate();
  };

  searchchats = (value) => {
    if (value == "") {
      setSearchChats(chats);
      return;
    }
    let tempchats = chats;
    let newarr = [];
    tempchats.forEach((e) => {
      if (e.Name.toLowerCase().includes(value.toLowerCase())) {
        newarr.push(e);
      }
    });
    setSearchChats(newarr);
    forceUpdate();
  };

  handleFriendDelete = (data) => {
    console.log(searchChats);
    const temp = searchChats;
    const res = temp.filter((e) => e.UserID != data);
    setSearchChats(res);
    handleDeleteChat();
    forceUpdate();
    console.log(res);
  };

  personsforceupdate = () => {
    axios
      .post(apiurl + "getfriends", {
        myid: props.myid,
      })
      .then((res) => {
        if (res.data.succes) {
          console.log(res.data.chats);
          joinAllPrivateConversation(res.data.chats);
          setChats(res.data.chats);
          forceUpdate();
        }
      });
  };

  changeusernotificationstatus = (roomkey) => {
    let tempfriends = chats;
    tempfriends.filter((friend) => {
      if (friend.RoomKey == roomkey) {
        friend.Notification = friend.Notification + 1;
      }
      return friend;
    });
    setFriends(tempfriends);
    forceUpdate();
  };

  const joinroom = (chatdatas) => {
    selectPerson(chatdatas);
    let tempchats = chats;
    tempchats.filter((chat) => {
      if (chat.Name == chatdatas.Name) {
        chat.Notification = 0;
      }
      return chat;
    });
    forceUpdate();
    setChats(tempchats);
  };

  return (
    <div className="people-container">
      <div className="people-container-title">Chats</div>
      <div className="people-peoples-container">
        {!chats.length && (
          <div
            style={{
              fontFamily: "Roboto, sans-serif",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 20,
            }}
          >
            No Friends Found
          </div>
        )}
        <div
          style={{
            // backgroundColor: "rebeccapurple",
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          <div
            onClick={() => createNewGroup()}
            style={{
              height: "50%",
              // backgroundColor: "#5d17a4",
              backgroundColor: "#20a090",
              color: "white",
              padding: 6,
              borderRadius: 15,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 30 }}>+{"\u00a0"}</div>
            Create a New Group
          </div>
        </div>
        <div className="tab-devider"></div>
        {searchChats.map((c, index) => {
          return (
            <Fragment key={index}>
              <div
                onClick={() => {
                  joinroom(c);
                }}
              >
                <TabComponent
                  name={c.Name}
                  avatar={c.AvatarURL}
                  notification={c.Notification ? c.Notification : 0}
                />
              </div>
              {index < chats.length - 1 && (
                <div
                  key={`GROUP_TAB_DEVIDER${index}`}
                  className="tab-devider"
                ></div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Persons;
