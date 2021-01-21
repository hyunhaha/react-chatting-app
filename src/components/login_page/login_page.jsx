import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./login_page.module.css";
import firebase from "../../firebase";

const LoginPage = props => {
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, errors, handleSubmit } = useForm();

  const onSubmit = async data => {
    try {
      setLoading(true);
      await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);
      setLoading(false);
    } catch (error) {
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  };
  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className={styles.title}>Login</h3>
        <label>Email</label>
        <input
          name="email"
          type="email"
          ref={register({ required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This email is required</p>}

        <label>Password</label>
        <input
          name="password"
          type="password"
          ref={register({ required: true, minLength: 10 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>This password field is required</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Password must have at least 10 length</p>
        )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}
        <input type="submit" disabled={loading} />
        <Link className={styles.link} to="register">
          가입하기
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
