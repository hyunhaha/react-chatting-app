import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import styles from "./message_form.module.css";
import { useState } from "react";
import firebase from "../../../firebase";
import { useSelector } from "react-redux";
import { useRef } from "react";
import mime from "mime-types";
const MessageForm = props => {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const user = useSelector(state => state.user.currentUser);
  const imageFileOpenRef = useRef();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const messagesRef = firebase.database().ref("messages");
  const storageRef = firebase.storage().ref();
  const typingRef = firebase.database().ref("typing");
  const isPrivateChatRoom = useSelector(
    state => state.chatRoom.isPrivateChatRoom
  );
  const handelImageOpen = () => {
    imageFileOpenRef.current.click();
  };
  const getPath = () => {
    if (isPrivateChatRoom) {
      return `message/private/${chatRoom.id}`;
    } else {
      return `message/public`;
    }
  };
  const handleUploadImage = event => {
    const file = event.target.files[0];
    const filePath = `${getPath()}/${file.name}`;
    const metaData = { contentType: mime.lookup(file.name) };
    setLoading(true);
    try {
      let uploadTask = storageRef.child(filePath).put(file, metaData);
      uploadTask.on(
        "state_changed",
        UploadTaskSnapShot => {
          const percetage = Math.round(
            (UploadTaskSnapShot.bytesTransferred /
              UploadTaskSnapShot.totalBytes) *
              100
          );
          setPercentage(percetage);
        },
        err => {
          console.error(err);
          setLoading(false);
        },
        () => {
          //저장된 파일 url가져오기
          uploadTask.snapshot.ref.getDownloadURL().then(downLoadURL => {
            // console.log(downLoadURL);
            messagesRef
              .child(chatRoom.id)
              .push()
              .set(creageMessage(downLoadURL));
            setLoading(false);
          });
        }
      );
    } catch (error) {
      alert(error);
    }
  };
  const handleChange = event => {
    setContent(event.target.value);
  };

  const creageMessage = (fileUrl = null) => {
    const message = {
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }
    return message;
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors(prev => prev.concat("Tpye content first"));
      return;
    }
    setLoading(true);
    //firebase에 메시지를 저장한느 부분
    try {
      await messagesRef.child(chatRoom.id).push().set(creageMessage());

      typingRef.child(chatRoom.id).child(user.uid).remove();
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors(pre => pre.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };
  const handleKeyDown = event => {
    if (event.ctrlKey && event.keyCode === 13) {
      handleSubmit();
    }
    if (content) {
      typingRef.child(chatRoom.id).child(user.uid).set(user.displayName);
    } else {
      typingRef.child(chatRoom.id).child(user.uid).remove();
    }
  };
  return (
    <div>
      <div className={styles.sendBox}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            cols="30"
            rows="3"
            placeholder="input text"
            onKeyDown={handleKeyDown}
            value={content}
            onChange={handleChange}
          ></textarea>
        </form>
        <div className={styles.sendBoxButton}>
          <button
            className={styles.button}
            onClick={handelImageOpen}
            disabled={loading ? true : false}
          >
            <i className="fas fa-paperclip"></i>
          </button>
          <button
            onClick={handleSubmit}
            className={styles.button}
            disabled={loading ? true : false}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
          <input
            type="file"
            className={styles.fileInput}
            ref={imageFileOpenRef}
            onChange={handleUploadImage}
            accept="image/jpeg, image/png"
          />
        </div>
      </div>

      {!(percentage === 0 || percentage === 100) && (
        <ProgressBar
          variant="warning"
          label={`${percentage}%`}
          now={percentage}
        />
      )}

      <div>
        {errors.map(error => (
          <p className={styles.error} key={error}>
            {error}
          </p>
        ))}
      </div>
    </div>
  );
};

export default MessageForm;
