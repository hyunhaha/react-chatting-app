import React from "react";
import styles from "./user_panel.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import firebase from "../../../firebase";
import { useSelector } from "react-redux";
const UserPanel = props => {
  let user = useSelector(state => state.user.currentUser);
  const onLogout = () => {
    firebase.auth().signOut();
  };
  return (
    <div>
      <h3 className={styles.title}>
        <i className="fas fa-comment-alt" />
        <div> Chatting</div>
      </h3>
      <div className={styles.profile}>
        <Image
          src={user && user.photoURL}
          style={{ width: "30px", height: "30px" }}
          roundedCircle
        />
        <Dropdown>
          <Dropdown.Toggle
            style={{ background: "transparent", border: "0px" }}
            id="dropdown-basic"
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">프로필 변경</Dropdown.Item>
            <Dropdown.Item onClick={onLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default UserPanel;
