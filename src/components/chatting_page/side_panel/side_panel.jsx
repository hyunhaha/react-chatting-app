import React from "react";
import ChattingRoom from "./chatting_room";
import DirectMessages from "./direct_messages";
import Favorite from "./favorite";
import UserPanel from "./user_panel";
import styles from "./side_panel.module.css";
const SidePanel = props => {
  return (
    <div className={styles.sidePanel}>
      <UserPanel />
      <Favorite />
      <ChattingRoom />
      <DirectMessages />
    </div>
  );
};

export default SidePanel;
