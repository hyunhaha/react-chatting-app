import React from "react";
import styles from "./chatting_room.module.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import firebase from "../../../firebase";
import { Component } from "react";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_action";
import Badge from "react-bootstrap/Badge";
export class ChattingRoom extends Component {
  state = {
    show: false,
    name: "",
    description: "",
    chattingRoomRef: firebase.database().ref("chatRooms"),
    messagesRef: firebase.database().ref("messages"),
    chattingRooms: [],
    firstLoad: true,
    activeChatRoomId: "",
    notifications: [],
  };

  componentDidMount() {
    this.addChattingRoomListener();
  }
  componentWillUnmount() {
    this.state.chattingRoomRef.off();
    this.state.chattingRooms.forEach(chatRoom => {
      this.state.messagesRef.child(chatRoom.id).off();
    });
  }
  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chattingRooms[0];
    if (this.state.firstLoad && this.state.chattingRooms.length > 0) {
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));
      this.setState({ activeChatRoomId: firstChatRoom.id });
    }
    this.setState({ firstLoad: false });
  };
  addChattingRoomListener = () => {
    let chattingRoomArray = [];
    this.state.chattingRoomRef.on("child_added", dataSnapShot => {
      chattingRoomArray.push(dataSnapShot.val());
      this.setState({ chattingRooms: chattingRoomArray }, () =>
        this.setFirstChatRoom()
      );
      this.addNotificationListener(dataSnapShot.key);
    });
  };
  addNotificationListener = chatRoomId => {
    this.state.messagesRef.child(chatRoomId).on("value", dataSnapShot => {
      if (this.props.chatRoom) {
        this.handleNotification(
          chatRoomId,
          this.props.chatRoom.id,
          this.state.notifications,
          dataSnapShot
        );
      }
    });
  };
  handleNotification = (
    chatRoomId,
    currentChatRoomId,
    notifications,
    dataSnapShot
  ) => {
    let lastTotal = 0;
    //몇번째 인덱스인지 구하기
    let index = notifications.findIndex(
      notification => notification.id === chatRoomId
    );
    if (index === -1) {
      //채팅방 알림이 없을 때
      notifications.push({
        id: chatRoomId,
        total: dataSnapShot.numChildren(), //전체 메시지갯수
        lastKnownTotal: dataSnapShot.numChildren(),
        count: 0,
      });
    } else {
      //이미 알림이 있을 때
      //상대방이 채팅을 보내고 있는 그 채팅방에 있지 않을 때
      if (chatRoomId !== currentChatRoomId) {
        lastTotal = notifications[index].lastKnownTotal;
        //알림으로 보여줄 숫자 구하기
        if (dataSnapShot.numChildren() - lastTotal > 0) {
          notifications[index].count = dataSnapShot.numChildren() - lastTotal;
        }
      }
      notifications[index].total = dataSnapShot.numChildren();
    }
    this.setState({ notifications });
  };
  handleClose = () => this.setState({ show: false });
  handleShow = () => {
    this.setState({ show: true });
    console.log("click");
  };

  handleSubmit = e => {
    e.preventDefault();
    const { name, description } = this.state;
    if (this.isFormValid(name, description)) {
      this.addChattingRoom();
    }
  };
  addChattingRoom = async () => {
    const key = this.state.chattingRoomRef.push().key;
    const { name, description } = this.state;
    const { user } = this.props;
    const newChattingRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };
    try {
      await this.state.chattingRoomRef.child(key).update(newChattingRoom);
      this.setState({
        name: "",
        description: "",
        show: false,
      });
    } catch (error) {
      alert(error);
    }
  };
  isFormValid = (name, description) => name && description;
  changeChattingRoom = room => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
    this.clearNotifications();
  };
  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.props.chatRoom.id
    );
    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].lastKnownTotal = this.state.notifications[
        index
      ].total;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };
  getNotificationCount = room => {
    let count = 0;
    this.state.notifications.forEach(notification => {
      if (notification.id === room.id) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  };
  renderChattingRoom = chattingRooms =>
    chattingRooms.length > 0 &&
    chattingRooms.map(room => (
      <li
        key={room.id}
        onClick={() => {
          this.changeChattingRoom(room);
        }}
        className={
          room.id === this.state.activeChatRoomId ? styles.color : undefined
        }
      >
        # {room.name}
        <Badge style={{ float: "right", marginTop: "4px" }} variant="danger">
          {this.getNotificationCount(room)}
        </Badge>
      </li>
    ));

  render() {
    return (
      <div>
        <div className={styles.chattingRoom}>
          <i className={`fas fa-paw ${styles.paw}`}></i>
          <div>chatting room</div>
          <div className={styles.plus} onClick={this.handleShow}>
            <i className="fas fa-plus"></i>
          </div>
        </div>
        <ul className={styles.chattingList}>
          {this.renderChattingRoom(this.state.chattingRooms)}
        </ul>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create chatting room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={e => this.setState({ name: e.target.value })}
                  type="text"
                  placeholder="Enter chatting room name"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  onChange={e => this.setState({ description: e.target.value })}
                  type="text"
                  placeholder="Enter chatting room description"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              create
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};
export default connect(mapStateToProps)(ChattingRoom);
