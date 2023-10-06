import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, clearAuthUser } from "../src/store/authSlice";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./Firebase";
import { useEffect } from "react"; // Import useEffect from React

const useFirebaseAuth = () => {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth.authUser);

  const authStateChanged = async (user) => {
    if (!user) {
      dispatch(clearAuthUser());
      return;
    }

    const uuser = {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
    };

    dispatch(setAuthUser(uuser));
  };

  const signOut = () => {
    authSignOut(auth).then(() => dispatch(clearAuthUser()));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    signOut,
    authUser,
  };
};

export default useFirebaseAuth;
