import React from "react";
import "./style.scss";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import HeroBanner from "./heroBanner/HeroBanner";
import Trending from "./trending/Trending";
import Popular from "./popular/Popular";
import TopRated from "./topRated/TopRated";

function Home() {
  return (
    <div className="homePage">
      <Header />
      <HeroBanner />
      <Trending />
      <Popular />
      <TopRated />
      <Footer />
    </div>
  );
}

export default Home;
