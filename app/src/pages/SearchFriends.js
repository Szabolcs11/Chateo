import React, { Fragment, useEffect, useState } from "react";
import style from "../styles/SearchFriends.css";
import searchicon from "../assets/svgs/search.svg";
import Persons from "../components/Persons";
import axios from "axios";
import { apiurl } from "../config/globalVariables";
import TabComponent from "../components/TabComponent";
import SearchedUserComponent from "../components/SearchedUserComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IncommingFriendRequest from "../components/IncommingFriendRequest";

function SearchFriends(props) {
  const [incomUsers, setIncomUsers] = useState([]);

  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  useEffect(() => {
    axios
      .post(apiurl + "getallusers", {
        myid: props.userdatas.id,
      })
      .then((res) => {
        if (res.data.succes) {
          setUsers(res.data.users);
          setSearchUsers(res.data.users);
        }
      });
  }, []);

  //Get
  useEffect(() => {
    axios
      .post(apiurl + "getincomingfriendrequest", {
        myid: props.userdatas.id,
      })
      .then((res) => {
        if (res.data.succes) {
          setIncomUsers(res.data.users);
        }
      });
  }, []);

  const handleAddFriend = (id) => {
    axios
      .post(apiurl + "addfriend", {
        myid: props.userdatas.id,
        targetid: id,
      })
      .then((res) => {
        if (res.data.succes) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      });
  };

  const handleFriendRequest = (cb) => {
    axios
      .post(apiurl + "handlefriendrequest", {
        myid: props.userdatas.id,
        data: cb,
      })
      .then((res) => {
        //console.log(res.data);
        if (res.data.succes) {
          toast.success(res.data.message);
          let temp = incomUsers;
          let newarr = temp.filter((e) => e.id != cb.id);
          setIncomUsers(newarr);
        } else {
          toast.error(res.data.message);
          let temp = incomUsers;
          let newarr = temp.filter((e) => e.id != cb.id);
          setIncomUsers(newarr);
        }
      });
  };

  const searchUser = (a) => {
    // //console.log(a.target.value);
    if (a.target.value == "") {
      setSearchUsers(users);
    } else {
      let temp = users;
      let newarr = [];
      temp.forEach((e) => {
        let name = e.FullName.toLowerCase();
        if (name.includes(a.target.value.toLowerCase())) {
          newarr.push(e);
        }
      });
      setSearchUsers(newarr);
    }
  };
  return (
    <div className="SearchFriends-Main">
      <div className="SearchFriends-Container">
        <div className="SearchFriends-searchbar">
          <div className="searchbar-main">
            <div className="searchbar-icon">
              <img alt="NoImgFound" src={searchicon} />
            </div>
            <div className="searchbar-text">
              <input
                onChange={(e) => searchUser(e)}
                className="searchbar-input"
                placeholder="Search"
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="SearchFriends-peoples">
          <div className="SearchFriends-container">
            <div className="SearchFriends-title">Search users</div>
            <div className="SearchFriends-Persons-Container">
              {searchUsers.map((u) => {
                return (
                  <Fragment key={u.id}>
                    <SearchedUserComponent
                      id={u.id}
                      FullName={u.FullName}
                      avatar={u.AvatarURL}
                      callback={(cb) => {
                        handleAddFriend(cb);
                      }}
                    />
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="SearchFriends-Right">
          <div className="incomingfriendrequests">
            <div style={{ padding: 22, height: "100%" }}>
              <div className="SearchFriends-title">
                Incoming friend requests
              </div>
              <div className="SearchFriends-Right-Container">
                {incomUsers.map((u) => {
                  return (
                    <IncommingFriendRequest
                      key={u.id}
                      id={u.id}
                      FullName={u.FullName}
                      avatar={u.AvatarURL}
                      incomcb={(cb) => {
                        handleFriendRequest(cb);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFriends;
