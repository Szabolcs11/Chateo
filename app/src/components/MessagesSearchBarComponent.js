import React from "react";
import searchicon from "../assets/svgs/search.svg";
import { searchchats } from "./Persons";

function MessagesSearchBarComponent() {
  const searchTextChange = (e) => {
    searchchats(e.target.value);
  };
  return (
    <div className="searchbar-main">
      <div className="searchbar-icon">
        <img alt="NoImgFound" src={searchicon} />
      </div>
      <div className="searchbar-text">
        <input
          onChange={(e) => searchTextChange(e)}
          className="searchbar-input"
          placeholder="Search"
          type="text"
        />
      </div>
    </div>
  );
}

export default MessagesSearchBarComponent;
