import Home from "../../../public/home.svg";
import movie from "../../../public/movie.svg";
import serie from "../../../public/serie.svg";
import help from "../../../public/help.svg";

export const optionMenu = [
  { id: 1, name: "Inicio", icon: Home, path: "/" },
  {
    id: 2,
    name: "Peliculas",
    icon: movie,
    path: "/movies-series/movies-section",
  },
  { id: 3, name: "Series", icon: serie, path: "/movies-series/series-section" },
  { id: 4, name: "Acerca", icon: help, path: "/about/section" },
];
