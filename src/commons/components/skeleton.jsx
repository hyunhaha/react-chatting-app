import React from "react";
import styles from "./skeleton.module.css";
const Skeleton = props => (
  <div className={styles.skeleton}>
    <div className={styles.avatar}></div>
    <div className={styles.name}></div>
    <div className={styles.message}></div>
  </div>
);

export default Skeleton;
