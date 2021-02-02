import React from "react";
import styles from "./user_panel.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import firebase from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import mime from "mime-types";
import { setPhotoURL } from "../../../redux/actions/user_action";
const UserPanel = props => {
  let dispatch = useDispatch();
  let user = useSelector(state => state.user.currentUser);
  const onLogout = () => {
    firebase.auth().signOut();
  };
  const fileInputRef = useRef();
  const onProfileChange = event => {
    fileInputRef.current.click();
  };
  const handleImage = async event => {
    const file = event.target.files[0];
    const metadata = { contentType: mime.lookup(file.name) };
    try {
      let uploadTaskSnapshot = await firebase
        .storage()
        .ref()
        .child(`user_image/${user.uid}`)
        .put(file, metadata);
      let getImageURL = await uploadTaskSnapshot.ref.getDownloadURL();
      await firebase.auth().currentUser.updateProfile({
        photoURL: getImageURL,
      });
      dispatch(setPhotoURL(getImageURL));
      await firebase
        .database()
        .ref("users")
        .child(user.uid)
        .update({ image: getImageURL });
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <h3 className={styles.title}>
        <i className="fas fa-comment-alt" />
        <span className={styles.titleName}>Slack Clone</span>
      </h3>
      <div className={styles.profile}>
        <Image
          src={user && user.photoURL}
          style={{ width: "30px", height: "30px" }}
          roundedCircle
        />
        <input
          type="file"
          className={styles.file}
          ref={fileInputRef}
          accept="image/jpeg, image/png"
          onChange={handleImage}
        />
        <Dropdown>
          <Dropdown.Toggle
            style={{ background: "transparent", border: "0px" }}
            id="dropdown-basic"
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={onProfileChange}>프로필 변경</Dropdown.Item>
            <Dropdown.Item onClick={onLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default UserPanel;
