import React, { Component } from "react";
import Message from "./message";
import MessageHeader from "./message_header";
import MessageForm from "./message_form";
import styles from "./main_panel.module.css";
import { connect } from "react-redux";
import firebase from "../../../firebase";
import { setUserPosts } from "../../../redux/actions/chatRoom_action";
class MainPanel extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messageLoading: true,
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
  };
  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessageListener(chatRoom.id);
    }
  }
  handleSearchMessage = () => {
    const chatRoomMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
  };
  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => {
        this.handleSearchMessage();
      }
    );
  };
  addMessageListener = chatRoomId => {
    let messagesArray = [];
    this.setState({ messages: [] });
    this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapShot => {
      messagesArray.push(DataSnapShot.val());
      this.setState({
        messages: messagesArray,
        messageLoading: false,
      });
      this.userPostCount(messagesArray);
    });
  };
  userPostCount = messages => {
    let usersPost = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          image: message.user.image,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.dispatch(setUserPosts(usersPost));
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
    const { messages, searchResults, searchTerm } = this.state;
    return (
      <div className={styles.mainPanel}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

        <div className={styles.messageBox}>
          {searchTerm
            ? this.renderMessages(searchResults)
            : this.renderMessages(messages)}
        </div>

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
