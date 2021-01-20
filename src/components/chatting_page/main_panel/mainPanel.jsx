import React, { Component } from "react";
import Message from "./message";
import MessageHeader from "./message_header";
import MessageForm from "./message_form";
import styles from "./main_panel.module.css";
import { connect } from "react-redux";
import firebase from "../../../firebase";
class MainPanel extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messageLoading: true,
  };
  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessageListener(chatRoom.id);
    }
  }
  addMessageListener = chatRoomId => {
    let messagesArray = [];
    this.setState({ messages: [] });
    this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapShot => {
      messagesArray.push(DataSnapShot.val());
      this.setState({
        messages: messagesArray,
        messageLoading: false,
      });
    });
  };
  renderMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timeStamp}
        message={message}
        user={this.props.user}
      />
    ));

  render() {
    const { messages } = this.state;
    return (
      <div className={styles.mainPanel}>
        <MessageHeader />
        <div className={styles.messageBox}>{this.renderMessages(messages)}</div>

        <MessageForm />
      </div>
    );
  }
}
const MapStateToProps = state => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};
export default connect(MapStateToProps)(MainPanel);
