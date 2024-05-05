"use client";
import React from "react";
import LayoutMovieSection from "../Layout";
import "../../../components/PosterCard/postercard.scss";
import { useState, useEffect } from "react";
import Loading from "../../../components/Loader/Loading";
import Button from "../../../components/Buttons/Button";
import getSeries from "../../../services/Series/GetSeries";
import SerieCard from "../../../components/SeriesCard/SerieCard";
import Search from "../../../components/SearchInput/Search";
import GetSearchSeries from "../../../services/SearchSeries/Search";

export default function Series() {
  const [serieData, setSerieData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setSearch] = useState("");
  const [nextPage, setNext] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const GetdataSeries = async () => {
      try {
        const data = getSeries(setSerieData, nextPage);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    const SearchSeries = async () => {
      try {
        const data = GetSearchSeries(setDataSearch, search);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    SearchSeries();
    GetdataSeries();
  }, [nextPage, search]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // busqueda de paginas --> + 1
  const handlerNextMovie = () => {
    setNext(nextPage + 1);
  };

  const handlerPrevMovie = () => {
    setNext(nextPage - 1);
  };

  // atrapa el valor de search y lo setea en el estado
  const handlerSearch = (e) => {
    setSearch(e.target.value);
  };

  // funcion de busqueda de Series
  let result = [];
  if (!search) {
    result = serieData;
  } else {
    result = dataSearch.results.filter((movie) =>
      movie.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <LayoutMovieSection>
      <div className="searcher">
        <Search funtion={handlerSearch} />
      </div>
      <div className="contenedor">
        {loading ? (
          <Loading />
        ) : (
          result?.map((serie) => <SerieCard dataserie={serie} key={serie.id} />)
        )}
        {nextPage == 1 ? <></> : <Button funtionPage={handlerPrevMovie} />}
        <Button isNext funtionPage={handlerNextMovie} />
      </div>
    </LayoutMovieSection>
  );
}
