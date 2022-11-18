import React from "react";
import attachmentimg from "../assets/svgs/attachment.svg";

function FileUploadComponent({ callback }) {
  const handleChange = async (e) => {
    const src = URL.createObjectURL(e.target.files[0]);
    if (e.target.files.length > 0) {
      let srcs = [];
      for (let i = 0; i < e.target.files.length; i++) {
        srcs.push(e.target.files[i]);
      }
      callback(srcs);
    }
  };
  return (
    <div
      style={{
        width: "10%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <label
        htmlFor="file-input"
        style={{
          cursor: "pointer",
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={attachmentimg} />
      </label>

      <input
        style={{ display: "none" }}
        id="file-input"
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={handleChange}
        multiple
      />
    </div>
  );
}

export default FileUploadComponent;
