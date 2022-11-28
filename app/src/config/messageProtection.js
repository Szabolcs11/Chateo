import { emojis } from "./globalVariables.js";

export function EncryptMessage(message, roomkey) {
  let MessageInAascii = ConvertToAscii(message, KeyToAscii(roomkey));
  return MessageInAascii;
}

export function DecodeMessage(message, roomkey) {
  let AsciiResInArray = asciiArray(
    message,
    message.length,
    KeyToAscii(roomkey)
  );
  let DecodedMessage = asciiToSentence(AsciiResInArray, AsciiResInArray.length);
  return DecodedMessage;
}

function KeyToAscii(key) {
  let res = "";
  for (let i = 0; i < key.length; i++) {
    res = res + key[i].charCodeAt();
  }
  return res;
}

function asciiArray(str, len, keyy) {
  let res = [];
  let stringres = "";
  var num = 0;
  for (var i = 0; i < len; i++) {
    num = num * 10 + (str[i] - "0");
    if (num >= 32 * keyy && num <= 259 * keyy) {
      res.push(Math.round(num / keyy));
      num = 0;
    }
  }
  return res;
}

function asciiToSentence(str, len) {
  let res = [];
  let stringres = "";
  var num = 0;
  for (var i = 0; i < len; i++) {
    num = num * 10 + (str[i] - "0");
    if (num == 256) {
      stringres = stringres + "ő";
      num = 0;
    }
    if (num == 257) {
      stringres = stringres + "Ő";
      num = 0;
    }
    if (num == 258) {
      stringres = stringres + "ű";
      num = 0;
    }
    if (num == 259) {
      stringres = stringres + "Ű";
      num = 0;
    }
    if (num >= 32 && num <= 255) {
      var ch = String.fromCharCode(num);
      if (ch != "" && ch != null) {
        res.push(ch);
        stringres = stringres + ch;
      }
      num = 0;
    }
  }
  stringres = ConvertEmojis(stringres, 1);
  return stringres;
}

function ConvertToAscii(message, key) {
  let resstring = "";
  message = ConvertEmojis(message, 0);
  for (let i = 0; i < message.length; i++) {
    if (message[i] == "ő") {
      resstring = resstring + (256 * key).toString();
    } else if (message[i] == "Ő") {
      resstring = resstring + (257 * key).toString();
    } else if (message[i] == "ű") {
      resstring = resstring + (258 * key).toString();
    } else if (message[i] == "Ű") {
      resstring = resstring + (259 * key).toString();
    } else {
      resstring = resstring + message[i].charCodeAt() * key;
    }
  }
  return resstring;
}

function ConvertEmojis(message, number) {
  if (number == 0) {
    for (let i = 0; i < emojis.length; i++) {
      message = message.replaceAll(emojis[i][0], emojis[i][1]);
    }
  } else {
    for (let i = 0; i < emojis.length; i++) {
      message = message.replaceAll(emojis[i][1], emojis[i][0]);
    }
  }
  return message;
}

function CutTheKey(str) {
  console.log(str);
  str = str.substring(0, str.length - 28);
  console.log(str);
  return str;
}
