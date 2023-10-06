import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYpvZhlQ7dMueDNXyntnBsV21FlEhF6x4",
  authDomain: "cinamze-movieapp.firebaseapp.com",
  projectId: "cinamze-movieapp",
  storageBucket: "cinamze-movieapp.appspot.com",
  messagingSenderId: "566652523597",
  appId: "1:566652523597:web:47005698202644849b7804",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
