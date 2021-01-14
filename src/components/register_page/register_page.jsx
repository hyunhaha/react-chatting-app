import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./register_page.module.css";
import { useRef } from "react";
import firebase from "../../firebase";
import md5 from "md5";
const RegisterPage = props => {
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const [loading, setLoading] = useState(false);
  const password = useRef();
  const { register, watch, errors, handleSubmit } = useForm();
  password.current = watch("password");

  const onSubmit = async data => {
    try {
      setLoading(true);
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      await createdUser.user.updateProfile({
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });

      await firebase.database().ref("users").child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });
      setLoading(false);
      console.log(createdUser);
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
        <h3 className={styles.title}>Register</h3>
        <label>Email</label>
        <input
          name="email"
          type="email"
          ref={register({ required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This email is required</p>}
        <label>Name</label>
        <input name="name" ref={register({ required: true, maxLength: 10 })} />
        {errors.name && errors.name.type === "required" && (
          <p>This name is required</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>You input exceed maximum length</p>
        )}
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
        <label>Password Confirm</label>
        <input
          name="password_confirm"
          type="password"
          ref={register({
            required: true,
            validate: val => val === password.current,
          })}
        />
        {errors.password_confirm &&
          errors.password_confirm.type === "required" && (
            <p>This password confirm field is required</p>
          )}
        {errors.password_confirm &&
          errors.password_confirm.type === "validate" && (
            <p>the password does not correct</p>
          )}
        {errorFromSubmit && <p>{errorFromSubmit}</p>}
        <input type="submit" disabled={loading} />
        <Link className={styles.link} to="login">
          아이디가 있디면
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
