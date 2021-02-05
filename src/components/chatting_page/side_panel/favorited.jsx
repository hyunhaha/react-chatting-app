import styles from "./favorited.module.css";
import firebase from "../../../firebase";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";
class Favorited extends Component {
  state = {
    usersRef: firebase.database().ref("users"),
    favoritedChatRooms: [],
    activeChatRoomId: "",
  };
  componentDidMount() {
    if (this.props.user) {
      this.addListListener(this.props.user.uid);
    }
  }
  componentWillUnmount() {
    if (this.props.user) {
      this.removeListener(this.props.user.uid);
    }
  }
  removeListener = userId => {
    this.state.usersRef.child(`${userId}/favorited`).off();
  };
  addListListener = userId => {
    const { usersRef } = this.state;
    usersRef
      .child(userId)
      .child("favorited")
      .on("child_added", dataSnapShot => {
        const favoritedChatRooms = {
          id: dataSnapShot.key,
          ...dataSnapShot.val(),
        };
        this.setState({
          favoritedChatRooms: [
            ...this.state.favoritedChatRooms,
            favoritedChatRooms,
          ],
        });
      });
    usersRef
      .child(userId)
      .child("favorited")
      .on("child_removed", dataSnapShot => {
        const chatRoomToRemove = {
          id: dataSnapShot.key,
          ...dataSnapShot.val(),
        };
        const filteredChatRooms = this.state.favoritedChatRooms.filter(
          chatRoom => chatRoom.id !== chatRoomToRemove.id
        );
        this.setState({ favoritedChatRooms: filteredChatRooms });
      });
  };

  changeChattingRoom = room => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
  };
  renderFavoritedChatRooms = favoritedChatRooms =>
    favoritedChatRooms.length > 0 &&
    favoritedChatRooms.map(chatRoom => (
      <li
        onClick={() => this.changeChattingRoom(chatRoom)}
        className={
          chatRoom.id === this.state.activeChatRoomId ? styles.color : undefined
        }
        key={chatRoom.id}
      >
        # {chatRoom.name}
      </li>
    ));

  render() {
    const { favoritedChatRooms } = this.state;
    return (
      <div>
        <i className="fas fa-bookmark"></i>
        <span> Favorited ({favoritedChatRooms.length})</span>
        <ul className={styles.list}>
          {this.renderFavoritedChatRooms(favoritedChatRooms)}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
  };
};
export default connect(mapStateToProps)(Favorited);
