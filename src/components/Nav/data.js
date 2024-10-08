import Home from "../../../public/home.svg";
import movie from "../../../public/movie.svg";
import serie from "../../../public/serie.svg";
import help from "../../../public/help.svg";
import cine from "../../../public/cinema-icon.svg";

export const optionMenu = [
  { id: 1, name: "Inicio", icon: Home, path: "/home" },
  {id: 2, name: "Peliculas", icon: movie, path: "/movies"},
  { id: 2, name: "Cines", icon: cine, path: "/en-cines" },
  { id: 3, name: "Series", icon: serie, path: "/series" },
  { id: 4, name: "Acerca", icon: help, path: "/about" },
];
