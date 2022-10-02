var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kokeny.szabolcs2004@gmail.com",
    pass: "sabitomi",
  },
});

var mailOptions = {
  from: "kokeny.szabolcs2004@gmail.com",
  to: "kokeny.szabolcs04@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

function send() {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

send();
