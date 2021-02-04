import React, { useEffect } from "react";
import styles from "./message_header.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import firebase from "../../../firebase";
const MessageHeader = ({ handleSearchChange }) => {
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const isPrivateChatRoom = useSelector(
    state => state.chatRoom.isPrivateChatRoom
  );
  const [isFavorited, setIsFavorited] = useState(false);
  const [usersToggle, setUsersToggle] = useState(false);
  const usersRef = firebase.database().ref("users");
  const user = useSelector(state => state.user.currentUser);
  const userPosts = useSelector(state => state.chatRoom.userPosts);
  useEffect(() => {
    if (chatRoom && user) {
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
          const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
          setIsFavorited(isAlreadyFavorited);
        }
      });
  };
  const handleFavorite = () => {
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
  const handleUserPost = e => {
    setUsersToggle(val => !val);
  };
  const focusOutUserPost = e => {
    setUsersToggle(false);
  };
  const renderUserPosts = userPosts =>
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <li key={i} className={styles.userPostsItem}>
          <img
            className={styles.userPostsItemImg}
            src={val.image}
            alt={val.name}
          />
          <div className={styles.userPostsItemDesc}>
            <div className={styles.userPostsUserName}>{key}</div>
            <div className={styles.userPostUserCount}>{val.count}개</div>
          </div>
        </li>
      ));
  const renderUser = userPosts =>
    Object.entries(userPosts)
      .sort((a, b) => a[0] - b[0])
      .map(
        ([key, val], i) =>
          i < 3 && (
            <img
              src={val.image}
              alt={val.name}
              key={i}
              className={styles.usersImg}
            />
          )
      );

  return (
    <div className={styles.messageHeader}>
      <div className={styles.chatRoomTitle}>
        <div className={styles.lock}>
          {isPrivateChatRoom ? (
            <i className="fas fa-lock fa-1x"></i>
          ) : (
            <i className="fas fa-unlock fa-1x"></i>
          )}
        </div>
        <div className={styles.chattingRoomName}>
          {chatRoom && chatRoom.name}
          <div className={styles.chattingRoomDesc}>
            <div>{chatRoom && chatRoom.description}</div>
            {!isPrivateChatRoom && (
              <div className={styles.createdByName}>
                <span className={styles.createdByText}>created by</span>
                <img
                  src={chatRoom && chatRoom.createdBy.image}
                  alt={chatRoom && chatRoom.createdBy.name}
                  className={styles.chatRoomImg}
                />
                <span>{chatRoom && chatRoom.createdBy.name}</span>
              </div>
            )}
          </div>
        </div>
        {!isPrivateChatRoom && (
          <button className={styles.private} onClick={handleFavorite}>
            {isFavorited ? "♥" : "♡"}
          </button>
        )}
        {!isPrivateChatRoom && (
          <div>
            <button
              className={styles.users}
              onClick={handleUserPost}
              onBlur={focusOutUserPost}
            >
              <div className={styles.usersList}>
                {userPosts && renderUser(userPosts)}
              </div>
              <span className={styles.usersCount}>
                {userPosts && Object.keys(userPosts).length}
              </span>
            </button>
            {
              <ul
                className={`${styles.usersPosts} ${
                  usersToggle ? styles.show : undefined
                }`}
              >
                {userPosts && renderUserPosts(userPosts)}
              </ul>
            }
          </div>
        )}
      </div>
      <div className={styles.search}>
        <form className={styles.searchForm} action="search">
          <input
            className={styles.searchBar}
            type="text"
            onChange={handleSearchChange}
            placeholder="search messages"
          />
        </form>
      </div>
    </div>
  );
};

export default MessageHeader;
