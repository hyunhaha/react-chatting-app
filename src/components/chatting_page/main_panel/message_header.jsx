import React, { useEffect } from "react";
import styles from "./message_header.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { useState } from "react";
import firebase from "../../../firebase";
import { useRef } from "react";
import Media from "react-bootstrap/Media";
const MessageHeader = ({ handleSearchChange }) => {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const isPrivateChatRoom = useSelector(
    state => state.chatRoom.isPrivateChatRoom
  );
  const [isFavorited, setIsFavorited] = useState(false);
  const usersRef = firebase.database().ref("users");
  const user = useSelector(state => state.user.currentUser);
  const userPosts = useSelector(state => state.chatRoom.userPosts);
  useEffect(() => {
    if (user && chatRoom) {
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, []);
  const addFavoriteListener = (chatRoomId, userId) => {
    usersRef
      .child(userId)
      .child("favorited")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const chatRoomIds = Object.keys(data.val());
          console.log(data.val(), "data.val()");
          console.log(chatRoomIds, "chatRoomIds");
          const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
          setIsFavorited(isAlreadyFavorited);
        }
      });
  };
  const handleFavorite = () => {
    console.log("click");
    if (isFavorited) {
      usersRef
        .child(`${user.uid}/favorited`)
        .child(chatRoom.id)
        .remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      setIsFavorited(prev => !prev); //현재 상태의 반대로
    } else {
      usersRef.child(`${user.uid}/favorited`).update({
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      });
      setIsFavorited(prev => !prev); //현재 상태의 반대로
    }
  };
  const renderUserPosts = userPosts =>
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <Media key={i}>
          <img
            style={{ borderRadius: "25px" }}
            width={48}
            height={48}
            className="mr-3"
            src={val.image}
            alt={val.name}
          />
          <Media.Body>
            <h6>{key}</h6>
            <span>{val.count} 개</span>
          </Media.Body>
        </Media>
      ));

  return (
    <div className={styles.messageHeader}>
      <Container>
        <Row className={styles.row1}>
          <Col className={styles.tr1td1}>
            {isPrivateChatRoom ? (
              <i className="fas fa-lock"></i>
            ) : (
              <i className="fas fa-unlock"></i>
            )}
            <div className={styles.chattingRoomName}>
              {chatRoom && chatRoom.name}
            </div>
            {!isPrivateChatRoom && (
              <span className={styles.private} onClick={handleFavorite}>
                {isFavorited ? "unfavorite" : `favorite`}
              </span>
            )}
          </Col>
          <Col className={styles.tr1td2}>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                onChange={handleSearchChange}
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>
        {!isPrivateChatRoom && (
          <div className={styles.userName}>
            <div>
              <Image
                src={chatRoom && chatRoom.createdBy.image}
                roundedCircle
                className={styles.chatRoomImg}
              />
              {chatRoom && chatRoom.createdBy.name}
            </div>
          </div>
        )}

        <Row>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: " 0 1rem" }}>
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    eventKey="0"
                    style={{
                      background: "none",
                      color: "#000000",
                      fontSize: "14px",
                    }}
                  >
                    Description
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{chatRoom && chatRoom.description}</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Card>
                <Card.Header style={{ padding: " 0 1rem" }}>
                  <Accordion.Toggle
                    as={Button}
                    variant="link"
                    eventKey="0"
                    style={{
                      background: "none",
                      color: "#000000",
                      fontSize: "14px",
                    }}
                  >
                    Posts count
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    {userPosts && renderUserPosts(userPosts)}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MessageHeader;
