const express = require("express");
const app = express();
const port = 2004;

var path = require("path");
const mysql = require("mysql");

const bcrypt = require("bcrypt");
const multer = require("multer");
const cors = require("cors");
const { info } = require("console");

// 2FA | QR Code \\

const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "messengerinreact",
});
connection.getConnection(function (err, connection) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server.");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

server.listen(port, () => {
  console.log("Server running", port);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/UsersProfileImg");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, Date.now() + originalname);
  },
});

const upload = multer({ storage });

io.on("connection", (socket) => {
  //   console.log(socket.id);

  socket.on("getroommessages", (RoomID, cb) => {
    connection.query(
      "SELECT users.id AS 'UserID', users.Username, users.AvatarURL, messages.id AS 'MessageID', messages.SenderID, messages.Text, messages.RoomID, messages.Date, messages.ImageIDs FROM `messages` INNER JOIN users ON SenderID=users.id WHERE RoomID=? ORDER BY Date ASC",
      RoomID,
      function (smerr, smres) {
        if (smerr) throw smerr;
        if (smres.length) {
          cb({ succes: true, messagedatas: smres });
        } else {
          cb({ succes: false, message: "No messages found" });
        }
      }
    );
  });

  socket.on("joinroom", (roomKey, socketjoin, allroom, myid, cb) => {
    // console.log(myid);
    if (roomKey) {
      // let allrm = [];
      // allroom.forEach((e) => {
      //   console.log(e);
      //   allrm.push(e.RoomKey);
      // });
      // socket
      //   .to(socket.AllRoom[i].RoomKey)
      //   .emit("userdisconencted", "Offline", "Nev", socket.AllRoom[i].RoomKey);
      socket.MyUserID = myid;
      socket.to(roomKey).emit("userdisconencted", "Online", "Nev", roomKey);
      if (allroom) {
        socket.AllRoom = allroom;
      }
      connection.query(
        "SELECT * FROM rooms WHERE RoomKey=?",
        roomKey,
        function (srerr, srres) {
          if (srerr) throw srerr;
          if (srres.length) {
            if (socketjoin) {
              socket.join(roomKey);
            }
            cb({ succes: true });
          }
        }
      );
    } else {
      cb({ succes: false, message: "No room found with this key" });
    }
  });

  // Send messages
  socket.on("sendmessage", (roomKey, message, senderdatas, imageurls, cb) => {
    // console.log(imageurls);
    if (roomKey && (message || imageurls)) {
      connection.query(
        "SELECT * FROM rooms WHERE RoomKey=?",
        roomKey,
        function (srerr, srres) {
          if (srerr) throw srerr;
          if (srres.length) {
            // Üzenet adatai

            let messageinfo = {
              Username: senderdatas.Username,
              AvatarURL: senderdatas.AvatarURL,
              Text: message,
              RoomKey: roomKey,
              Date: getFullDate(),
              RoomID: srres[0].id,
              SenderID: senderdatas.id,
              ImageIDs: imageurls.toString(),
            };
            // console.log(messageinfo);
            let insertarr = {
              SenderID: senderdatas.id,
              Text: message,
              RoomID: srres[0].id,
              Date: messageinfo.Date,
              ImageIDs: imageurls.toString(),
            };
            connection.query(
              "INSERT INTO messages SET ?",
              insertarr,
              function (imerr, imres) {
                if (imerr) throw imerr;
                socket.to(roomKey).emit("recivemessage", messageinfo);
                // console.log(messageinfo);
                cb({ succes: true, messagedatas: messageinfo });
              }
            );
          } else {
            cb({ succes: false, message: "The room does not exist!" });
          }
        }
      );
    } else {
      cb({ succes: false, message: "RoomKey or message not found!" });
    }
  });

  // Handle Status \\

  socket.on("updatestate", (status, username, cb) => {
    console.log("Leave");
    cb("asd");
  });

  socket.on("disconnect", (a) => {
    // console.log(getFullDate(), "dc");
    // console.log(socket.MyUserID);
    if (socket.MyUserID) {
      let data = {
        Status: "Offline",
        LastUpdate: getFullDate(),
      };
      connection.query(
        "UPDATE users SET Status=? WHERE id=?",
        [JSON.stringify(data), socket.MyUserID],
        function (uuerr, uures) {
          if (uuerr) throw uuerr;
        }
      );
    }
    if (socket.AllRoom) {
      for (let i = 0; i < socket.AllRoom.length; i++) {
        if (socket.AllRoom[i].UserID) {
          // console.log("Privat", socket.AllRoom[i]);
          socket
            .to(socket.AllRoom[i].RoomKey)
            .emit(
              "userdisconencted",
              "Offline",
              "Nev",
              socket.AllRoom[i].RoomKey
            );
        }
      }
      // socket.Allroom.forEach((e) => {
      //   console.log(e);
      // });
    }
    // if (socket.AllRoom) {
    //   socket.AllRoom.forEach((e) => {
    //     socket.to(e).emit("userdisconencted", "Offline", "Nev", e);
    //     console.log(e);
    //   });
    // }
    // console.log(getFullDate(), socket);
    // console.log(getFullDate(), a);
  });

  // socket.on("changemystatus", (status, username, keys, cb) => {
  //   console.log("---------");
  //   console.log(getFullDate() + " :" + status);
  //   console.log(getFullDate() + " :" + username);
  //   console.log(getFullDate() + " :" + keys);
  //   keys.forEach((e) => {
  //     console.log(e);
  //     // if (e.Name != username) {
  //     socket.to(e.RoomKey).emit("userchangedstatus", status, e, username);
  //     // }
  //     // if (e.Name == username) {
  //     // }
  //   });
  //   // console.log("end");
  //   cb({ succes: true });
  // });

  // End of Handle Status\\
});

