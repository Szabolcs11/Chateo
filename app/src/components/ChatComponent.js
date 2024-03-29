import React, { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import close from "./../assets/svgs/close.svg";

import person1 from "../assets/images/person1.png";
import person2 from "../assets/images/person2.png";
import person3 from "../assets/images/person3.png";
import person4 from "../assets/images/person4.png";
import person5 from "../assets/images/person5.png";

import attachmentimg from "../assets/svgs/attachment.svg";
import send from "../assets/svgs/send.svg";
import smile from "../assets/svgs/smile.svg";

import { AiOutlineCloseCircle } from "react-icons/ai";

import MessageByMe from "./MessageByMe";
import MessageByOther from "./MessageByOther";
import HeaderComponent, { updateheaderstatus } from "./HeaderComponent";

import { apiurl, emojis } from "../config/globalVariables";
import {
  changestatusofuser,
  changeusernotificationstatus,
  personsforceupdate,
} from "./Persons";
import FileUploadComponent from "./FileUploadComponent";

import choseafriend from "../assets/svgs/ChoseAFriend.svg";

import plus from "../assets/svgs/primarycolorplus.svg";
import backarrow from "../assets/svgs/backarrow.svg";
import x from "../assets/svgs/x.svg";
import blackx from "../assets/svgs/blackx.svg";

import style from "../styles/ChatComponent.css";

import useWindowFocus from "use-window-focus";

export let handleDeleteChat;

// import { apiurl } from "./../src/config/globalVariables";

// const myid = 1;

const messages = [
  // {
  //   sender: 2,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: person1,
  // },
  // {
  //   sender: 2,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: person1,
  // },
  // {
  //   sender: 1,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: "",
  // },
  // {
  //   sender: 1,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: "",
  // },
  // {
  //   sender: 1,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: "",
  // },
  // {
  //   sender: 2,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: person1,
  // },
  // {
  //   sender: 2,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: person1,
  // },
  // {
  //   sender: 1,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: "",
  // },
  // {
  //   sender: 2,
  //   text: "Hey There!",
  //   date: "Today, 8.30pm",
  //   avatar: "",
  // },
];

// const texttoemoji = [
//   ["😀", ":D"],
//   ["❤️", "<3"],
// ];

export let selectPerson;

export let joinAllPrivateConversation;

export let createNewGroup;

function ChatComponent(props) {
  console.log(props);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  // const socket = io("http://localhost:2004/");
  // const socket = io.connect(apiurl);
  // const socket = io.connect("https://api.kekenj-sabolc.me");

  const [partnerdatas, setPartnerDatas] = useState();
  const [messages, setMessages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [attachments, setAttachmentUrls] = useState(false);

  const [ImageURL, setImageURL] = useState();

  // Groups \\
  const [createGroup, setCreateGroup] = useState(false);
  const [selectUsers, setSelectUsers] = useState(false);

  const [myFriends, setMyFriends] = useState([]);

  const [groupName, setGroupName] = useState();

  const [groupAvatar, setGroupAvatar] = useState();
  const [groupAvatarURL, setGroupAvatarURL] = useState(
    apiurl + "UsersProfileImg/DefaultGroupsCover.png"
  );

  // Testing \\
  const windowFocused = useWindowFocus();
  const [chatKeys, setChatKeys] = useState();

  // const [currentRoomStatus, setCurrentRoomStatus] = useState();

  // End of testing \\

  // End of grouos \\

  // Emoji selector \\
  const [emojiPanelAvtive, setEmojiPanelAvtive] = useState(false);
  // End of Emoji Selector \\

  const bottomScroll = useRef(null);
  const currentMessage = useRef("");

  // Testing 10-03 \\

  const initBeforeUnLoad = (showExitPrompt) => {
    window.onbeforeunload = (event) => {
      // Show prompt based on state
      // console.log("1");
      // callsocket(); // Away hez
      if (showExitPrompt) {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = "";
        }
        return "";
      }
    };
  };

  const [showExitPrompt, setShowExitPrompt] = useState(false);

  window.onload = function () {
    initBeforeUnLoad(showExitPrompt);
  };

  // Re-Initialize the onbeforeunload event listener
  useEffect(() => {
    initBeforeUnLoad(showExitPrompt);
  }, [showExitPrompt]);

  // useEffect(() => {
  // window.onbeforeunload = (event) => {
  //   const e = event || window.event;
  //   console.log("a");
  //   callsocket();
  //   e.preventDefault();
  //   if (e) {
  //     e.returnValue = ""; // Legacy method for cross browser support
  //   }
  // };
  // }, []);

  // Ez ha el kattintok az oldalról \\
  // useEffect(() => {
  //   document.addEventListener("visibilitychange", function logData() {
  //     if (document.visibilityState === "hidden") {
  //       callsocket();
  //     } else {
  //       console.log("visszajottem");
  //     }
  //   });
  // }, []);

  useEffect(() => {
    props.socket.on("userdisconencted", (status, name, roomkey, changerid) => {
      if (changerid != props.myuserdatas.id) {
        changestatusofuser(roomkey, status);
        let currentRKey = localStorage.getItem("RoomKey") || "";
        if (currentRKey == roomkey) {
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
          updateheaderstatus(status);
          forceUpdate();
        }
      }
    });
  }, [props.socket]);

  handleDeleteChat = () => {
    setPartnerDatas(null);
  };

  joinAllPrivateConversation = (chats) => {
    localStorage.clear("RoomKey");
    let keys = [];
    chats.forEach((e) => {
      if (e.UserID) {
        keys.push(e); // Here can add the entire chat datas
      }
      if (e.UserID) {
        props.socket.emit(
          "joinroom",
          e.RoomKey,
          true,
          chats,
          props.myuserdatas.id,
          true,
          (cb) => {}
        );
      } else {
        props.socket.emit(
          "joinroom",
          e.RoomKey,
          true,
          chats,
          props.myuserdatas.id,
          false,
          (cb) => {}
        );
      }
    });
    setChatKeys(keys);
  };

  const loadMessages = (messagedatas) => {
    if (messagedatas) {
      for (let i = 0; i < messagedatas.length; i++) {
        for (let j = 0; j < emojis.length; j++) {
          messagedatas[i].Text = messagedatas[i].Text.replaceAll(
            emojis[j][1],
            emojis[j][0]
          );
        }
      }
      setMessages(messagedatas);
    }
  };

  selectPerson = (chatdatas) => {
    setMessages([]);
    props.socket.emit("getroommessages", chatdatas.id, (cb) => {
      if (chatdatas.Status) {
        let st = JSON.parse(chatdatas.Status);
        updateheaderstatus(st.Status);
      }
      if (cb.succes) {
        loadMessages(cb.messagedatas);
      }
      joinroom(chatdatas.RoomKey);
    });
    setPartnerDatas(chatdatas);
  };

  useEffect(() => {
    bottomScroll.current?.scrollIntoView();
  }, [messages]);

  const [currentRoomKey, setCurrentRoomKey] = useState();

  const joinroom = (RoomKey) => {
    props.socket.emit(
      "joinroom",
      RoomKey,
      false,
      false,
      props.myuserdatas.id,
      false,
      (cb) => {
        setCurrentRoomKey(RoomKey);
        localStorage.setItem("RoomKey", RoomKey);
      }
    );
  };

  useEffect(() => {
    if (props.socket == null) return;
    props.socket.on("recivemessage", (data) => {
      let currentRKey = localStorage.getItem("RoomKey") || "";
      if (data.RoomKey == currentRKey) {
        console.log(data.length);
        for (let j = 0; j < emojis.length; j++) {
          data.Text = data.Text.replaceAll(emojis[j][1], emojis[j][0]);
        }
        setMessages((prevMessage) => [...prevMessage, data]);
      } else {
        changeusernotificationstatus(data.RoomKey);
      }
    });
  }, [props.socket]);

  const inputtextchange = (e) => {
    for (let i = 0; i < emojis.length; i++) {
      currentMessage.current.value = currentMessage.current.value.replaceAll(
        emojis[i][1],
        emojis[i][0]
      );
    }
  };

  const sendMessage = async () => {
    if (currentMessage.current.value) {
      let cbmessage = currentMessage.current.value;
      for (let i = 0; i < emojis.length; i++) {
        cbmessage = cbmessage.replaceAll(emojis[i][0], emojis[i][1]);
      }
      var imagesurls = [];
      if (ImageURL && ImageURL.length > 0) {
        for (let i = 0; i < ImageURL.length; i++) {
          const data = new FormData();
          data.append("file", ImageURL[i]);
          const cc_res = await axios({
            method: "POST",
            url: apiurl + "upploadimage",
            data,
          });
          imagesurls.push(cc_res.data.file);
        }
      }

      props.socket.emit(
        "sendmessage",
        partnerdatas.RoomKey,
        cbmessage,
        props.myuserdatas,
        imagesurls,
        (cb) => {
          if (cb.succes) {
            let messagetext = cb.messagedatas.Text;
            for (let i = 0; i < emojis.length; i++) {
              messagetext = messagetext.replaceAll(emojis[i][1], emojis[i][0]);
            }
            const {
              SenderID,
              AvatarURL,
              Date,
              RoomID,
              RoomKey,
              Text,
              Username,
              ImageIDs,
            } = cb.messagedatas;
            setMessages([
              ...messages,
              {
                SenderID: SenderID,
                AvatarURL: AvatarURL,
                Date: Date,
                RoomID: RoomID,
                RoomKey: RoomKey,
                Text: messagetext,
                Username: Username,
                ImageIDs: ImageIDs ? ImageIDs.toString() : "",
              },
            ]);
            currentMessage.current.value = "";
          }
        }
      );
      setImageURL([]);
    } else if (ImageURL && ImageURL.length > 0) {
      console.log("Most csak kepek");
      var imagesurls = [];
      if (ImageURL.length > 0) {
        for (let i = 0; i < ImageURL.length; i++) {
          const data = new FormData();
          data.append("file", ImageURL[i]);
          const cc_res = await axios({
            method: "POST",
            url: apiurl + "upploadimage",
            data,
          });
          imagesurls.push(cc_res.data.file);
          console.log(cc_res.data);
        }
      }

      props.socket.emit(
        "sendmessage",
        partnerdatas.RoomKey,
        currentMessage.current.value || "",
        props.myuserdatas,
        imagesurls,
        (cb) => {
          if (cb.succes) {
            const {
              SenderID,
              AvatarURL,
              Date,
              RoomID,
              RoomKey,
              Text,
              Username,
              ImageIDs,
            } = cb.messagedatas;
            console.log("ImgUrls2", ImageIDs);
            setMessages([
              ...messages,
              {
                SenderID: SenderID,
                AvatarURL: AvatarURL,
                Date: Date,
                RoomID: RoomID,
                RoomKey: RoomKey,
                Text: Text,
                Username: Username,
                ImageIDs: ImageIDs ? ImageIDs.toString() : "",
              },
            ]);
            currentMessage.current.value = "";
          }
        }
      );
      setImageURL([]);
    }
  };

  const removeimg = (file) => {
    const array = [];
    ImageURL.map((i) => {
      if (i == file) {
      } else {
        array.push(i);
      }
    });
    setImageURL(array);
  };

  createNewGroup = () => {
    axios
      .post(apiurl + "getmyfriends", {
        myid: props.myuserdatas.id,
      })
      .then((res) => {
        if (res.data.succes) {
          res.data.friends.map((e) => {
            e.Selected = false;
          });
          setMyFriends(res.data.friends);
          forceUpdate();
        }
      });
    setCreateGroup(true);
  };

  const handleChange = async (e) => {
    console.log("file", e);
    const src = URL.createObjectURL(e.target.files[0]);
    if (e.target.files.length > 0) {
      let srcs = [];
      for (let i = 0; i < e.target.files.length; i++) {
        srcs.push(e.target.files[i]);
      }
      console.log(srcs);
      console.log(srcs[0]);
      setGroupAvatar(srcs[0]);
      setGroupAvatarURL(src);
    }
  };

  const handleCreateGroup = async () => {
    let friends = myFriends.filter((f) => f.Selected == true);
    if (friends.length > 1) {
      let filename = "DefaultGroupsCover.png";
      if (groupAvatar) {
        const data = new FormData();
        data.append("file", groupAvatar);
        const cc_res = await axios({
          method: "POST",
          url: apiurl + "upploadimage",
          data,
        });
        filename = cc_res.data.file;
      }

      axios
        .post(apiurl + "creategroup", {
          myid: props.myuserdatas.id,
          Name: groupName,
          CoverURL: filename,
          Persons: friends,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.succes) {
            toast.success(res.data.message);
            personsforceupdate();
          } else {
            toast.error(res.data.message);
          }
        });
    }
  };

  if (createGroup) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <div
          style={{
            padding: 20,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
            position: "relative",
          }}
        >
          {selectUsers && (
            <div
              style={{
                zIndex: 1,
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "35%",
                  height: "80%",
                  backgroundColor: "white",
                  borderRadius: 25,
                  borderWidth: 1,
                  border: "solid",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <img
                  onClick={() => setSelectUsers(!selectUsers)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    cursor: "pointer",
                  }}
                  src={blackx}
                />
                <p style={{ fontSize: 30, color: "#6e00ff", fontWeight: 600 }}>
                  Select Members
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 20,
                  }}
                >
                  {myFriends.map((f, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          margin: 10,
                        }}
                      >
                        <img
                          style={{
                            widows: 40,
                            height: 40,
                            borderRadius: "50%",
                          }}
                          src={apiurl + "UsersProfileImg/" + f.AvatarURL}
                        />
                        <div style={{ fontSize: 24 }}>{f.Username}</div>
                        {f.Selected ? (
                          <div
                            onClick={() => {
                              f.Selected = false;
                              forceUpdate();
                            }}
                            style={{ cursor: "pointer" }}
                            className="Remove-Person"
                          >
                            <span className="Remove-Person-Tooltip">
                              Remove
                            </span>
                            <img
                              style={{
                                width: 35,
                                height: 35,
                              }}
                              src={blackx}
                            />
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              f.Selected = true;
                              forceUpdate();
                            }}
                            style={{ cursor: "pointer" }}
                            className="Remove-Person"
                          >
                            <span className="Remove-Person-Tooltip">Add</span>
                            <img
                              style={{
                                width: 35,
                                height: 35,
                              }}
                              src={plus}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div style={{ fontSize: 36, color: "#6e00ff", fontWeight: 600 }}>
            <div
              onClick={() => setCreateGroup(false)}
              style={{ position: "absolute", left: 10, cursor: "pointer" }}
            >
              <img src={backarrow} />
            </div>
            Create a New Group
          </div>
          <div
            style={{
              // backgroundColor: "red",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                paddingTop: 50,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div>
                <div
                  style={{
                    borderRadius: "50%",
                    width: 100,
                    height: 100,
                    borderWidth: 1,
                    border: "solid",
                    position: "relative",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                    src={groupAvatarURL}
                  />
                  {/* <div style={{widows: }}> */}
                  <label htmlFor="file-input">
                    <img
                      style={{
                        position: "absolute",
                        bottom: -15,
                        right: -15,
                        cursor: "pointer",
                      }}
                      alt="ImgNotFound"
                      src={plus}
                    />
                  </label>

                  <input
                    style={{ display: "none" }}
                    id="file-input"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleChange}
                    // setGroupAvatar
                    multiple
                  />

                  {/* </div> */}
                </div>
              </div>
              <div style={{ paddingTop: 50, fontSize: 26 }}>
                Name of the Group:
                <input
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                  type="text"
                  style={{
                    marginLeft: 20,
                    outline: "none",
                    border: "none",
                    borderBottom: "solid",
                    borderBottomColor: "black",
                    borderBottomWidth: 2,
                    fontSize: 26,
                    textAlign: "center",
                    fontFamily: "Roboto, sans-serif",
                  }}
                  className="Input"
                />
              </div>

              <div
                style={{ paddingTop: 50, fontSize: 30, textAlign: "center" }}
              ></div>
              <div style={{ paddingTop: 50 }}>
                <div
                  onClick={() => setSelectUsers(!selectUsers)}
                  style={{
                    backgroundColor: "#6e00ff",
                    borderRadius: 20,
                    padding: 10,
                    color: "white",
                    cursor: "pointer",
                    fontSize: 30,
                  }}
                >
                  Select Members
                </div>
              </div>
              <div style={{ margin: 20 }}>
                <div
                  onClick={() => handleCreateGroup()}
                  style={{
                    backgroundColor: "#6e00ff",
                    borderRadius: 20,
                    padding: 10,
                    color: "white",
                    cursor: "pointer",
                    fontSize: 30,
                  }}
                >
                  Create New Group
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!partnerdatas) {
    return (
      <div className="chatcomponent-nofiriendselected">
        <img alt="NoImgFound" src={choseafriend} />
        <div
          style={{ fontFamily: "Roboto, sans-serif", fontSize: 50, margin: 70 }}
        >
          Select a friend
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {imagePreview && imagePreview.length > 0 ? (
        <div className="ImgPrview">
          <div
            onClick={() => setImagePreview([])}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
            }}
          >
            <img
              style={{
                width: "30px",
                height: "30px",
              }}
              src={close}
            />
          </div>
          <img
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            src={imagePreview}
          />
        </div>
      ) : null}
      <div style={{ height: "20%" }}>
        {partnerdatas.Status ? (
          <HeaderComponent
            myid={props.myuserdatas.id}
            partnername={partnerdatas.Name || ""}
            avatar={partnerdatas.AvatarURL || ""}
            status={JSON.parse(partnerdatas.Status).Status}
            partnerid={partnerdatas.UserID || ""}
          />
        ) : (
          <HeaderComponent
            myid={props.myuserdatas.id}
            partnername={partnerdatas.Name || ""}
            avatar={partnerdatas.AvatarURL || ""}
            status={""}
            partnerid={partnerdatas.UserID || ""}
          />
        )}
      </div>
      <div style={{ height: "70%" }}>
        <div className="main-container-messages-main">
          <div className="main-container-messages-content">
            {messages.map((m, index) => {
              if (m.SenderID === props.myuserdatas.id) {
                if (messages[index + 1]) {
                  if (messages[index + 1].SenderID === props.myuserdatas.id) {
                    return (
                      <MessageByMe
                        key={`MESSAGE_BY_ME_${index}`}
                        text={m.Text}
                        date={m.Date}
                        last={false}
                        imageurls={m.ImageIDs ? m.ImageIDs.split(",") : ""}
                        callback={(url) => {
                          console.log(url);
                        }}
                      />
                    );
                  }
                }
                return (
                  <MessageByMe
                    key={`MESSAGE_BY_ME_${index}`}
                    text={m.Text}
                    date={m.Date}
                    last={true}
                    imageurls={m.ImageIDs ? m.ImageIDs.split(",") : ""}
                    callback={(url) => {
                      setImagePreview(url);
                    }}
                  />
                );
              } else {
                if (messages[index + 1]) {
                  if (messages[index + 1].SenderID === m.SenderID) {
                    return (
                      <MessageByOther
                        key={`MESSAGE_BY_OTHER_${index}`}
                        text={m.Text}
                        date={m.Date}
                        avatar={m.AvatarURL}
                        last={false}
                        imageurls={m.ImageIDs ? m.ImageIDs.split(",") : ""}
                        callback={(url) => {
                          setImagePreview(url);
                        }}
                      />
                    );
                  }
                }
                return (
                  <MessageByOther
                    key={`MESSAGE_BY_OTHER_${index}`}
                    text={m.Text}
                    date={m.Date}
                    avatar={m.AvatarURL}
                    last={true}
                    imageurls={m.ImageIDs ? m.ImageIDs.split(",") : ""}
                    callback={(url) => {
                      setImagePreview(url);
                    }}
                  />
                );
              }
            })}
            <div ref={bottomScroll} />
          </div>
        </div>
      </div>
      <div
        style={{
          height: "10%",
          width: "99%",
          padding: "2%",
        }}
      >
        <div
          style={{
            height: "100%",
            position: "relative",
            width: "99%",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {ImageURL && ImageURL.length > 0 && (
              <div
                style={{
                  backgroundColor: "#EFF6FC",
                  width: "88%",
                  height: 150,
                  top: -150,
                  position: "absolute",
                  borderBottom: "solid",
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                }}
              >
                <div style={{ width: "100%", height: "100%", padding: "1%" }}>
                  <div
                    className="noscroll"
                    style={{
                      width: "100%",
                      height: "100%",
                      gap: "2%",
                      display: "flex",
                      flexWrap: "wrap",
                      overflow: "scroll",
                    }}
                  >
                    {ImageURL.map((m) => {
                      const url = URL.createObjectURL(m);
                      console.log(url);
                      return (
                        <div key={m.name} style={{ position: "relative" }}>
                          <img
                            style={{
                              width: 150,
                              height: 135,
                              borderRadius: 20,
                            }}
                            src={url}
                          />
                          <span
                            style={{
                              position: "absolute",
                              top: -1,
                              right: -1,
                              cursor: "pointer",
                            }}
                          >
                            <AiOutlineCloseCircle
                              size={20}
                              onClick={() => removeimg(m)}
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                width: "88%",
                backgroundColor: "#EFF6FC",
                height: "100%",
                display: "flex",
                alignItems: "center",
                borderRadius: 25,
                borderTopLeftRadius: attachments ? "0%" : 25,
                borderTopRightRadius: attachments ? "0%" : 25,
              }}
            >
              <FileUploadComponent
                callback={(cburls) => {
                  console.log(cburls);
                  setImageURL(cburls);
                }}
              />
              <div
                style={{
                  width: "85%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <input
                  className="main-bottom-input"
                  type="text"
                  placeholder="Type your message here..."
                  style={{ border: "none", outline: "none" }}
                  ref={currentMessage}
                  onChange={(e) => inputtextchange(e)}
                />
              </div>
              <div
                style={{
                  height: "100%",
                  width: "10%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={smile}
                  style={{ width: "42px", height: "42px", cursor: "pointer" }}
                  onClick={() => setEmojiPanelAvtive(!emojiPanelAvtive)}
                />
                {emojiPanelAvtive && (
                  <div
                    className="emoji-selector-panel"
                    style={{
                      width: 230,
                      height: 250,
                      backgroundColor: "#EFF6FC",
                      // backgroundColor: "red",
                      position: "absolute",
                      top: -260,
                      right: 50,
                      borderRadius: 10,
                      overflow: "scroll",
                      boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: 10,
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        className="emoji-panel-container"
                        style={{
                          width: "100%",
                          // height: "100%",
                          // backgroundColor: "gray",
                          // display: "flex",
                          // flexDirection: "row",
                          // flexWrap: "wrap",
                        }}
                      >
                        {emojis.map((e) => {
                          return (
                            <div
                              key={e}
                              className="emojiselector-item"
                              onClick={() => {
                                currentMessage.current.value =
                                  currentMessage.current.value + e[1] + " ";
                                inputtextchange("a");
                              }}
                            >
                              {e[0]}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ width: "12%", height: "100%" }}>
              <div
                className="main-bottom-send-button"
                onClick={() => sendMessage()}
              >
                <img src={send} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
