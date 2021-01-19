import React from "react";
import styles from "./chatting_room.module.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import firebase from "../../../firebase";
import { Component } from "react";
import { setCurrentChatRoom } from "../../../redux/actions/chatRoom_action";
export class ChattingRoom extends Component {
  state = {
    show: false,
    name: "",
    description: "",
    chattingRoomRef: firebase.database().ref("chatRooms"),
    chattingRooms: [],
    firstLoad: true,
    activeChatRoomId: "",
  };

  componentDidMount() {
    this.addChattingRoomListener();
  }
  componentWillUnmount() {
    this.state.chattingRoomRef.off();
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
    });
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
    this.setState({ activeChatRoomId: room.id });
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
  };
};
export default connect(mapStateToProps)(ChattingRoom);
