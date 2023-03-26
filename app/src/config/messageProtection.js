export function EncryptMessage(message, roomkey) {
  let result = CodeMessage(message, KeyToAscii(roomkey));
  return result;
}

export function DecodeMessage(message, roomkey) {
  let result = DecryptMessage(message, KeyToAscii(roomkey));
  return result;
}

function CodeMessage(message, key) {
  let utf8 = encodeURIComponent(message);
  let codedres = "";
  for (let i = 0; i < utf8.length; i++) {
    codedres = codedres + utf8[i].charCodeAt() * key;
  }
  return codedres;
}

function DecryptMessage(message, key) {
  let stringres = "";
  var num = 0;
  for (var i = 0; i < message.length; i++) {
    num = num * 10 + (message[i] - "0");
    if (num >= 32 * key && num <= 255 * key) {
      var ch = String.fromCharCode(Math.round(num / key));
      if (ch != "" && ch != null) {
        stringres = stringres + ch;
      }
      num = 0;
    }
  }
  const ascii = decodeURIComponent(stringres);
  return ascii;
}

function KeyToAscii(key) {
  let res = "";
  for (let i = 0; i < key.length; i++) {
    res = res + key[i].charCodeAt();
  }
  return res;
}
