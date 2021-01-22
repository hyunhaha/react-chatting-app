import React, { Component } from "react";
import Message from "./message";
import MessageHeader from "./message_header";
import MessageForm from "./message_form";
import styles from "./main_panel.module.css";
import { connect } from "react-redux";
import firebase from "../../../firebase";
import { setUserPosts } from "../../../redux/actions/chatRoom_action";
import Skeleton from "../../../commons/components/skeleton";
class MainPanel extends Component {
  messageEndRef = React.createRef();
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messageLoading: true,
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
    typingRef: firebase.database().ref("typing"),
    typingUsers: [],
    listenersList: [],
  };
  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessageListener(chatRoom.id);
      this.addTypingListener(chatRoom.id);
    }
  }
  componentDidUpdate() {
    if (this.messageEndRef) {
      this.messageEndRef.scrollIntoView({ behavior: "smooth" });
    }
  }
  componentWillUnmount() {
    this.state.messagesRef.off();
    this.removeListeners(this.state.listenersList);
  }
  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };
  addTypingListener = chatRoomId => {
    let typingUsers = [];
    this.state.typingRef.child(chatRoomId).on("child_added", DataSnapShot => {
      if (DataSnapShot.key !== this.props.user.uid) {
        typingUsers = typingUsers.concat({
          id: DataSnapShot.key,
          name: DataSnapShot.val(),
        });
        this.setState({ typingUsers });
      }
    });
    this.addToListenersList(chatRoomId, this.state.typingRef, "child_added");
    this.state.typingRef.child(chatRoomId).on("child_removed", DataSnapShot => {
      const index = typingUsers.findIndex(user => user.id === DataSnapShot.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== DataSnapShot.key);
        this.setState({ typingUsers });
      }
    });
    this.addToListenersList(chatRoomId, this.state.typingRef, "child_removed");
  };
  addToListenersList = (id, ref, event) => {
    //이미 등록된 리스너인가?
    const index = this.state.listenersList.findIndex(listener => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });
    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({
        listenersList: this.state.listenersList.concat(newListener),
      });
    }
  };
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
  renderTypingUsers = typingUsers =>
    typingUsers.length > 0 &&
    typingUsers.map(user => {
      return (
        <span key={user.id}>{user.name}님이 채팅을 입력하고 있습니다.</span>
      );
    });
  renderMessageSkeleton = loading =>
    loading && (
      <>
        {[...Array(6)].map((e, idx) => (
          <Skeleton key={idx} />
        ))}
      </>
    );
  render() {
    const {
      messages,
      searchResults,
      searchTerm,
      typingUsers,
      messageLoading,
    } = this.state;
    return (
      <div className={styles.mainPanel}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

        <div className={styles.messageBox}>
          {this.renderMessageSkeleton(messageLoading)}
          {searchTerm
            ? this.renderMessages(searchResults)
            : this.renderMessages(messages)}
          {this.renderTypingUsers(typingUsers)}
          <div ref={node => (this.messageEndRef = node)} />
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
