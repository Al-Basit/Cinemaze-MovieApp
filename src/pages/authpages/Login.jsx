import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./style.scss";

import { auth } from "../../../firebase/Firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import useFirebaseAuth from "../../../firebase/Auth";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import { FcGoogle } from "react-icons/fc";

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { authUser } = useFirebaseAuth();

  const isLoading = useSelector((state) => state.auth.isLoading);

  const navigate = useNavigate();

  console.log(authUser, isLoading);

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser]);

  const loginHandler = async () => {
    if (!email || !password) return;
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      console.error("An error occurred", error);

      if (error.code === "auth/wrong-password") {
        alert("Wrong password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        alert("User not found. Please check your email or sign up.");
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      console.log(user);
    } catch (error) {
      console.error("An error occurred", error);

      if (error.code === "auth/popup-closed-by-user") {
        alert("Google sign-in popup closed by the user.");
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return isLoading || (!isLoading && authUser) ? (
    <Spinner />
  ) : (
    <main className="flex-container">
      <div className="left-container">
        <div className="login-form">
          <h1 className="title">Login</h1>
          <p className="subtext">
            Don't have an account ?{" "}
            <span className="signup-link" onClick={() => navigate("/register")}>
              Sign Up
            </span>
          </p>
          <div className="google-login">
            <div className="google-icon">
              <FcGoogle />
            </div>
            <span className="google-text" onClick={signInWithGoogle}>
              Login with Google
            </span>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button className="sign-in-btn" onClick={loginHandler}>
              Sign in
            </button>
          </form>
        </div>
      </div>
      <div className="right-container"></div>
    </main>
  );
};

export default Login;
