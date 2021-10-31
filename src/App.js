import React, { useEffect, useState } from "react";
import "./App.css";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeatureMovie from "./components/FeatureMovie";
import Header from "./components/Header";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomelist();
      setMovieList(list);

      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      setFeatureData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };
    window.addEventListener("scroll", scrollListener);
  });

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData && <FeatureMovie item={featuredData} />}
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://c.tenor.com/NerN41mjgV0AAAAC/netflix-intro.gif"
            alt="loading"
          />
        </div>
      )}
    </div>
  );
};
