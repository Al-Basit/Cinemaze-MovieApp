import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { auth } from "../../../firebase/Firebase";
import Spinner from "../../components/spinner/Spinner";

import useFirebaseAuth from "../../../firebase/Auth";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import "./style.scss";
import { setAuthUser } from "../../store/authSlice";

const provider = new GoogleAuthProvider();

const Register = () => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const { authUser } = useFirebaseAuth();

  const isLoading = useSelector((state) => state.auth.isLoading);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser]);

  const signupHandler = async () => {
    if (!email || !username || !password) return;
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      const uuser = {
        uid: user.uid,
        email: user.email,
        username,
      };
      dispatch(setAuthUser(uuser));
      console.log(user);
    } catch (error) {
      console.error("An error occured", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      console.log(user);
    } catch (error) {
      console.error("An error occured", error);
    }
  };

  return isLoading || (!isLoading && authUser) ? (
    <Spinner />
  ) : (
    <main className="flex-container">
      <div className="left-container">
        <div className="signup-form">
          <h1 className="title">Sign Up</h1>
          <p className="subtext">
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
          <div className="google-login" onClick={signInWithGoogle}>
            <div className="google-icon">
              <FcGoogle />
            </div>
            <span className="google-text">Login with Google</span>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-container">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="input-field"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="input-field"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="input-field"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="sign-up-btn" onClick={signupHandler}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className="right-container"></div>
    </main>
  );
};

export default Register;
