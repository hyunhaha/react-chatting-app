import React, { Component } from "react";
import Message from "./message";
import MessageHeader from "./message_header";
import MessageForm from "./message_form";
import styles from "./main_panel.module.css";
class MainPanel extends Component {
  render() {
    return (
      <div className={styles.mainPanel}>
        <MessageHeader />
        <div className={styles.messageBox}>
          <Message />
        </div>

        <MessageForm />
      </div>
    );
  }
}

export default MainPanel;
