import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import styles from "./message_form.module.css";
import { useState } from "react";
import firebase from "../../../firebase";
import { useSelector } from "react-redux";

const MessageForm = props => {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const user = useSelector(state => state.user.currentUser);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesRef = firebase.database().ref("messages");

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
  return (
    <div>
      <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            value={content}
            onChange={handleChange}
            as="textarea"
            rows={3}
          />
        </Form.Group>
      </Form>
      <ProgressBar variant="warning" label="60%" now={60} />
      <div>
        {errors.map(error => (
          <p className={styles.error} key={error}>
            {error}
          </p>
        ))}
      </div>
      <Row>
        <Col>
          <button onClick={handleSubmit} className={styles.button}>
            send
          </button>
        </Col>
        <Col>
          <button className={styles.button}>upload</button>
        </Col>
      </Row>
    </div>
  );
};

export default MessageForm;
