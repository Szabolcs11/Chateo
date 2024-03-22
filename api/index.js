require("dotenv").config();
const express = require("express");
const app = express();
var path = require("path");
const mysql = require("mysql");

const bcrypt = require("bcrypt");
const multer = require("multer");
const cors = require("cors");
const { info } = require("console");

// Firebase \\
const admin = require("firebase-admin");
const serviceAccount = require("./chateo-d1a4e-firebase-adminsdk-91dul-5d9b24954f.json");
const firebaseServerKey = require("./firebaseserverkey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 2FA | QR Code \\

const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

// Nodemailer \\
const nodemailer = require("nodemailer");

const nodemailerconfig = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAILUSERNAME,
    pass: process.env.GMAILPASSWORD,
  },
});
const transporter = nodemailer.createTransport(nodemailerconfig);

console.log(process.env.APPURL);

var corsOptions = {
  origin: process.env.APPURL,
};

app.use(cors(corsOptions));

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 10,
});
connection.getConnection(function (err, connection) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server.\nDatabase:", process.env.DATABASE);
  connection.release();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = require("http").createServer(app);
// app.use("/peerjs", ExpressPeerServer(server, opinions));
const io = require("socket.io")(server, { cors: { origin: "*" } });

// server.listen(process.env.PORT, () => {
server.listen(process.env.PORT, "192.168.0.102", () => {
  console.log("Server running", process.env.PORT);
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

const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });

io.on("connection", (socket) => {
  //   console.log(socket.id);

  // socket.on("call", ({ userId, type }) => {
  //   const remoteSocket = userSocketMap.get(userId);
  //   if (!remoteSocket) {
  //     socket.emit("call-failed", { message: "User is not online" });
  //     return;
  //   }
  //   socket.to(remoteSocket).emit("call", { type, userId: socket.id });
  // });

  // socket.on("call-accepted", ({ callerId, signal, type }) => {
  //   const callerSocketId = userSocketMap.get(callerId);
  //   if (!callerSocketId) {
  //     socket.emit("call-failed", { message: "Caller is not online" });
  //     return;
  //   }
  //   socket.to(callerSocketId).emit("call-accepted", { signal, type });
  // });

  // socket.on("call-user", (data) => {
  //   console.log(`Received call from ${socket.id} to ${data.to}`);

  //   // Forward the "call-user" message to the target user
  //   io.to(data.to).emit("call-made", {
  //     offer: data.offer,
  //     socket: socket.id,
  //   });
  // });

  // // When a client sends an "answer-call" message, forward it to the caller
  // socket.on("answer-call", (data) => {
  //   console.log(`Received answer from ${socket.id} to ${data.socket}`);

  //   // Forward the "answer-call" message to the caller
  //   io.to(data.socket).emit("call-accepted", {
  //     answer: data.answer,
  //   });
  // });

  socket.on("getroommessages", (RoomID, cb) => {
    // console.log("kapom");
    connection.query(
      "SELECT users.id AS 'UserID', users.FullName, users.AvatarURL, messages.id AS 'MessageID', messages.SenderID, messages.Text, messages.RoomID, messages.Date, messages.ImageIDs FROM `messages` INNER JOIN users ON SenderID=users.id WHERE RoomID=? ORDER BY Date ASC",
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

  socket.on("joinroom", (roomKey, socketjoin, allroom, myid, runsocket, cb) => {
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
      // if (socket.rooms.has(roomKey)) {
      //   console.log("Már benen vagyok a szobába");
      // } else {
      //   console.log("Nem vagyban benne a szobában");
      // }
      socket.MyUserID = myid;
      // to all clients in room1 except the sender
      if (runsocket) {
        socket.to(roomKey).emit("userdisconencted", "Online", "Nev", roomKey, myid);
      }
      if (allroom) {
        socket.AllRoom = allroom;
      }
      connection.query("SELECT * FROM rooms WHERE RoomKey=?", roomKey, function (srerr, srres) {
        if (srerr) throw srerr;
        if (srres.length) {
          if (socketjoin) {
            socket.join(roomKey);
            // if (!socket.rooms.has(roomKey)) {
            //   // console.log("Joinol");
            //   socket.leave(roomKey);
            //   socket.join(roomKey);
            // } else {
            //   // console.log("Nem joinol");
            // }
          }
          cb({ succes: true, message: "Succesfully joined the room" });
        }
      });
    } else {
      cb({ succes: false, message: "No room found with this key" });
    }
  });

  // Send messages
  socket.on("sendmessage", (roomKey, message, senderdatas, imageurls, cb) => {
    // console.log(imageurls);
    if (roomKey && (message || imageurls)) {
      connection.query("SELECT * FROM rooms WHERE RoomKey=?", roomKey, function (srerr, srres) {
        if (srerr) throw srerr;
        if (srres.length) {
          // Üzenet adatai

          let messageinfo = {
            FullName: senderdatas.FullName,
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
          connection.query("INSERT INTO messages SET ?", insertarr, function (imerr, imres) {
            if (imerr) throw imerr;
            // Firebase things \\
            sendfirebasenotifications(roomKey, senderdatas, message, imageurls);
            // End of Firebase things \\
            socket.to(roomKey).emit("recivemessage", messageinfo);
            console.log("recivemessage", roomKey, messageinfo);
            // console.log(messageinfo);
            cb({ succes: true, messagedatas: messageinfo });
          });
        } else {
          cb({ succes: false, message: "The room does not exist!" });
        }
      });
    } else {
      cb({ succes: false, message: "RoomKey or message not found!" });
    }
  });

  // Handle Status \\

  socket.on("updatestate", (status, FullName, cb) => {
    // console.log("Leave");
    // cb("asd");
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("istartedtyping", (room, id) => {
    socket.to(room).emit("userchangedtyping", true, room, id);
  });

  socket.on("istoppedtyping", (room, id) => {
    socket.to(room).emit("userchangedtyping", false, room, id);
  });

  socket.on("disconnect", (a) => {
    // console.log("dc");
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
          socket.to(socket.AllRoom[i].RoomKey).emit("userdisconencted", "Offline", "Nev", socket.AllRoom[i].RoomKey);
        }
      }
    }
  });

  // End of Handle Status\\
});

app.get("/", (req, res) => {
  // const html = `
  // <h1>Test</h1>
  // `;
  // const transported = nodemailer.createTransport({
  //   host: "mail.openjavascript.info",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: "test@openjavascript.info",
  //     pass: "test123",
  //   },
  // });

  res.send("Sziaa");
  // const message = {
  //   notification: {
  //     title: "New message",
  //     body: "You have a new message from a ",
  //   },
  //   data: {
  //     roomkey: "Py0DGz",
  //   },
  //   token:
  //     "fLzgoi5mTHGml7tiXSC4gA:APA91bFNC5ntsDHOhQgcnKzMopwdl-CGRklsjOXOkBfhyGPtN1UdkkaBcKFg7suyL8oMmU-rhASfSY9TJYbU8lCtAZ6VfSlDawEA7GeZ7e4JwhHq8UTPf9U6Hg4MtMruBP0PryKJOBEp",
  // };

  // admin
  //   .messaging()
  //   .send(message)
  //   .then((res) => {
  //     console.log("Res", res);
  //   })
  //   .catch((err) => {
  //     console.log("Err", err);
  //   });
});

// Roomok amiben benen vagyok - SELECT rooms.id, rooms.RoomKey FROM roommembers INNER JOIN rooms ON roommembers.RoomID = rooms.id WHERE roommembers.UserID=1;

// RoomKey alaplján a room tagok [UserID, Username, RoomKey] - SELECT roommembers.UserID, users.Username, rooms.RoomKey FROM roommembers, rooms, users WHERE rooms.RoomKey='123456' and rooms.id = roommembers.RoomID AND roommembers.UserID!=1 AND users.id = roommembers.UserID;

// Roomonkent lekreni az uzenetet - SELECT messages.id, messages.SenderID, messages.Text, messages.RoomID FROM rooms, messages WHERE rooms.RoomKey='123456' AND rooms.id = messages.RoomID;

// Roomok alapjan az uzenetek - SELECT * FROM messages INNER JOIN rooms ON rooms.id = messages.RoomID WHERE messages.SenderID=1;

// SELECT rooms.id AS 'RoomID', rooms.RoomKey, messages.id, messages.SenderID, messages.Text, messages.RoomID, messages.Date FROM messages INNER JOIN rooms ON rooms.RoomKey =  WHERE rooms.RoomKey='123456';

app.get("/verifyemail/:Token", (req, res) => {
  if (req.params.Token) {
    connection.query("SELECT * FROM verifyemails WHERE Token=?", req.params.Token, function (verr, vres) {
      if (verr) throw verr;
      if (vres.length) {
        connection.query("UPDATE users SET Verified=? WHERE id=?", [1, vres[0].UserID], function (uverr, uverres) {
          if (uverr) throw uverr;
          connection.query("DELETE FROM verifyemails WHERE Token=?", req.params.Token, function (dverr, dverres) {
            if (dverr) throw dverr;
            res.redirect("http://localhost:3000/emailverify");
          });
        });
      } else {
        return res.status(200).json({
          succes: false,
          message: "Invalid Token!",
        });
      }
    });
  } else {
    return res.status(200).json({
      succes: false,
      message: "No Token found",
    });
  }
});

app.post("/forgot-password", (req, res) => {
  if (req.body.email) {
    connection.query("SELECT * FROM users WHERE Email=?", req.body.email, function (ferr, fres) {
      if (ferr) throw ferr;
      if (fres.length) {
        let info = {
          UserID: fres[0].id,
          Token: GenerateToken(32),
          Date: getFullDate(),
        };
        connection.query("SELECT * FROM forgotpasswords WHERE UserID=?", fres[0].id, function (ferr, feres) {
          if (ferr) throw ferr;
          if (!feres.length) {
            connection.query("INSERT INTO forgotpasswords SET ?", info, function (iferr, ifres) {
              if (iferr) throw iferr;
              if (ifres.insertId) {
                const config = {
                  service: "gmail",
                  auth: {
                    user: process.env.GMAILUSERNAME,
                    pass: process.env.GMAILPASSWORD,
                  },
                };

                const transporter = nodemailer.createTransport(config);

                let url = process.env.APPURL + "/reset-password/" + info.Token;
                let body = `
                <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; margin: 0; padding: 0">
                <div style="display: table; margin: 0 auto">
        <div style="max-width: 600px">
          <div style="text-align: center; margin-bottom: 20px">
            <h2 style="color: #20a090">Forgot Password</h2>
          </div>

          <p>Hello,</p>

          <p>You have requested to reset your password for your account with us. Please click on the button below to reset your password:</p>

          <a
            href="${url}"
            style="
              color: #20a090;
              text-decoration: none;
              display: inline-block;
              background-color: #20a090;
              color: #fff;
              font-weight: bold;
              font-size: 16px;
              padding: 10px 20px;
              border-radius: 4px;
              text-align: center;
              text-decoration: none;
              margin-top: 20px;
            "
            >Reset Password</a
          >

          <p>If you did not request to reset your password, please ignore this email.</p>

          <div style="margin-top: 40px; text-align: center">
            <p style="font-size: 14px; color: #999; margin-bottom: 10px">&copy; Chateo 2023</p>
          </div>
        </div>
      </div>
    </div>
                `;
                let message = {
                  from: process.env.GMAILUSERNAME,
                  to: fres[0].Email,
                  subject: "Forgot Password",
                  html: body,
                };
                transporter.sendMail(message, (err, info) => {
                  console.log("err", err);
                  console.log("Message sent: %s", info.messageId);
                  return res.status(200).json({
                    succes: true,
                    message: "Succesful Password Reset! You email has been sent to the email address.",
                  });
                });
              } else {
                return res.status(200).json({
                  succes: false,
                  message: "Something went wrong!",
                });
              }
            });
          } else {
            return res.status(200).json({
              succes: false,
              message: "You already requested a password reset",
            });
          }
        });
      } else {
        return res.status(200).json({
          succes: false,
          message: "No user found with this email!",
        });
      }
    });
  } else {
    return res.status(200).json({
      succes: false,
      message: "No Email found",
    });
  }
});

app.post("/reset-password", async (req, res) => {
  if (req.body.Token) {
    if (req.body.Password && req.body.PasswordConfirm) {
      if (req.body.Password == req.body.PasswordConfirm) {
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        connection.query(
          "SELECT forgotpasswords.UserID, forgotpasswords.Token, forgotpasswords.Date, users.FullName, users.Email FROM forgotpasswords INNER JOIN users ON users.id=forgotpasswords.UserID WHERE forgotpasswords.Token=?;",
          req.body.Token,
          function (ferr, fres) {
            if (ferr) throw ferr;
            if (fres.length) {
              connection.query(
                "UPDATE users SET Password=? WHERE id=?",
                [hashedPassword, fres[0].UserID],
                function (uperr, upres) {
                  if (uperr) throw uperr;
                  connection.query("DELETE FROM forgotpasswords WHERE Token=?", req.body.Token, function (derr, dres) {
                    if (derr) throw derr;
                    // Your password has been reseted emal
                    const config = {
                      service: "gmail",
                      auth: {
                        user: process.env.GMAILUSERNAME,
                        pass: process.env.GMAILPASSWORD,
                      },
                    };

                    const transporter = nodemailer.createTransport(config);

                    let body = `
                <div style="border: 1px solid black">
                  <p>Your password has been resetted</p>
                  <p>FullName: ${fres[0].FullName}</p>
                  <p>Date: ${getFullDate()}</p>
                </div>
                `;
                    let message = {
                      from: "kokeny.szabolcs04@gmail.com",
                      to: fres[0].Email,
                      subject: "Your password has been resetted",
                      html: body,
                    };
                    transporter.sendMail(message, (err, info) => {
                      console.log("Message sent: %s", info.messageId);
                      return res.status(200).json({
                        succes: true,
                        message: "Succesful registraion! You confirm email has been sent to your email address.",
                      });
                      if (err) {
                        console.log("Error occurred. " + err.message);
                        // return process.exit(1);
                      }
                    });
                    return res.status(200).json({
                      succes: true,
                      message: "Succesful Password Reset!",
                    });
                  });
                }
              );
            } else {
              return res.status(200).json({
                succes: false,
                message: "Invalid Token!",
              });
            }
          }
        );
      } else {
        return res.status(200).json({
          succes: false,
          message: "Passwords do not match!",
        });
      }
    } else {
      return res.status(200).json({
        succes: false,
        message: "Please fill out all the fields!",
      });
    }
  } else {
    return res.status(200).json({
      succes: false,
      message: "No Token found",
    });
  }
});

app.post("/Register", async (req, res) => {
  if (req.body.FullName && req.body.Password && req.body.Email) {
    const hasdhedPassword = await bcrypt.hash(req.body.Password, 10);

    let info = {
      FullName: req.body.FullName,
      Password: hasdhedPassword,
      Email: req.body.Email,
      RegDate: getFullDate(),
    };
    connection.query("INSERT INTO users SET ?", info, function (iuerr, iures) {
      if (iuerr) throw iuerr;
      if (iures.insertId) {
        const verifyemailmessage = {
          userID: iures.insertId,
          Token: GenerateToken(32),
          Date: getFullDate(),
        };
        connection.query("INSERT INTO verifyemails SET ?", verifyemailmessage, function (iverr, ivres) {
          if (iverr) throw iverr;
          if (ivres.insertId) {
            const config = {
              service: "gmail",
              auth: {
                user: process.env.GMAILUSERNAME,
                pass: process.env.GMAILPASSWORD,
              },
            };

            const transporter = nodemailer.createTransport(config);

            let url = "http://localhost:2004/verifyemail/" + verifyemailmessage.Token;
            let body = `
            <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333; padding: 0">
            <div style="display: table; margin: 0 auto">
              <div style="max-width: 600px">
                <div style="text-align: center; margin-bottom: 20px">
                  <h2 style="color: #20a090">Email Verification</h2>
                </div>
      
                <p>Dear User,</p>
      
                <p>Thank you for registering with us! To complete the registration process, we require you to verify your email address.</p>
      
                <p>Please click on the button below to verify your email:</p>
      
                <a
                  href="${url}"
                  style="
                    color: #20a090;
                    text-decoration: none;
                    display: inline-block;
                    background-color: #20a090;
                    color: #fff;
                    font-weight: bold;
                    font-size: 16px;
                    padding: 10px 20px;
                    border-radius: 4px;
                    text-align: center;
                    text-decoration: none;
                    margin-top: 20px;
                  "
                  >Verify Email</a
                >
      
                <p>If you did not register for our service, please ignore this email.</p>
      
                <div style="margin-top: 40px; text-align: center">
                  <p style="font-size: 14px; color: #999; margin-bottom: 10px">&copy; Chateo 2023</p>
                </div>
              </div>
            </div>
          </div>
            `;
            let message = {
              from: "kokeny.szabolcs04@gmail.com",
              to: info.Email,
              subject: "Verify Email",
              html: body,
            };
            transporter.sendMail(message, (err, info) => {
              console.log("Message sent: %s", info.messageId);
              return res.status(200).json({
                succes: true,
                message: "Succesful registraion! You confirm email has been sent to your email address.",
              });
              if (err) {
                console.log("Error occurred. " + err.message);
                // return process.exit(1);
              }
            });

            // return res.status(200).json({
            //   succes: true,
            //   message: "Succesful registraion! You confirm email has been sent to your email address.",
            // });
          }
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
  if (req.body.Email && req.body.Password) {
    connection.query("SELECT * FROM users WHERE Email=?", req.body.Email, function (suerr, sures) {
      if (suerr) throw suerr;
      if (sures.length) {
        if (sures[0].Verified == 1) {
          bcrypt.compare(req.body.Password, sures[0].Password, function (err, isMath) {
            if (isMath) {
              if (sures[0].Secret == 0) {
                let info = {
                  UserID: sures[0].id,
                  Token: GenerateToken(32),
                  Date: getFullDate(),
                  Ip: getIp(req),
                };
                connection.query("INSERT INTO sessions SET ?", info, function (iserr, isres) {
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
                });
              } else {
                // Ha van 2FA
                let info = {
                  UserID: sures[0].id,
                  Token: GenerateToken(32),
                  Date: getFullDate(),
                  Ip: getIp(req),
                };
                connection.query("INSERT INTO twofalogins SET ?", info, function (iterr, itres) {
                  if (iterr) throw iterr;
                  return res.status(200).json({
                    succes: true,
                    twofalogin: true,
                    Token: info.Token,
                  });
                });
              }
            } else {
              return res.status(200).json({
                succes: false,
                message: "Incorrect password!",
              });
            }
          });
        } else {
          return res.status(200).json({
            succes: false,
            message: "You have to verify your email!",
          });
        }
      } else {
        return res.status(200).json({
          succes: false,
          message: "No account found with this name",
        });
      }
    });
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
      "SELECT users.id, users.FullName, users.Email, users.RegDate, users.AvatarURL FROM sessions INNER JOIN users ON sessions.UserID = users.id WHERE sessions.Token=?",
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
    const result = await getchats(req.body.myid);
    res.status(200).json({
      succes: true,
      chats: result,
    });
  }
});

app.post("/getallfriends", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "SELECT friends.FriendID as id, users.FullName, users.AvatarURL FROM friends, users WHERE UserID=? AND users.id = friends.FriendID;",
      req.body.myid,
      function (suerr, sures) {
        if (suerr) throw suerr;
        if (sures.length) {
          return res.status(200).json({
            succes: true,
            friends: sures,
          });
        } else {
          return res.status(200).json({
            success: false,
            friends: [],
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      success: false,
      message: "Unknown error",
    });
  }
});

app.post("/getalluser", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "SELECT users.id, users.FullName, users.AvatarURL FROM users WHERE users.id!=?",
      req.body.myid,
      function (suerr, sures) {
        if (suerr) throw suerr;
        if (sures.length) {
          return res.status(200).json({
            succes: true,
            users: sures,
          });
        } else {
          return res.status(200).json({
            success: true,
            users: [],
          });
        }
      }
    );
  } else {
    return res.status(200).json({
      success: false,
      message: "Unknown error",
    });
  }
});

// This also include isMyFriend \\
app.post("/getuser", (req, res) => {
  if (req.body.userid && req.body.myid) {
    connection.query("SELECT * FROM users WHERE users.id=?", req.body.userid, function (suerr, sures) {
      if (suerr) throw suerr;
      if (sures.length) {
        connection.query(
          "SELECT * FROM friends WHERE UserID=? AND FriendID=?",
          [req.body.myid, req.body.userid],
          function (sferr, sfres) {
            if (sferr) throw sferr;
            return res.status(200).json({
              succes: true,
              user: sures[0],
              ismyfriend: Boolean(sfres.length),
            });
          }
        );
      } else {
        return res.status(200).json({
          success: false,
          user: null,
        });
      }
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Unknown error",
    });
  }
});

app.post("/getonlinefriends", async (req, res) => {
  if (req.body.myid) {
    const result = await getchats(req.body.myid);
    let onlinefriends = [];
    for (let i = 0; i < result.length; i++) {
      let UserStatus = JSON.parse(result[i]?.Status || null);
      if (UserStatus?.Status == "Online") {
        onlinefriends.push(result[i]);
      }
    }
    res.status(200).json({
      succes: true,
      chats: onlinefriends,
    });
  }
});

// Friend Request \\

app.post("/getallusers", (req, res) => {
  if (req.body.myid) {
    connection.query(
      "SELECT id, FullName, Email, AvatarURL FROM `users` WHERE id!=?",
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
                    if (sfres.length > 0) {
                      return res.status(200).json({
                        succes: false,
                        message: "The user is already on your friends list!",
                      });
                    } else {
                      let info = {
                        UserID: req.body.myid,
                        TargetID: req.body.targetid,
                        Date: getFullDate(),
                      };
                      connection.query("INSERT INTO pendingfriendrequests SET ?", info, function (iperr, ipres) {
                        if (iperr) throw iperr;
                        if (ipres.insertId) {
                          return res.status(200).json({
                            succes: true,
                            message: "You have successfully sent a friend request",
                          });
                        } else {
                          return res.status(200).json({
                            succes: false,
                            message: "Unexpected error!",
                          });
                        }
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
            connection.query("DELETE FROM pendingfriendrequests WHERE id=?", spres[0].id, function (dperr, dpres) {
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
              connection.query("INSERT INTO friends SET ?", info, function (iferr, ifres) {
                if (iferr) throw iferr;
                connection.query("INSERT INTO friends SET ?", revinfo, function (ifferr, iffres) {
                  if (ifferr) throw ifferr;
                  let rminfo = {
                    RoomKey: GenerateToken(6),
                    Date: getFullDate(),
                  };
                  connection.query("INSERT INTO rooms SET ?", rminfo, function (irerr, irres) {
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
                      connection.query("INSERT INTO roommembers SET ?", rm, function (irmerr, irmres) {
                        if (irmerr) throw irmerr;
                        if (irmres.insertId) {
                          connection.query("INSERT INTO roommembers SET ?", rmrev, function (irmmerr, irmmres) {
                            if (irmmerr) throw irmmerr;
                            if (irmmres.insertId) {
                              return res.status(200).json({
                                succes: true,
                                message: "You have successfully accepted the friend request!",
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                });
              });
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
      connection.query(
        "SELECT * FROM pendingfriendrequests WHERE TargetID=? AND UserID=?",
        [req.body.myid, req.body.data.id],
        function (sperr, spres) {
          if (sperr) throw sperr;
          if (spres.length) {
            connection.query("DELETE FROM pendingfriendrequests WHERE id=?", spres[0].id, function (dperr, dpres) {
              if (dperr) throw dperr;
              return res.status(200).json({
                succes: true,
                message: "You successfully declined the friend request!",
              });
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
        // console.log(uares);
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
  if (req.body.myid && req.body.currpass && req.body.newpass && req.body.newpassagn) {
    const hasdhedPassword = await bcrypt.hash(req.body.newpass, 10);
    if (req.body.newpass != req.body.newpassagn || req.body.newpass == req.body.currpass) {
      return res.status(200).json({
        succes: false,
        message: "The new passwords do not match!",
      });
    } else {
      connection.query("SELECT * FROM users WHERE id=?", req.body.myid, function (suerr, sures) {
        if (suerr) throw suerr;
        if (sures.length) {
          bcrypt.compare(req.body.currpass, sures[0].Password, function async(err, isMath) {
            if (isMath) {
              connection.query(
                "UPDATE users SET Password=? WHERE id=?",
                [hasdhedPassword, req.body.myid],
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
          });
        } else {
          return res.status(200).json({
            succes: false,
            message: "Unexpected error!",
            debug: true,
          });
        }
      });
    }
  } else {
    return res.status(200).json({
      succes: false,
      message: "Need data!",
    });
  }
});

app.post("/updatefcmtoken", (req, res) => {
  if (req.body.myid && req.body.fcmtoken) {
    connection.query(
      "UPDATE users SET FcmToken=? WHERE id=?",
      [req.body.fcmtoken, req.body.myid],
      function (uferr, ufres) {
        if (uferr) throw uferr;
        return res.status(200).json({
          succes: true,
          message: "You have successfully updated your FCM Token!",
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

app.post("/deleteaccount", (req, res) => {
  if (req.body.myid) {
    connection.query("SELECT * FROM users WHERE id=?", req.body.myid, function (suerr, sures) {
      if (suerr) throw suerr;
      if (sures.length) {
        connection.query("DELETE FROM messages WHERE SenderID=?", req.body.myid, function (dmerr, dmres) {
          if (dmerr) throw dmerr;
          connection.query("DELETE FROM roommembers WHERE UserID=?", req.body.myid, function (drerr, drres) {
            if (drerr) throw drerr;
            connection.query("DELETE FROM sessions WHERE UserID=?", req.body.myid, function (dserr, dsres) {
              if (dserr) throw dserr;
              connection.query("DELETE FROM friends WHERE UserID=?", req.body.myid, function (dferr, dres) {
                if (dferr) throw dferr;
                connection.query("DELETE FROM friends WHERE FriendID=?", req.body.myid, function (dferrr, dfress) {
                  if (dferrr) throw dferrr;
                  connection.query("DELETE FROM users WHERE id=?", req.body.myid, function (duerr, dures) {
                    if (duerr) throw duerr;
                    return res.status(200).json({
                      succes: true,
                      message: "You have successfully deleted your user!",
                    });
                  });
                });
              });
            });
          });
        });
      } else {
        return res.status(200).json({
          succes: false,
          message: "Unexpected error!",
        });
      }
    });
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
  res.sendFile(fileName, options, function (err) {
    if (err) {
      if (err.code === "ENOENT") {
        res.sendFile("DefaultAvatar.png", options);
      }
    }
  });
});

app.get("/Images/:id", (req, res) => {
  var options = {
    root: path.join("./public/UsersProfileImg/"),
  };

  var fileName = req.params.id;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      if (err.code === "ENOENT") {
        res.sendFile("DefaultAvatar.png", options);
      }
    }
  });
});

app.post("/logout", (req, res) => {
  if (req.body.myid) {
    connection.query("DELETE FROM sessions WHERE UserID=?", req.body.myid, function (dserr, dsres) {
      if (dserr) throw dserr;
      return res.status(200).json({
        succes: true,
        message: "Succesful logout!",
      });
    });
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
      "SELECT users.id, users.FullName, users.AvatarURL FROM friends INNER JOIN users ON users.id=friends.FriendID WHERE UserID=?",
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
    connection.query("INSERT INTO rooms SET ?", roomsinsert, function (irerr, irres) {
      if (irerr) throw irerr;
      if (irres.insertId) {
        let i = 0;
        req.body.Persons.forEach((e) => {
          i++;
          let rminfo = {
            RoomID: irres.insertId,
            UserID: e.id,
          };
          connection.query("INSERT INTO roommembers SET ? ", rminfo, function (irmerr, irmres) {
            if (irmerr) throw irmerr;
          });
          if (i == req.body.Persons.length) {
            let myinfo = {
              RoomID: irres.insertId,
              UserID: req.body.myid,
            };
            connection.query("INSERT INTO roommembers SET ?", myinfo, function (irmmerr, irmmres) {
              if (irmmerr) throw irmmerr;
              if (irmmres.insertId) {
                return res.status(200).json({
                  succes: true,
                  message: "Succesfuly create the group called " + req.body.Name + " !",
                });
              } else {
                return res.status(200).json({
                  succes: false,
                  message: "Unexpected error!",
                });
              }
            });
          }
        });
      } else {
        return res.status(200).json({
          succes: false,
          message: "Unexpected error!",
        });
      }
    });
  } else {
    return res.status(200).json({
      succes: false,
      message: "Unexpected error!",
    });
  }
});

app.post("/upploadimage", upload.single("file"), async (req, res) => {
  // console.log(req.file.filename);
  console.log("Image upload");
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

async function sendfirebasenotifications(roomkey, senderdatas, message, imageurls) {
  console.log("sendfirebasenotifications");
  // console.log(roomkey, senderdatas, message, imageurls);
  const mysqlprom = require("mysql2/promise");
  const contprom = await mysqlprom.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
  });
  const [fres, ferr] = await contprom.execute(
    "SELECT rooms.id, rooms.RoomKey, rooms.Name, rooms.CoverURL AS AvatarURL FROM rooms WHERE rooms.RoomKey=?",
    [roomkey]
  );
  // console.log(fres);
  const [rmres, rmerr] = await contprom.execute(
    "SELECT users.id, users.FullName, users.FcmToken FROM rooms INNER JOIN roommembers ON roommembers.RoomID = rooms.id INNER JOIN users ON users.id = roommembers.UserID WHERE rooms.RoomKey=? AND users.id!=?",
    [fres[0].RoomKey, senderdatas.id]
  );
  // console.log(rmres);
  // Needs to create the format.
  // console.log(rmres);
  for (let i = 0; i < rmres.length; i++) {
    const [srmres, srmerr] = await contprom.execute(
      "SELECT rooms.id, users.id AS UserID, users.Status AS Status, users.FullName AS Name, users.AvatarURL, rooms.RoomKey FROM roommembers INNER JOIN users ON roommembers.UserID=users.id INNER JOIN rooms ON roommembers.RoomID=rooms.id WHERE rooms.RoomKey=? AND users.id=?",
      [fres[0].RoomKey, rmres[i].id]
    );
    let status = JSON.parse(srmres[0].Status);
    console.log(status.Status);

    // console.log("rmres[i].FcmToken");
    // console.log(rmres[i].FcmToken);
    console.log("elotte");
    if (!rmres[i].FcmToken) return;
    console.log("utana");
    console.log(srmres[0].Status);
    if (status.Status == "Online") return;
    const fcmmessage = {
      notification: {
        // title: senderdatas.FullName,
        title: "New message",
        body: senderdatas.FullName + " sent you a message!",
      },
      token: rmres[i].FcmToken,
      data: {
        roomkey: roomkey,
      },
    };
    console.log(fcmmessage);
    admin
      .messaging()
      .send(fcmmessage)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  }
}

// const message = {
//   notification: {
//     title: "New message",
//     body: "You have a new message from a ",
//   },
//   token: "dYmsSFxJTUuCJHmWc4_uhy:APA91bEoeFSJGJAEx_KOG9ICvYVLYeZfacg7Rwfabmt70z-EvKBNPjk4pk4l_DR2SvVJ_vZjWnYDKY_Z9ruJezOfgrpOUSBCiiUrw4-6Zz-RybpGG7llKF_5DZONL4vjThRsi7ApIHZm",
// };

// admin
//   .messaging()
//   .send(message)
//   .then((res) => {
//     console.log("Res", res);
//   })
//   .catch((err) => {
//     console.log("Err", err);
//   });

// console.log(srmres);
//     const payload = {
//       notification: {
//         title: senderdatas.FullName,
//         body: message,
//         image: imageurls,
//         // click_action: "https://messengerinreact.herokuapp.com/chat/" + srmres[0].RoomKey,
//       },
//     };
//     admin
//       .messaging()
//       .sendToDevice(rmres[i].FcmToken, payload)
//       .then((response) => {
//         console.log("Successfully sent message:", response);
//       })
//       .catch((error) => {
//         console.log("Error sending message:", error);
//       });

async function getchats(myid) {
  const mysqlprom = require("mysql2/promise");
  const contprom = await mysqlprom.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  const [fres, ferr] = await contprom.execute(
    "SELECT rooms.id, rooms.RoomKey, rooms.Name, rooms.CoverURL AS AvatarURL FROM roommembers INNER JOIN rooms ON rooms.id=roommembers.RoomID WHERE UserID=?",
    [myid]
  );
  // console.log("fres");
  // console.log(fres);
  let datas = [];
  for (let i = 0; i < fres.length; i++) {
    const [srmres, srmerr] = await contprom.execute(
      "SELECT rooms.id, users.id AS UserID, users.Status AS Status, users.FullName AS Name, users.AvatarURL, rooms.RoomKey FROM roommembers INNER JOIN users ON roommembers.UserID=users.id INNER JOIN rooms ON rooms.id=roommembers.RoomID WHERE RoomID=? AND UserID!=?",
      [fres[i].id, myid]
    );
    // console.log("srmres");
    // console.log(srmres);
    const [slmres, slmerr] = await contprom.execute(
      "SELECT messages.Text, messages.ImageIDs, users.FullName, users.id AS UserID, messages.RoomID, messages.Date FROM `messages` INNER JOIN users ON messages.SenderID = users.id WHERE messages.RoomID = ? ORDER BY Date DESC LIMIT 1;",
      [fres[i].id]
    );
    // console.log("slmres");
    // console.log(slmres);
    if (srmres.length > 1) {
      //Group message
      fres[i].Notification = 0;
      fres[i].isGroup = true;
      if (slmres.length) {
        fres[i].LastMessage = {
          Text: slmres[0].Text,
          Date: slmres[0].Date,
          SenderID: slmres[0].UserID,
          SenderName: slmres[0].FullName,
          ImageIDs: slmres[0].ImageIDs,
        };
      }
      // console.log(fres[i]);
      datas.push(fres[i]);
    } else {
      //Private message
      srmres[0].Notification = 0;
      srmres[0].isGroup = false;
      if (slmres.length) {
        srmres[0].LastMessage = {
          Text: slmres[0].Text,
          Date: slmres[0].Date,
          SenderID: slmres[0].UserID,
          SenderName: slmres[0].FullName,
          ImageIDs: slmres[0].ImageIDs,
        };
      }
      // console.log(srmres[0]);
      // srmres[0].Status = "Offline";
      datas.push(srmres[0]);
    }
  }
  return datas;
}

async function getfriendandrooms(myid) {
  const mysqlprom = require("mysql2/promise");
  const contprom = await mysqlprom.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  let returndata = [];
  const [fres, ferr] = await contprom.execute(
    "SELECT friends.UserID, friends.FriendID, users.FullName, users.AvatarURL FROM friends, users WHERE UserID=? AND users.id = friends.FriendID",
    [myid]
  );

  const [myrmres, myrmerr] = await contprom.execute("SELECT * FROM roommembers WHERE UserID=?", [myid]);
  for (let k = 0; k < fres.length; k++) {
    const [frres, frerr] = await contprom.execute("SELECT * FROM roommembers WHERE UserID=?", [fres[k].FriendID]);
    for (let i = 0; i < myrmres.length; i++) {
      for (let j = 0; j < frres.length; j++) {
        if (myrmres[i].RoomID == frres[j].RoomID) {
          const [srmres, srmerr] = await contprom.execute("SELECT * FROM rooms WHERE id=?", [frres[j].RoomID]);
          let info = {
            FreindID: fres[k].FriendID,
            FullName: fres[k].FullName,
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
  return returndata;
}

async function getmygroups(myid) {
  const mysqlprom = require("mysql2/promise");
  const contprom = await mysqlprom.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  const [srres, srerr] = await contprom.execute(
    "SELECT groups.id, groups.GroupKey, groups.Name, groups.CoverURL FROM groupmembers INNER JOIN groups ON groups.id=groupmembers.GroupID WHERE UserID=?",
    [myid]
  );
  return srres;
}

app.post("/checkuserstate", (req, res) => {
  if (req.body.UserID) {
    connection.query("SELECT id, Status FROM users WHERE id=?", req.body.UserID, function (suerr, sures) {
      if (suerr) throw suerr;
      if (sures.length) {
        return res.status(200).json({
          succes: true,
          userdata: sures[0],
          message: "Succesful",
        });
      }
    });
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
    connection.query("SELECT Secret FROM users WHERE id=?", req.body.myid, function (suerr, sures) {
      if (suerr) throw suerr;
      if (sures.length) {
        let verified = verifytwofacode(req.body.key, sures[0].Secret);
        console.log(verified);
        if (verified) {
          connection.query("UPDATE users SET Secret=? WHERE id=?", ["0", req.body.myid], function (uuerr, uures) {
            if (uuerr) throw uuerr;
            return res.status(200).json({
              succes: true,
              message: "Succesfully turned off the 2FA!",
            });
          });
        } else {
          return res.status(200).json({
            succes: false,
            message: "Incorrect code!",
          });
        }
      }
    });
  } else {
    return res.status(200).json({
      succes: false,
      message: "Fill out the data!",
    });
  }
});

app.post("/verifytwofa", (req, res) => {
  if (req.body.key && req.body.token) {
    connection.query("SELECT * FROM twofalogins WHERE Token=?", req.body.key, function (sterr, stres) {
      if (sterr) throw sterr;
      if (stres.length) {
        connection.query("SELECT * FROM users WHERE id=?", stres[0].UserID, function (suerr, sures) {
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
              connection.query("INSERT INTO sessions SET ?", info, function (iserr, isres) {
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
                    connection.query("DELETE FROM twofalogins WHERE Token=?", req.body.key, function (dterr, dtres) {
                      if (dterr) throw dterr;
                      return res.status(200).json({
                        succes: true,
                        message: "Succesful Login!",
                        token: info.Token,
                        user: sures[0],
                      });
                    });
                  }
                );
              });
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
        });
      } else {
        return res.status(200).json({
          succes: false,
          urlerror: true,
          message: "UrlToken not found!",
        });
      }
    });
  } else {
    return res.status(200).json({
      succes: false,
      message: "Fill the datas!",
    });
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
    connection.query("SELECT Secret FROM users WHERE id=?", req.body.myid, function (ssuerr, ssures) {
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
    });
  } else {
    return res.status(200).json({
      succes: false,
      message: "No datas found!",
      secret: false,
    });
  }
});

app.post("/deletefriend", async (req, res) => {
  if (req.body.myid && req.body.partnerid) {
    const result = await handledeletefriend(req.body.myid, req.body.partnerid);
    if (result) {
      connection.query(
        "DELETE FROM friends WHERE UserID=? AND FriendID=?",
        [req.body.myid, req.body.partnerid],
        function (dferr, dfres) {
          if (dferr) throw dferr;
          connection.query(
            "DELETE FROM friends WHERE UserID=? AND FriendID=?",
            [req.body.partnerid, req.body.myid],
            function (dferr, dfres) {
              if (dferr) throw dferr;
              return res.status(200).json({
                succes: true,
                message: "Succesfully deleted the friend!",
                friendid: req.body.partnerid,
              });
            }
          );
        }
      );
    }
  } else {
    return res.status(200).json({
      succes: false,
      message: "No datas found!",
    });
  }
});

async function handledeletefriend(myid, friendid) {
  const mysqlprom = require("mysql2/promise");
  const contprom = await mysqlprom.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  const [mysrres, mrsrerr] = await contprom.execute("SELECT * FROM roommembers WHERE UserID=?", [myid]);
  for (let i = 0; i < mysrres.length; i++) {
    const [fsrres, fsrerr] = await contprom.execute(
      "SELECT roommembers.id, RoomID, UserID, rooms.Name FROM roommembers INNER JOIN rooms ON RoomID=rooms.id WHERE RoomID=? AND UserID=?",
      [mysrres[i].RoomID, friendid]
    );
    if (fsrres.length) {
      if (fsrres[0].Name == "") {
        const [drmres, drmerr] = await contprom.execute("DELETE FROM roommembers WHERE RoomID=?", [fsrres[0].RoomID]);
      }
    }
  }
  return true;
}

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
  var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}
function getIp(req) {
  return req.connection.remoteAddress.replace("::ffff:", "");
}

// app.listen(port, () => {
//   console.log("App listen on port", port);
// });
