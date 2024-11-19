"use client";
import "./search.css";
import FilterNav from "../Filter/FilterNav";
import Image from "next/image";
import SearchIcon from "../../../public/search.svg";
import closeSearch from "../../../public/close-search.svg";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchMovie } from "@/slices/searchMovieSlice";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const Search = () => {
  const [movieData, setMovieData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFiltered, setGenderFiltered] = useState([]);
  const [valueGender, setValueGender] = useState("");

  // dispatch de redux
  const dispatch = useDispatch();

  // busqueda de peliculas
  const getSearch = async () => {
    if (search !== "" && search !== null && search !== undefined) {
      toast.loading("Buscando...", {
        id: "loading",
        duration: 5000,
        position: "bottom-center",
      });
      try {
        const response = await fetch(`/api/movies/searcher?value=${search}`);
        if (response.status !== 200) {
          setError("Error al obtener las peliculas");
        }
        const data = await response.json();
        dispatch(searchMovie(data));
      } catch (error) {
        setError("Error al obtener las peliculas");
        toast.error("Error al obtener las peliculas");
      }
    } else {
      toast.error("Por favor ingrese un valor de busqueda");
      dispatch(searchMovie([]));
    }
  };

  const clearInput = () => { 
    setSearch("");
    dispatch(searchMovie([]));
  }

  // useEffect(() => {
  //   const getGender = async () => {
  //     try {
  //       const response = await fetch(
  //         `/api/movies/filtergender?page=1&valueGender=${valueGender}`
  //       );
  //       const data = await response.json();
  //       setGenderFiltered(data);
  //     } catch (error) {
  //       setError(error);
  //     }
  //   };

  //   getGender();
  // }, [valueGender]);

  return (
    <>
      <div className="search">
        <input
          type="text"
          className="search__input"
          placeholder="Buscar"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        {/* boton de busqueda */}
        <div className="search__button">
          {search === "" ? (
            <Image
              src={SearchIcon}
              width={21}
              height={21}
              alt={"search-icon"}
            />
          ) : (
            <Image
              src={closeSearch}
              width={21}
              height={21}
              alt={"close-search-icon"}
              onClick={clearInput}
            />
          )}
        </div>
        {/* filtro */}
        <div className="filter__container">
          <FilterNav />
        </div>
      </div>
      <div className="search__click__input">
        <button className="button__search" onClick={getSearch}>
          Buscar
        </button>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(Search), {
  ssr: false,
});
