"use client";
import { useState, useEffect } from "react";
import "@/components/MediaCard/postercard.scss";
import Button from "@/components/Buttons/Button";
// import LayoutMovieSection from "@/layouts/Layout";
import Container from "@/components/LoadingContainer/Container";
import Error from "@/components/Error/Error";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Search from "@/components/SearchInput/Search";

export default function Movies() {
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

  // cada que el nextpage cambia busca una nueva pagina
  useEffect(() => {
    const getDataMovie = async () => {
      try {
        // ranking popular de peliculas
        const response = await fetch(`/api/movies?page=${nextPage}`);
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        setError(error);
      }
    };

    getDataMovie();
  }, [nextPage]);

  // cada que el search cambia busca las peliculas
  useEffect(() => {
    const getSearch = async () => {
      try {
        const response = await fetch(`/api/movies/searcher?value=${search}`);
        if (response.status === 200) {
          const data = await response.json();
          setDataSearch(data);
        } else {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (search !== "" && search !== null && search !== undefined) {
      getSearch();
    }
  }, [search]);

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
        console.error(error);
        setError(error);
      }
    };

    getGender();
  }, [valueGender, nextPage]);

  // cada que el nextpage cambia guarda el valor en el session storage
  useEffect(() => {
    sessionStorage.setItem("currentPage", nextPage.toString());
  }, [nextPage]);

  // busqueda de paginas --> + 1
  const handlerNextMovie = () => {
    setNext(nextPage + 1);
  };

  // busqueda de paginas --> - 1
  const handlerPrevMovie = () => {
    setNext(nextPage - 1);
  };

  // si hay un error renderiza --> error component
  if (error) {
    return <Error message={"ocurrio un error de parte de nosotros :("} />;
  }

  // atrapa el valor de search y lo setea en el estado
  const handlerSearch = (e) => {
    setSearch(e.target.value);
  };

  // atrapa el valor de uno de los filtros
  const handleButtonClick = (id, value) => {
    setValueGender(id);
  };

  const handlerCloseSearch = () => {
    setSearch("");
  };

  // Función de búsqueda de películas
  let result = [];
  if (!search && !valueGender) {
    // Si no hay término de búsqueda ni género seleccionado, mostrar todas las películas
    result = movieData.results;
  } else if (!search && valueGender) {
    // Si no hay término de búsqueda pero hay un género seleccionado, mostrar películas filtradas por género
    result = genderFiltered.results;
  } else if (search && !valueGender) {
    // Si hay un término de búsqueda pero no hay género seleccionado, mostrar resultados de búsqueda
    result = dataSearch?.results?.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    // Si hay término de búsqueda y también un género seleccionado, aplicar ambos filtros
    result = dataSearch.results
      .filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((movie) => movie.genre_ids.includes(valueGender));
  }

  //variables de animacion
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };


  return (
    <>
      {/* buscador  */}
      <div className="searcher">
        <Search
          funtion={handlerSearch}
          filter={handleButtonClick}
          value={search}
          close={handlerCloseSearch}
        />
      </div>

      <div className="movie_title">
        <h3>Peliculas</h3>
      </div>
      
      {/* contedor de peliculas */}
      <motion.div
        className="contenedor"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {result?.map((movie) => (
          <motion.div variants={item}>
            <MediaCardDynamic data={movie} key={movie.id} />
          </motion.div>
        ))}
        {nextPage == 1 ? "" : <Button funtionPage={handlerPrevMovie} />}
        <Button isNext funtionPage={handlerNextMovie} />
      </motion.div>
    </>
  );
}

  const MediaCardDynamic = dynamic(
    () => import("@/components/MediaCard/MediaCard"),
    {
      loading: () => <Container />,
      ssr: false,
    }
  );