app.get("/", (req, res) => {
  res.send("Sziaa");
});

// Roomok amiben benen vagyok - SELECT rooms.id, rooms.RoomKey FROM roommembers INNER JOIN rooms ON roommembers.RoomID = rooms.id WHERE roommembers.UserID=1;

// RoomKey alaplján a room tagok [UserID, Username, RoomKey] - SELECT roommembers.UserID, users.Username, rooms.RoomKey FROM roommembers, rooms, users WHERE rooms.RoomKey='123456' and rooms.id = roommembers.RoomID AND roommembers.UserID!=1 AND users.id = roommembers.UserID;

// Roomonkent lekreni az uzenetet - SELECT messages.id, messages.SenderID, messages.Text, messages.RoomID FROM rooms, messages WHERE rooms.RoomKey='123456' AND rooms.id = messages.RoomID;

// Roomok alapjan az uzenetek - SELECT * FROM messages INNER JOIN rooms ON rooms.id = messages.RoomID WHERE messages.SenderID=1;

// SELECT rooms.id AS 'RoomID', rooms.RoomKey, messages.id, messages.SenderID, messages.Text, messages.RoomID, messages.Date FROM messages INNER JOIN rooms ON rooms.RoomKey =  WHERE rooms.RoomKey='123456';

app.post("/Register", async (req, res) => {
  if (req.body.Username && req.body.Password && req.body.Email) {
    const hasdhedPassword = await bcrypt.hash(req.body.Password, 10);

    let info = {
      Username: req.body.Username,
      Password: hasdhedPassword,
      Email: req.body.Email,
      RegDate: getFullDate(),
    };
    connection.query("INSERT INTO users SET ?", info, function (iuerr, iures) {
      if (iuerr) throw iuerr;
      if (iures.insertId) {
        return res.status(200).json({
          succes: true,
          message: "Succesful registraion!",
        });
      }
    });
  } else {
    return res.status(200).json({
      succes: false,
      message: "Fill the datas",
    });
  }
});

