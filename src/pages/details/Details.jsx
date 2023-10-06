import React from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import DetailsBanner from "./detailsBanner.jsx/DetailsBanner";
import Cast from "./cast/Cast";
import Similar from "./carousels/Simillar";
import VideosSection from "./videosSection/VideosSection";
import Recommendation from "./carousels/Recommendation";
function Details() {
  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );
  return (
    <div>
      <Header />
      <DetailsBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      <VideosSection data={data} loading={loading} />
      <Similar mediaType={mediaType} id={id} />
      <Recommendation mediaType={mediaType} id={id} />
      <Footer />
    </div>
  );
}

export default Details;
