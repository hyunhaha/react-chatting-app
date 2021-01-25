import React from "react";
import ChattingRoom from "./chatting_room";
import DirectMessages from "./direct_messages";
import Favorited from "./favorited";
import UserPanel from "./user_panel";
const SidePanel = props => {
  return (
    <div
      style={{
        backgroundColor: "#7B83EB",
        padding: "2rem",
        minHeight: "100vh",
        color: "white",
        minWidth: "275px",
      }}
    >
      <UserPanel />
      <Favorited />
      <ChattingRoom />
      <DirectMessages />
    </div>
  );
};

export default SidePanel;