app.post("/login", (req, res) => {
  if (req.body.Username && req.body.Password) {
    connection.query(
      "SELECT * FROM users WHERE Username=?",
      req.body.Username,
      function (suerr, sures) {
        if (suerr) throw suerr;
        if (sures.length) {
          bcrypt.compare(
            req.body.Password,
            sures[0].Password,
            function (err, isMath) {
              if (isMath) {
                if (sures[0].Secret == 0) {
                  let info = {
                    UserID: sures[0].id,
                    Token: GenerateToken(32),
                    Date: getFullDate(),
                    Ip: getIp(req),
                  };
                  connection.query(
                    "INSERT INTO sessions SET ?",
                    info,
                    function (iserr, isres) {
                      if (iserr) throw iserr;
                      let data = {
                        Status: "Online",
                        LastUpdate: getFullDate(),
                      };
                      connection.query(
                        "UPDATE users SET Status=? WHERE id=?",
                        [JSON.stringify(data), sures[0].id],
                        function (uuerr, uures) {
                          if (uuerr) throw uuerr;
                          return res.status(200).json({
                            succes: true,
                            message: "Succesful Login!",
                            token: info.Token,
                            user: sures[0],
                          });
                        }
                      );
                    }
                  );
                } else {
                  // Ha van 2FA
                  let info = {
                    UserID: sures[0].id,
                    Token: GenerateToken(32),
                    Date: getFullDate(),
                    Ip: getIp(req),
                  };
                  connection.query(
                    "INSERT INTO twofalogins SET ?",
                    info,
                    function (iterr, itres) {
                      if (iterr) throw iterr;
                      return res.status(200).json({
                        succes: true,
                        twofalogin: true,
                        Token: info.Token,
                      });
                    }
                  );
                }
              } else {
                return res.status(200).json({
                  succes: false,
                  message: "Incorrect password!",
                });
              }
            }
          );
        } else {
          return res.status(200).json({
            succes: false,
            message: "No account found with this name",
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
      message: "Fill the datas!",
    });
  }
});

app.post("/authenticate", (req, res) => {
  if (req.body.Token) {
    connection.query(
      "SELECT users.id, users.Username, users.Email, users.RegDate, users.AvatarURL FROM sessions INNER JOIN users ON sessions.UserID = users.id WHERE sessions.Token=?",
      req.body.Token,
      function (sserr, ssres) {
        if (sserr) throw sserr;
        if (ssres.length) {
          let data = {
            Status: "Online",
            LastUpdate: getFullDate(),
          };
          connection.query(
            "UPDATE users SET Status=? WHERE id=?",
            [JSON.stringify(data), ssres[0].id],
            function (uuerr, uures) {
              if (uuerr) throw uuerr;
              return res.status(200).json({
                succes: true,
                message: "Succesful Token validation",
                user: ssres[0],
              });
            }
          );
        } else {
          res.status(200).json({
            succes: false,
            message: "No sessions found with this Token!",
          });
        }
      }
    );
  } else {
    res.status(200).json({
      succes: false,
      message: "No token found!",
    });
  }
});

// Lekérem az összes friendemet, és a szobákat, amikben benen vagyunk \\
app.post("/getfriends", async (req, res) => {
  if (req.body.myid) {
    // const result = await getfriendandrooms(req.body.myid);
    // const gres = await getmygroups(req.body.myid);

    const result = await getchats(req.body.myid);

    res.status(200).json({
      succes: true,
      chats: result,
    });
  }
});

// Friend Request \\

app.post("/getallusers", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "SELECT id, Username, Email, AvatarURL FROM `users` WHERE id!=?",
      req.body.myid,
      function (suerr, sures) {
        if (suerr) throw suerr;
        if (sures.length) {
          return res.status(200).json({
            succes: true,
            users: sures,
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
    });
  }
});

app.post("/getincomingfriendrequest", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "SELECT * FROM pendingfriendrequests INNER JOIN users ON UserID=users.id WHERE TargetID=?",
      req.body.myid,
      function (sperr, spres) {
        if (sperr) throw sperr;
        if (spres.length > 0) {
          return res.status(200).json({
            succes: true,
            users: spres,
          });
        } else {
          return res.status(200).json({
            succes: true,
            users: [],
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
    });
  }
});

app.post("/addfriend", (req, res) => {
  if (req.body.myid && req.body.targetid) {
    //Ha már én küldtem neki
    connection.query(
      "SELECT * FROM `pendingfriendrequests` WHERE UserID=? AND TargetID=?",
      [req.body.myid, req.body.targetid],
      function (sperr, spres) {
        if (sperr) throw sperr;
        if (spres.length > 0) {
          return res.status(200).json({
            succes: false,
            message: "You have already sent a friend request to the user!",
          });
        } else {
          connection.query(
            "SELECT * FROM `pendingfriendrequests` WHERE UserID=? AND TargetID=?",
            [req.body.targetid, req.body.myid],
            function (spferr, spfres) {
              if (spferr) throw spferr;
              if (spfres.length > 0) {
                return res.status(200).json({
                  succes: false,
                  message: "The user has already sent you a friend request!",
                });
              } else {
                connection.query(
                  "SELECT * FROM `friends` WHERE UserID=? AND FriendID=?",
                  [req.body.myid, req.body.targetid],
                  function (sferr, sfres) {
                    if (sferr) throw sferr;
                    console.log(sfres.length);
                    if (sfres.length > 0) {
                      return res.status(200).json({
                        succes: false,
                        message: "The user is already on your friends list!",
                      });
                    } else {
                      console.log("3");
                      let info = {
                        UserID: req.body.myid,
                        TargetID: req.body.targetid,
                        Date: getFullDate(),
                      };
                      connection.query(
                        "INSERT INTO pendingfriendrequests SET ?",
                        info,
                        function (iperr, ipres) {
                          if (iperr) throw iperr;
                          if (ipres.insertId) {
                            return res.status(200).json({
                              succes: true,
                              message:
                                "You have successfully sent a friend request",
                            });
                          } else {
                            return res.status(200).json({
                              succes: false,
                              message: "Unexpected error!",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
    //Ha ő már küldött nekem

    // Ha már a barátod a user
  } else {
    return res.status(200).json({
      succes: false,
    });
  }
});

app.post("/handlefriendrequest", (req, res) => {
  if (req.body.myid && req.body.data) {
    if (req.body.data.accepted) {
      connection.query(
        "SELECT * FROM pendingfriendrequests WHERE TargetID=? AND UserID=?",
        [req.body.myid, req.body.data.id],
        function (sperr, spres) {
          if (sperr) throw sperr;
          if (spres.length) {
            connection.query(
              "DELETE FROM pendingfriendrequests WHERE id=?",
              spres[0].id,
              function (dperr, dpres) {
                if (dperr) throw dperr;
                let info = {
                  UserID: req.body.myid,
                  FriendID: spres[0].UserID,
                  Date: getFullDate(),
                };
                let revinfo = {
                  UserID: spres[0].UserID,
                  FriendID: req.body.myid,
                  Date: getFullDate(),
                };
                connection.query(
                  "INSERT INTO friends SET ?",
                  info,
                  function (iferr, ifres) {
                    if (iferr) throw iferr;
                    connection.query(
                      "INSERT INTO friends SET ?",
                      revinfo,
                      function (ifferr, iffres) {
                        if (ifferr) throw ifferr;
                        let rminfo = {
                          RoomKey: GenerateToken(8),
                          Date: getFullDate(),
                        };
                        connection.query(
                          "INSERT INTO rooms SET ?",
                          rminfo,
                          function (irerr, irres) {
                            if (irerr) throw irerr;
                            if (irres.insertId) {
                              let rm = {
                                RoomID: irres.insertId,
                                UserID: req.body.myid,
                              };
                              let rmrev = {
                                RoomID: irres.insertId,
                                UserID: spres[0].UserID,
                              };
                              connection.query(
                                "INSERT INTO roommembers SET ?",
                                rm,
                                function (irmerr, irmres) {
                                  if (irmerr) throw irmerr;
                                  if (irmres.insertId) {
                                    connection.query(
                                      "INSERT INTO roommembers SET ?",
                                      rmrev,
                                      function (irmmerr, irmmres) {
                                        if (irmmerr) throw irmmerr;
                                        if (irmmres.insertId) {
                                          return res.status(200).json({
                                            succes: true,
                                            message:
                                              "You have successfully accepted the friend request!",
                                          });
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          } else {
            return res.status(200).json({
              succes: false,
              message: "Unexpected error!",
            });
          }
        }
      );
    } else {
      connection.query(
        "SELECT * FROM pendingfriendrequests WHERE TargetID=? AND UserID=?",
        [req.body.myid, req.body.data.id],
        function (sperr, spres) {
          if (sperr) throw sperr;
          if (spres.length) {
            connection.query(
              "DELETE FROM pendingfriendrequests WHERE id=?",
              spres[0].id,
              function (dperr, dpres) {
                if (dperr) throw dperr;
                return res.status(200).json({
                  succes: true,
                  message: "You successfully declined the friend request!",
                });
              }
            );
          } else {
            return res.status(200).json({
              succes: false,
              message: "Unexpected error!",
            });
          }
        }
      );
    }
  } else {
    return res.status(200).json({
      succes: false,
      message: "Unexpected error!",
    });
  }
});

app.post("/changeuseravatar", (req, res) => {
  if (req.body.avatarurl && req.body.myid) {
    connection.query(
      "UPDATE users SET AvatarURL=? WHERE id=?",
      [req.body.avatarurl, req.body.myid],
      function (uaerr, uares) {
        if (uaerr) throw uaerr;
        console.log(uares);
        return res.status(200).json({
          succes: true,
          message: "You've successfully changed your avatar!",
        });
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
      message: "Unexpected error!",
    });
  }
});

app.post("/changepassword", async (req, res) => {
  if (
    req.body.myid &&
    req.body.currpass &&
    req.body.newpass &&
    req.body.newpassagn
  ) {
    const hasdhedPassword = await bcrypt.hash(req.body.newpass, 10);
    if (
      req.body.newpass != req.body.newpassagn ||
      req.body.newpass == req.body.currpass
    ) {
      return res.status(200).json({
        succes: false,
        message: "The new passwords do not match!",
      });
    } else {
      connection.query(
        "SELECT * FROM users WHERE id=?",
        req.body.myid,
        function (suerr, sures) {
          if (suerr) throw suerr;
          if (sures.length) {
            bcrypt.compare(
              req.body.currpass,
              sures[0].Password,
              function async(err, isMath) {
                if (isMath) {
                  connection.query(
                    "UPDATE users SET Password=?",
                    hasdhedPassword,
                    function (userr, usres) {
                      if (userr) throw userr;
                      return res.status(200).json({
                        succes: true,
                        message: "You have successfully changed your password!",
                      });
                    }
                  );
                } else {
                  return res.status(200).json({
                    succes: false,
                    message: "Incorrect password!",
                  });
                }
              }
            );
          } else {
            return res.status(200).json({
              succes: false,
              message: "Unexpected error!",
              debug: true,
            });
          }
        }
      );
    }
  } else {
    return res.status(200).json({
      succes: false,
      message: "Need data!",
    });
  }
});

app.post("/deleteaccount", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "SELECT * FROM users WHERE id=?",
      req.body.myid,
      function (suerr, sures) {
        if (suerr) throw suerr;
        if (sures.length) {
          connection.query(
            "DELETE FROM messages WHERE SenderID=?",
            req.body.myid,
            function (dmerr, dmres) {
              if (dmerr) throw dmerr;
              connection.query(
                "DELETE FROM roommembers WHERE UserID=?",
                req.body.myid,
                function (drerr, drres) {
                  if (drerr) throw drerr;
                  connection.query(
                    "DELETE FROM sessions WHERE UserID=?",
                    req.body.myid,
                    function (dserr, dsres) {
                      if (dserr) throw dserr;
                      connection.query(
                        "DELETE FROM friends WHERE UserID=?",
                        req.body.myid,
                        function (dferr, dres) {
                          if (dferr) throw dferr;
                          connection.query(
                            "DELETE FROM friends WHERE FriendID=?",
                            req.body.myid,
                            function (dferrr, dfress) {
                              if (dferrr) throw dferrr;
                              connection.query(
                                "DELETE FROM users WHERE id=?",
                                req.body.myid,
                                function (duerr, dures) {
                                  if (duerr) throw duerr;
                                  return res.status(200).json({
                                    succes: true,
                                    message:
                                      "You have successfully deleted your user!",
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        } else {
          return res.status(200).json({
            succes: false,
            message: "Unexpected error!",
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
      message: "Unexpected error!",
    });
  }
});

app.get("/UsersProfileImg/:id", (req, res) => {
  var options = {
    root: path.join("./public/UsersProfileImg/"),
  };

  var fileName = req.params.id;
  res.sendFile(fileName, options);
});

app.get("/Images/:id", (req, res) => {
  var options = {
    root: path.join("./public/Images/"),
  };

  var fileName = req.params.id;
  res.sendFile(fileName, options);
});

app.post("/logout", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "DELETE FROM sessions WHERE UserID=?",
      req.body.myid,
      function (dserr, dsres) {
        if (dserr) throw dserr;
        return res.status(200).json({
          succes: true,
          message: "Succesful logout!",
        });
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
      message: "Unexpected error!",
    });
  }
});

app.post("/getmyfriends", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "SELECT users.id, users.Username, users.AvatarURL FROM friends INNER JOIN users ON users.id=friends.FriendID WHERE UserID=?",
      req.body.myid,
      function (sferr, sfres) {
        if (sferr) throw sferr;
        if (sfres.length) {
          return res.status(200).json({
            succes: true,
            friends: sfres,
          });
        } else {
          return res.status(200).json({
            succes: true,
            friends: [],
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
      message: "Unexpected error!",
    });
  }
});

app.post("/creategroup", (req, res) => {
  console.log(req.body);
  if (req.body.myid && req.body.Name && req.body.CoverURL && req.body.Persons) {
    let roomsinsert = {
      RoomKey: GenerateToken(6),
      Name: req.body.Name,
      CoverURL: req.body.CoverURL,
      Date: getFullDate(),
    };
    connection.query(
      "INSERT INTO rooms SET ?",
      roomsinsert,
      function (irerr, irres) {
        if (irerr) throw irerr;
        if (irres.insertId) {
          let i = 0;
          req.body.Persons.forEach((e) => {
            i++;
            let rminfo = {
              RoomID: irres.insertId,
              UserID: e.id,
            };
            connection.query(
              "INSERT INTO roommembers SET ? ",
              rminfo,
              function (irmerr, irmres) {
                if (irmerr) throw irmerr;
              }
            );
            if (i == req.body.Persons.length) {
              let myinfo = {
                RoomID: irres.insertId,
                UserID: req.body.myid,
              };
              connection.query(
                "INSERT INTO roommembers SET ?",
                myinfo,
                function (irmmerr, irmmres) {
                  if (irmmerr) throw irmmerr;
                  if (irmmres.insertId) {
                    return res.status(200).json({
                      succes: true,
                      message:
                        "Succesfuly create the group called " +
                        req.body.Name +
                        " !",
                    });
                  } else {
                    return res.status(200).json({
                      succes: false,
                      message: "Unexpected error!",
                    });
                  }
                }
              );
            }
          });
        } else {
          return res.status(200).json({
            succes: false,
            message: "Unexpected error!",
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
      message: "Unexpected error!",
    });
  }
});

app.post("/upploadimage", upload.single("file"), async (req, res) => {
  // console.log(req.file.filename);
  console.log(req.file);
  let info = {
    Url: req.file.filename,
    Date: getFullDate(),
  };
  connection.query("INSERT INTO images SET ?", info, function (iierr, iires) {
    if (iierr) throw iierr;
    if (iires.insertId) {
      return res.status(200).json({
        succes: true,
        file: req.file.filename,
        fileid: iires.insertId,
      });
    }
  });
});

async function getchats(myid) {
  const mysqlprom = require("mysql2/promise");
  const contprom = await mysqlprom.createConnection({
    host: "localhost",
    user: "root",
    database: "messengerinreact",
  });

  const [fres, ferr] = await contprom.execute(
    "SELECT rooms.id, rooms.RoomKey, rooms.Name, rooms.CoverURL AS AvatarURL FROM roommembers INNER JOIN rooms ON rooms.id=roommembers.RoomID WHERE UserID=?",
    [myid]
  );

  let datas = [];
  // console.log(fres);
  for (let i = 0; i < fres.length; i++) {
    const [srmres, srmerr] = await contprom.execute(
      "SELECT rooms.id, users.id AS UserID, users.Status AS Status, users.Username AS Name, users.AvatarURL, rooms.RoomKey FROM roommembers INNER JOIN users ON roommembers.UserID=users.id INNER JOIN rooms ON rooms.id=roommembers.RoomID WHERE RoomID=? AND UserID!=?",
      [fres[i].id, myid]
    );
    // console.log(srmres);
    if (srmres.length > 1) {
      //Group message
      fres[i].Notification = 0;
      datas.push(fres[i]);
    } else {
      //Private message
      srmres[0].Notification = 0;
      // srmres[0].Status = "Offline";
      datas.push(srmres[0]);
    }
  }
  return datas;
}

// setTimeout(async () => {
//   const res = await getchats(1);
//   console.log(res);
// }, 100);

async function getfriendandrooms(myid) {
  const mysqlprom = require("mysql2/promise");
  const contprom = await mysqlprom.createConnection({
    host: "localhost",
    user: "root",
    database: "messengerinreact",
  });

  let returndata = [];
  const [fres, ferr] = await contprom.execute(
    "SELECT friends.UserID, friends.FriendID, users.Username, users.AvatarURL FROM friends, users WHERE UserID=? AND users.id = friends.FriendID",
    [myid]
  );
  // console.log(fres);

  const [myrmres, myrmerr] = await contprom.execute(
    "SELECT * FROM roommembers WHERE UserID=?",
    [myid]
  );
  for (let k = 0; k < fres.length; k++) {
    const [frres, frerr] = await contprom.execute(
      "SELECT * FROM roommembers WHERE UserID=?",
      [fres[k].FriendID]
    );
    for (let i = 0; i < myrmres.length; i++) {
      for (let j = 0; j < frres.length; j++) {
        if (myrmres[i].RoomID == frres[j].RoomID) {
          const [srmres, srmerr] = await contprom.execute(
            "SELECT * FROM rooms WHERE id=?",
            [frres[j].RoomID]
          );
          let info = {
            FreindID: fres[k].FriendID,
            Username: fres[k].Username,
            AvatarURL: fres[k].AvatarURL,
            RoomKey: srmres[0].RoomKey,
            RoomID: srmres[0].id,
            Notification: 0,
          };
          returndata.push(info);
        }
      }
    }
  }
  contprom.end();
  // console.log("Returndata");
  // console.log(returndata);
  return returndata;
}

async function getmygroups(myid) {
  const mysqlprom = require("mysql2/promise");
  const contprom = await mysqlprom.createConnection({
    host: "localhost",
    user: "root",
    database: "messengerinreact",
  });

  const [srres, srerr] = await contprom.execute(
    "SELECT groups.id, groups.GroupKey, groups.Name, groups.CoverURL FROM groupmembers INNER JOIN groups ON groups.id=groupmembers.GroupID WHERE UserID=?",
    [myid]
  );
  return srres;
}

// setTimeout(async () => {
//   const res = await getmygroups(1);
//   console.log(res);
// }, 100);

app.post("/checkuserstate", (req, res) => {
  if (req.body.UserID) {
    connection.query(
      "SELECT id, Status FROM users WHERE id=?",
      req.body.UserID,
      function (suerr, sures) {
        if (suerr) throw suerr;
        if (sures.length) {
          return res.status(200).json({
            succes: true,
            userdata: sures[0],
            message: "Succesful",
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
      message: "No data!",
    });
  }
});

function checkstatuses() {
  setTimeout(function () {
    connection.query("SELECT * FROM users", function (suerr, sures) {
      if (suerr) throw suerr;
      if (sures.length) {
        for (let i = 0; i < sures.length; i++) {
          let statusdatas = JSON.parse(sures[i].Status);
          let lastupdatedate = new Date(statusdatas.LastUpdate);
          let currentdate = new Date(getFullDate());
          let elapsedtime = currentdate - lastupdatedate;
          if (elapsedtime > 600000) {
            if (statusdatas.Status != "Offline") {
              let info = {
                Status: "Offline",
                LastUpdate: currentdate,
              };
              connection.query(
                "UPDATE users SET Status=? WHERE id=?",
                [JSON.stringify(info), sures[i].id],
                function (userr, usres) {
                  if (userr) throw userr;
                }
              );
            }
          }
          if (elapsedtime > 60000) {
            if (statusdatas.Status == "Online") {
              let info = {
                Status: "Away",
                LastUpdate: currentdate,
              };
              connection.query(
                "UPDATE users SET Status=? WHERE id=?",
                [JSON.stringify(info), sures[i].id],
                function (userr, usres) {
                  if (userr) throw userr;
                }
              );
            }
          }
        }
      }
    });
    checkstatuses();
  }, 15000);
}

// checkstatuses();

// 2FA \\

// Generating the QR code \\
app.get("/generateqrcode", (req, res) => {
  var secret = speakeasy.generateSecret({
    name: "Chateo",
  });
  qrcode.toDataURL(secret.otpauth_url, function (err, data) {
    url = data;
    return res.status(200).json({
      succes: true,
      qrcodedeurl: url,
      seecret: secret.ascii,
    });
    // res.sendFile(url, options);
  });
});

// Enable the twofa \\

app.post("/turnontwofa", (req, res) => {
  if (req.body.key && req.body.secret && req.body.myid) {
    let verified = verifytwofacode(req.body.key, req.body.secret);
    if (verified) {
      connection.query(
        "UPDATE users SET Secret=? WHERE id=?",
        [req.body.secret, req.body.myid],
        function (uuerr, uures) {
          if (uuerr) throw uuerr;
          return res.status(200).json({
            succes: true,
            message: "Succesful activation!",
          });
        }
      );
    } else {
      return res.status(200).json({
        succes: false,
        message: "Incorrect code!",
      });
    }
  } else {
    return res.status(200).json({
      succes: false,
      message: "No datas found!",
    });
  }
});

app.post("/turnofftwofa", (req, res) => {
  if (req.body.myid && req.body.key) {
    connection.query(
      "SELECT Secret FROM users WHERE id=?",
      req.body.myid,
      function (suerr, sures) {
        if (suerr) throw suerr;
        if (sures.length) {
          // console.log(sures[0].Secret);
          let verified = verifytwofacode(req.body.key, sures[0].Secret);
          console.log(verified);
          if (verified) {
            connection.query(
              "UPDATE users SET Secret=? WHERE id=?",
              ["0", req.body.myid],
              function (uuerr, uures) {
                if (uuerr) throw uuerr;
                return res.status(200).json({
                  succes: true,
                  message: "Succesfully turned off the 2FA!",
                });
              }
            );
          } else {
            return res.status(200).json({
              succes: false,
              message: "Incorrect code!",
            });
          }
        }
      }
    );
  }
});

app.post("/verifytwofa", (req, res) => {
  if (req.body.key && req.body.token) {
    connection.query(
      "SELECT * FROM twofalogins WHERE Token=?",
      req.body.key,
      function (sterr, stres) {
        if (sterr) throw sterr;
        if (stres.length) {
          connection.query(
            "SELECT * FROM users WHERE id=?",
            stres[0].UserID,
            function (suerr, sures) {
              if (suerr) throw suerr;
              if (sures.length) {
                let verified = verifytwofacode(req.body.token, sures[0].Secret);
                if (verified) {
                  let info = {
                    UserID: sures[0].id,
                    Token: GenerateToken(32),
                    Date: getFullDate(),
                    Ip: getIp(req),
                  };
                  connection.query(
                    "INSERT INTO sessions SET ?",
                    info,
                    function (iserr, isres) {
                      if (iserr) throw iserr;
                      let data = {
                        Status: "Online",
                        LastUpdate: getFullDate(),
                      };
                      connection.query(
                        "UPDATE users SET Status=? WHERE id=?",
                        [JSON.stringify(data), sures[0].id],
                        function (uuerr, uures) {
                          if (uuerr) throw uuerr;
                          connection.query(
                            "DELETE FROM twofalogins WHERE Token=?",
                            req.body.key,
                            function (dterr, dtres) {
                              if (dterr) throw dterr;
                              return res.status(200).json({
                                succes: true,
                                message: "Succesful Login!",
                                token: info.Token,
                                user: sures[0],
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                } else {
                  return res.status(200).json({
                    succes: false,
                    message: "Incorrect code!",
                  });
                }
              } else {
                return res.status(200).json({
                  succes: false,
                  urlerror: true,
                  message: "UserID error!",
                });
              }
            }
          );
        } else {
          return res.status(200).json({
            succes: false,
            urlerror: true,
            message: "UrlToken not found!",
          });
        }
      }
    );
  }
});

// Verify 2FA code \\
function verifytwofacode(key, secret) {
  let verify = speakeasy.totp.verify({
    secret: secret,
    encoding: "ascii",
    token: key,
  });
  return verify;
}

app.post("/gettwofastatus", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "SELECT Secret FROM users WHERE id=?",
      req.body.myid,
      function (ssuerr, ssures) {
        if (ssuerr) throw ssuerr;
        console.log(ssures[0].Secret);
        if (ssures[0].Secret != 0) {
          return res.status(200).json({
            succes: true,
            secret: true,
          });
        } else {
          return res.status(200).json({
            succes: true,
            secret: false,
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      succes: false,
      message: "No datas found!",
      secret: false,
    });
  }
});

// Useful functions \\
function getFullDate() {
  var today = new Date();
  return (
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
    today.getSeconds()
  );
}

function GenerateToken(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}
function getIp(req) {
  return req.connection.remoteAddress.replace("::ffff:", "");
}

// app.listen(port, () => {
//   console.log("App listen on port", port);
// });
