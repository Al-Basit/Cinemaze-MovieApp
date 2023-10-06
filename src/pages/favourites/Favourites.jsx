import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import { fetchDataFromApi } from "../../utils/api";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../../firebase/Firebase";
import "./style.scss";

const Favourites = () => {
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const authUser = useSelector((state) => state.auth.authUser);
  const [mediaType, setMediaType] = useState("");

  const items = [];

  const fetchItem = async (uid) => {
    try {
      const q = query(collection(db, "favorites"), where("user", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        items.push({ ...doc.data(), id: doc.id });
      });
      console.log(items);

      await fetchDataForItems();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataForItems = async () => {
    const promises = items.map(async (item) => {
      const { itemId, mediaType } = item;
      const res = await fetchDataFromApi(`/${mediaType}/${itemId}`);
      res.mediaType = mediaType;
      return res;
    });

    setMediaType(mediaType);

    try {
      const data = await Promise.all(promises);
      setResponses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authUser) {
      fetchItem(authUser.uid);
    }
  }, [authUser]);

  return (
    <>
      <Header />
      <div className="favouritesPage">
        <ContentWrapper>
          <h1 className="pageTitle">Favourites</h1>

          {/* Show the spinner while the data is being fetched. */}
          {loading && <Spinner initial={true} />}

          {/* Only execute the following code if the data has been fetched. */}
          {!loading &&
            (responses.length > 0 ? (
              <div className="content">
                {responses.map((item) => (
                  <MovieCard
                    key={item.id}
                    data={item}
                    mediaType={item.mediaType}
                  />
                ))}
              </div>
            ) : (
              <p className="no-favourites">No favourites yet!</p>
            ))}
        </ContentWrapper>
      </div>
      <Footer />
    </>
  );
};

export default Favourites;
