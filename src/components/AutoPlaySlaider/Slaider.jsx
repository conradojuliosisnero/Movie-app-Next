"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./slaider.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import imageNull from "../../../public/image-no-found.svg";
import Link from "next/link";
import dynamic from "next/dynamic";

function PopularMoviesSlider({ dataMovies }) {
  const [settings, setSettings] = useState({
    dots: false,
    infinite: true,
    lazyLoad: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    speed: 300,
    cssEase: "ease",
    // autoplay: true,
    // autoplaySpeed: 2000,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSettings({
          ...settings,
          slidesToShow: 2,
        });
      } else if (window.innerWidth <= 425) {
        setSettings({
          ...settings,
          slidesToShow: 1,
        });
      } else {
        setSettings({
          ...settings,
          slidesToShow: 3,
        });
      }
    };

    // Listener para cambiar las opciones del slider cuando cambia el tamaño de la pantalla
    window.addEventListener("resize", handleResize);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [settings]);

  return (
    <div className="slider-container">
      <span className={styles.popularyTitle}>Top Popular en Peliculas</span>
      <Slider {...settings}>
        {dataMovies &&
          dataMovies.slice(0, 15).map((movie, index) => (
            <div key={movie.id} className={styles.contendCarrussel}>
              <div className={styles.poster}>
                <div className={styles.boxNumberMovie}>
                  <span className={styles.numberMovie} key={movie.id}>
                    {index + 1}
                  </span>
                </div>
                <Link href={`/movie-details/${movie.id}`}>
                  <Image
                    className={styles.posterImg}
                    src={`${
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        : imageNull
                    } `}
                    alt={dataMovies.title || "image-movie"}
                    width={100}
                    // loading="lazy"
                    height={100}
                  />
                </Link>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PopularMoviesSlider));
