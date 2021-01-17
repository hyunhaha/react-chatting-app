import React from "react";
import MainPanel from "./main_panel/mainPanel";
import SidePanel from "./side_panel/side_panel";
import styles from "./chatting_page.module.css";
const ChattingPage = props => {
  return (
    <div className={styles.chattingPage}>
      <div className={styles.sidePanel}>
        <SidePanel />
      </div>
      <div className={styles.mainPanel}>
        <MainPanel />
      </div>
    </div>
  );
};

export default ChattingPage;
