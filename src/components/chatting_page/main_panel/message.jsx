import React from "react";
import moment from "moment";
import styles from "./message.module.css";
const Message = ({ message, user }) => {
  const timeFromNow = timeStamp => moment(timeStamp).fromNow();

  const isImage = message => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };
  const isMessageMine = (message, user) => {
    if (user) {
      return message.user.id === user.uid;
    }
  };
  return (
    <div
      className={
        isMessageMine(message, user) ? styles.messageMine : styles.message
      }
    >
      <img
        className={styles.profileImg}
        width={48}
        height={48}
        src={message.user.image}
        alt="message user name"
      />
      <div
        className={
          isMessageMine(message, user)
            ? styles.messageDataMine
            : styles.messageData
        }
      >
        <h6
          className={
            isMessageMine(message, user) ? styles.nameTimeMine : undefined
          }
        >
          {!isMessageMine(message, user) && message.user.name}
          <span className={styles.time}>{timeFromNow(message.timeStamp)}</span>
        </h6>
        {isImage(message) ? (
          <img
            style={{ maxWidth: "300px" }}
            alt="profile"
            src={message.image}
          />
        ) : (
          <div>{message.content}</div>
        )}
      </div>
    </div>
  );
};

export default Message;
