import React, { useState, useEffect } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/Firebase";
import Modal from "../../../components/modal/Modal";

const Heart = ({ itemId, mediaType, heartLoading }) => {
  const [heartFill, setHeartFill] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const authUser = useSelector((state) => state.auth.authUser);
  const navigate = useNavigate();

  const newItem = {
    user: authUser?.uid,
    mediaType: mediaType,
    itemId: itemId,
  };

  const toggleFavoriteItem = async () => {
    try {
      if (!authUser) {
        // If the user is not authenticated, open the modal
        setModalIsOpen(true);
        return;
      }

      const q = query(
        collection(db, "favorites"),
        where("user", "==", authUser?.uid),
        where("itemId", "==", itemId),
        where("mediaType", "==", mediaType)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          // If the document exists, delete it (remove from favorites)
          setHeartFill(false); // Item is removed, so set heartFill to false
          await deleteDoc(doc.ref);
          console.log("Document is deleted");
        });
      } else {
        // If the document does not exist, add it (add to favorites)
        setHeartFill(true); // Item is added, so set heartFill to true
        const docRef = await addDoc(collection(db, "favorites"), newItem);
        console.log("Document written with ID: ", docRef.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authUser) {
      const fetchItem = async () => {
        try {
          const q = query(
            collection(db, "favorites"),
            where("user", "==", authUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const isFavorite = querySnapshot.docs.some(
            (doc) =>
              doc.data().itemId === itemId && doc.data().mediaType === mediaType
          );
          setHeartFill(isFavorite);
        } catch (err) {
          console.log(err);
        }
      };

      fetchItem();
    }
  }, [authUser, itemId, mediaType]);

  return (
    <div>
      <div className="heart-icon" onClick={toggleFavoriteItem}>
        {heartFill ? (
          <BsHeartFill className="heartIcon" />
        ) : (
          <BsHeart className="heartIcon" />
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onConfirm={() => {
          setModalIsOpen(false);
          navigate("/login");
        }}
        title="Sign in to Save Favorites"
        content="Unleash the power of favorites! Sign in to save your favorite movies and TV shows."
        btnContent="Signin"
      />
    </div>
  );
};

export default Heart;
