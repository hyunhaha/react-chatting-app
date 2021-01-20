import React from "react";
import MainPanel from "./main_panel/mainPanel";
import SidePanel from "./side_panel/side_panel";
import styles from "./chatting_page.module.css";
import { useSelector } from "react-redux";
const ChattingPage = props => {
  const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  return (
    <div className={styles.chattingPage}>
      <div className={styles.sidePanel}>
        <SidePanel />
      </div>
      <div className={styles.mainPanel}>
        <MainPanel key={currentChatRoom && currentChatRoom.id} />
      </div>
    </div>
  );
};

export default ChattingPage;
