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

export default function Search({ funtion, value, filter, close }) {
  const [movieData, setMovieData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFiltered, setGenderFiltered] = useState([]);
  const [valueGender, setValueGender] = useState("");
  const [error, setError] = useState(null);
  const [nextPage, setNext] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = sessionStorage.getItem("currentPage");
      return savedPage ? Number(savedPage) : 1;
    }
    return 1;
  });

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

  // cada que el valueGender cambia busca los generos
  useEffect(() => {
    // busqueda de generos
    const getGender = async () => {
      try {
        const response = await fetch(
          `/api/movies/filtergender?page=${nextPage}&valueGender=${valueGender}`
        );
        const data = await response.json();
        setGenderFiltered(data);
      } catch (error) {
        setError(error);
      }
    };

    getGender();
  }, [valueGender, nextPage]);

  return (
    <>
      <div className="search">
        <input
          type="text"
          className="search__input"
          placeholder="Buscar"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        {/* boton de busqueda */}
        <div className="search__button">
          {value == "" ? (
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
              onClick={close}
            />
          )}
        </div>
        {/* filtro */}
        <div className="filter__container">
          <FilterNav funtion={filter} />
        </div>
      </div>
      <div style={{ display: "flex", color: "white" }}>
        <button className="search__click__input" onClick={getSearch}>
          Buscar
        </button>
      </div>
    </>
  );
}
