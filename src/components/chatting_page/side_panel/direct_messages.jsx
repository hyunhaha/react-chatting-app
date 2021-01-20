import React, { Component } from "react";
import styles from "./direct_messages.module.css";
import firebase from "../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";
class DirectMessages extends Component {
  state = {
    usersRef: firebase.database().ref("users"),
    users: [],
    user: this.props.currentUser,
    activeChatRoom: "",
  };
  componentDidMount() {
    if (this.props.user) {
      this.addUsersListeners(this.props.user.uid);
    }
  }
  addUsersListeners = currentUserId => {
    const { usersRef } = this.state;
    let usersArray = [];
    usersRef.on("child_added", dataSnapShot => {
      if (currentUserId !== dataSnapShot.key) {
        let user = dataSnapShot.val();
        user["uid"] = dataSnapShot.key;
        user["status"] = "offline";
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    });
  };
  getChatRoomId = userId => {
    const currentUserId = this.props.user.uid;
    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };
  changeChatRoom = user => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };
    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
  };
  setActiveChatRoom = userId => {
    this.setState({ activeChatRoom: userId });
  };

  renderDirectMessages = users =>
    users.length > 0 &&
    users.map(user => (
      <li
        key={user.uid}
        onClick={() => this.changeChatRoom(user)}
        className={
          this.state.activeChatRoom === user.uid ? styles.listItem : undefined
        }
      >
        # {user.name}
      </li>
    ));

  render() {
    const { users } = this.state;
    return (
      <div>
        <i className="fas fa-smile-wink"></i>
        <span> Direct Messages ({users.length})</span>
        <ul className={styles.list}>{this.renderDirectMessages(users)}</ul>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
  };
};
export default connect(mapStateToProps)(DirectMessages);
