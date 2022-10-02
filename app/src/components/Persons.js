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
  joinAllPrivateConversation,
  selectPerson,
} from "./ChatComponent";

export let changeusernotificationstatus;

export let personsforceupdate;

function Persons(props) {
  const [friends, setFriends] = useState();
  const [groups, setGroups] = useState();
  const [chats, setChats] = useState([]);
  // Force update
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    axios
      .post(apiurl + "getfriends", {
        myid: props.myid,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.succes) {
          // res.data.frienddatas[0].notification = 1;
          // setFriends(res.data.frienddatas);
          // setGroups(res.data.groups);
          joinAllPrivateConversation(res.data.chats);
          setChats(res.data.chats);
        }
      });
  }, []);

  personsforceupdate = () => {
    axios
      .post(apiurl + "getfriends", {
        myid: props.myid,
      })
      .then((res) => {
        if (res.data.succes) {
          joinAllPrivateConversation(res.data.chats);
          setChats(res.data.chats);
        }
      });
  };

  changeusernotificationstatus = (roomkey) => {
    // console.log(roomkey);
    // console.log("friends");
    // console.log(friends);
    let tempfriends = chats;
    tempfriends.filter((friend) => {
      if (friend.RoomKey == roomkey) {
        friend.Notification = friend.Notification + 1;
        // console.log(friend);
      }
      return friend;
    });
    setFriends(tempfriends);
    console.log(friends);
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
    // setFriends(tempfriends);
  };

  // if (!friends) return null;
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
              backgroundColor: "#5d17a4",
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
        {chats.map((c, index) => {
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
                  // date={"Today, 9.52"}
                  // lastmessage={p.lastmessage}
                  // seen={p.seen}
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

        {/* <TabComponent name={'Friend Forever'} date={'Today, 9.52'} avatar={person1} lastmessage={'HaHaHaHa!'} seen={true} /> */}
      </div>
    </div>
  );
}

export default Persons;
