import React, { useState } from "react";
import "./rightbar.css";
import FriendReq from "../Friendreq/FriendReq";


export default function RightBar() {

  return (
    <div className="rightBar">
      <div className="rightbar-container">
        <FriendReq />
      </div>
    </div>
  );
}
